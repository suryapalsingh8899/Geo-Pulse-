import Alert from "../models/Alert.js";
import User from "../models/User.js";
import { sendAlertSms } from "../utils/smsService.js";

// ─────────────────────────────────────────────
// In-memory cache: avoids hammering NASA/USGS
// on every request (APIs are slow, rate-limited)
// ─────────────────────────────────────────────
let alertCache = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchUSGSAlerts() {
  const res = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.features.map((f) => ({
    _id: `usgs_${f.id}`,
    title: f.properties.title,
    description: `Magnitude: ${f.properties.mag} Earthquake recorded. Location: ${f.properties.place}.`,
    severity: f.properties.mag > 7 ? "critical" : f.properties.mag > 6 ? "high" : f.properties.mag > 5 ? "medium" : "low",
    type: "earthquake",
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
    author: { name: "USGS (Official)" },
    isOfficial: true,
    createdAt: new Date(f.properties.time),
  }));
}

async function fetchEONETAlerts() {
  const res = await fetch(
    "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7",
    { signal: AbortSignal.timeout(15000) }
  );
  if (!res.ok) return [];
  const data = await res.json();

  return data.events
    .map((event) => {
      const geo = event.geometry[event.geometry.length - 1];
      let lng, lat;
      if (geo.type === "Point") {
        [lng, lat] = geo.coordinates;
      } else if (geo.type === "Polygon") {
        [lng, lat] = geo.coordinates[0][0];
      }
      if (lng === undefined || lat === undefined) return null;

      const category =
        event.categories?.length > 0 ? event.categories[0].title : "Other";

      // Map EONET category → human severity
      const highSeverity = ["Severe Storms", "Volcanoes", "Sea and Lake Ice"];
      const severity = highSeverity.includes(category) ? "high" : "medium";

      return {
        _id: `eonet_${event.id}`,
        title: event.title,
        description: `Active ${category} tracked by NASA Earth Observatory (EONET).`,
        severity,
        type: category.toLowerCase().replace(/ /g, "_"),
        lng,
        lat,
        author: { name: "NASA EONET" },
        isOfficial: true,
        createdAt: new Date(geo.date),
      };
    })
    .filter(Boolean);
}

async function getOfficialAlerts() {
  const now = Date.now();
  if (alertCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return alertCache; // Serve from cache — saves ~1-2s per request
  }

  // Fetch both APIs in parallel
  const [usgs, eonet] = await Promise.allSettled([
    fetchUSGSAlerts(),
    fetchEONETAlerts(),
  ]);

  const result = [
    ...(usgs.status === "fulfilled" ? usgs.value : []),
    ...(eonet.status === "fulfilled" ? eonet.value : []),
  ];

  alertCache = result;
  cacheTimestamp = now;
  return result;
}

// ─────────────────────────────────────────────
// GET /api/alerts
// Returns official + DB alerts, cached 10 min
// ─────────────────────────────────────────────
export const getAlerts = async (req, res) => {
  try {
    const [officialAlerts, dbAlerts] = await Promise.all([
      getOfficialAlerts(),
      Alert.find().sort({ createdAt: -1 }).lean(),
    ]);

    const allAlerts = [...officialAlerts, ...dbAlerts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Tell client to cache for 5 minutes too
    res.set("Cache-Control", "public, max-age=300");
    res.json(allAlerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// GET /api/alerts/:id
// ─────────────────────────────────────────────
export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).lean();
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    console.error("Error fetching alert:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Calculate distance in kilometers using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─────────────────────────────────────────────
// POST /api/alerts  (admin-created custom alert)
// ─────────────────────────────────────────────
export const createAlert = async (req, res) => {
  try {
    const { title, description, severity, type, lat, lng, author } = req.body;

    const alert = new Alert({
      title,
      description,
      severity: severity || "high",
      type: type || "other",
      lat,
      lng,
      author: author || {},
    });

    const createdAlert = await alert.save();

    // Bust the in-memory cache so the new alert appears immediately
    alertCache = null;

    // Fire-and-forget SMS blast — filter by user location
    User.find({ phone: { $exists: true, $ne: "" } }, "phone lastLat lastLng")
      .lean()
      .then((users) => {
        // Define danger radius in km based on severity
        const radii = { critical: 500, high: 300, medium: 150, low: 50 };
        const maxDistance = radii[severity || "high"] || 300;

        const affectedPhones = users
          .filter((u) => {
            // If user has no location, we might choose to skip or send anyway.
            // Sending to everyone if no location defeats the purpose, so we skip.
            // But if alert has no lat/lng, we probably send to no one.
            if (lat == null || lng == null) return false;
            
            const distance = getDistance(lat, lng, u.lastLat, u.lastLng);
            return distance <= maxDistance;
          })
          .map((u) => u.phone)
          .filter(Boolean);

        if (affectedPhones.length > 0) {
          sendAlertSms(affectedPhones, title, severity || "high").catch((err) =>
            console.error("SMS dispatch error:", err)
          );
        } else {
          console.log(`No users found within ${maxDistance}km of the alert.`);
        }
      })
      .catch((err) => console.error("Error loading users for SMS:", err));

    res.status(201).json(createdAlert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/alerts/:id
// ─────────────────────────────────────────────
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    await alert.deleteOne();
    alertCache = null; // Bust cache after deletion
    res.json({ message: "Alert removed" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
