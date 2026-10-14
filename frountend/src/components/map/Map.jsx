import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Viewer,
  Color,
  UrlTemplateImageryProvider,
  Cartesian3,
  CameraEventType,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Math as CesiumMath,
  CallbackProperty,
  ColorMaterialProperty,
  HeightReference,
  SceneMode,
  VerticalOrigin,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import ReportsButton from "../buttons/ReportsButton";
import ReportDetailModal from "../modals/ReportDetailModal";
import AddReportModal from "../modals/AddReportModal";
import EventDetailModal from "../modals/EventDetailModal";
import AlertDetailModal from "../modals/AlertDetailModal";
import AddEventModal from "../modals/AddEventModal";
import SettingsModal from "../modals/SettingsModal";
import { useTranslation } from "react-i18next";
import api from "../../services/api";

const emojiCanvasCache = {};
let COLOR_CRITICAL = null;
let COLOR_HIGH = null;
let COLOR_MEDIUM = null;

function getCachedEmojiCanvas(emoji, severity) {
  const key = `${emoji}_${severity}`;
  if (emojiCanvasCache[key]) {
    return emojiCanvasCache[key];
  }
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  const alertColor =
    severity === "critical"
      ? "rgba(255, 26, 26, 0.6)"
      : severity === "high"
      ? "rgba(255, 102, 0, 0.6)"
      : "rgba(255, 204, 0, 0.6)";

  const gradient = ctx.createRadialGradient(36, 36, 0, 36, 36, 36);
  gradient.addColorStop(0, alertColor);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 72, 72);

  ctx.font = "40px 'Segoe UI Emoji', Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 36, 40);

  emojiCanvasCache[key] = canvas;
  return canvas;
}

const mockEvents = [
  {
    id: 201,
    lat: 28.62,
    lng: 77.2,
    title: "Delhi Music Festival",
    description:
      "Annual music festival at Connaught Place featuring local bands and food stalls. Come enjoy the evening!",
    poster:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    timing: "6:00 PM - 11:00 PM, Oct 25",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1540039155732-684736dd6330?w=400&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?w=400&q=80",
    ],
    videos: [],
  },
  {
    id: 202,
    lat: 19.07,
    lng: 72.87,
    title: "Tech Innovators Conference",
    description: "A premier tech conference in Mumbai focusing on AI and Web3.",
    poster:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    timing: "9:00 AM - 5:00 PM, Nov 2-3",
    isPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    ],
    videos: [],
  },
  {
    id: 203,
    lat: 12.97,
    lng: 77.59,
    title: "Bangalore Food Carnival",
    description: "Taste the best street food and cuisines from all over India.",
    poster:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    timing: "11:00 AM - 10:00 PM, Dec 15",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    ],
    videos: [],
  },
];

function Map({
  isLoggedIn = false,
  onRequireLogin,
  reports = [],
  setReports,
  events = [],
  setEvents,
  alerts = [],
  setAlerts,
  alertsLoaded = false,
  onLoadAlerts,
  onAddReport,
  onAddEvent,
  onVote,
  onEventVote,
  onReportOpened,
  onEventOpened,
  onAlertOpened,
  onAuthorClick,
  userName,
  setUserName,
  isDarkMode = true,
  setDarkMode,
  onCurrentPageChange,
  searchTarget = null,
  onClearSearchTarget,
  is2DMode = false,
  onToggle2D3D,
}) {
  const { t } = useTranslation();
  const cesiumContainer = useRef(null);
  const viewerInstance = useRef(null);
  const zoomVelocityRef = useRef(0);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isEventMode, setIsEventMode] = useState(false);
  const [isAlertMode, setIsAlertMode] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const selectedReport = selectedReportId
    ? reports.find(
        (r) =>
          r.id?.toString() === selectedReportId?.toString() ||
          r._id?.toString() === selectedReportId?.toString()
      )
    : null;
  const [selectedEventId, setSelectedEventId] = useState(null);
  const selectedEvent = selectedEventId
    ? events.find(
        (e) =>
          e.id?.toString() === selectedEventId?.toString() ||
          e._id?.toString() === selectedEventId?.toString()
      )
    : null;
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const selectedAlert = selectedAlertId != null
    ? (alerts.find(
        (a) =>
          a._id?.toString() === selectedAlertId?.toString() ||
          a.id?.toString() === selectedAlertId?.toString()
      ) || null)
    : null;
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isSelectingEventLocation, setIsSelectingEventLocation] =
    useState(false);
  const [newReportLocation, setNewReportLocation] = useState(null);
  const [newEventLocation, setNewEventLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isLiveTrackersOpen, setIsLiveTrackersOpen] = useState(false);
  const [activeTrackerFilter, setActiveTrackerFilter] = useState("all");
  const liveTrackersDropdownRef = useRef(null);

  const trackerOptions = [
    { key: "earthquake", label: "Earthquakes", icon: "💥" },
    { key: "volcano", label: "Volcanoes", icon: "🌋" },
    { key: "tsunami", label: "Tsunamis", icon: "🌊" },
    { key: "wildfire", label: "Wildfires", icon: "🔥" },
    { key: "storm", label: "Severe Storms", icon: "⛈️" },
    { key: "cyclone", label: "Cyclones", icon: "🌀" },
  ];

  const trackerCounts = useMemo(() => {
    const counts = {
      all: alerts.length,
      earthquake: 0,
      volcano: 0,
      tsunami: 0,
      wildfire: 0,
      storm: 0,
      cyclone: 0,
    };
    alerts.forEach((a) => {
      const t = (a.type || "").toLowerCase().replace(/_/g, " ");
      if (t.includes("earthquake")) counts.earthquake++;
      else if (t.includes("volcano")) counts.volcano++;
      else if (t.includes("tsunami")) counts.tsunami++;
      else if (t.includes("wildfire") || t.includes("fire")) counts.wildfire++;
      else if (t.includes("storm")) counts.storm++;
      else if (t.includes("cyclone") || t.includes("hurricane")) counts.cyclone++;
    });
    return counts;
  }, [alerts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        liveTrackersDropdownRef.current &&
        !liveTrackersDropdownRef.current.contains(e.target)
      ) {
        setIsLiveTrackersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleOpenAlerts = () => {
    setIsAlertMode(true);
    setIsMobileMenuOpen(false);
    if (!alertsLoaded && onLoadAlerts) {
      setAlertsLoading(true);
      Promise.resolve(onLoadAlerts()).finally(() => {
        setAlertsLoading(false);
      });
    }
  };

  const currentPageInfo = isSelectingLocation
    ? {
        eyebrow: "Pick Location · Step 1 of 2",
        icon: "📍",
        title: "Pin Report Location",
        subtitle: "Click anywhere on the globe to choose where this happened",
        badge: "Click on Globe",
        badgeBg: "rgba(45, 212, 191, 0.2)",
        badgeColor: "#2dd4bf",
        badgeBorder: "rgba(45, 212, 191, 0.45)",
        borderColor: "rgba(45, 212, 191, 0.5)",
        glow: "0 0 25px rgba(45, 212, 191, 0.28)",
        accentColor: "#2dd4bf",
      }
    : isSelectingEventLocation
    ? {
        eyebrow: "Pick Venue · Step 1 of 2",
        icon: "📌",
        title: "Pin Event Location",
        subtitle: "Click anywhere on the globe to choose your event place",
        badge: "Click on Globe",
        badgeBg: "rgba(236, 72, 153, 0.2)",
        badgeColor: "#ec4899",
        badgeBorder: "rgba(236, 72, 153, 0.45)",
        borderColor: "rgba(236, 72, 153, 0.5)",
        glow: "0 0 25px rgba(236, 72, 153, 0.28)",
        accentColor: "#ec4899",
      }
    : isAlertMode
    ? {
        eyebrow: "Live Disaster Radar",
        icon: "⚠️",
        title: "Disaster Alerts",
        subtitle: "Live earthquakes & natural hazard warnings from USGS and NASA",
        badge: alertsLoading ? "Loading..." : `${alerts.length} Active Alerts`,
        badgeBg: "rgba(239, 68, 68, 0.2)",
        badgeColor: "#f87171",
        badgeBorder: "rgba(239, 68, 68, 0.45)",
        borderColor: "rgba(239, 68, 68, 0.5)",
        glow: "0 0 30px rgba(239, 68, 68, 0.3)",
        accentColor: "#f87171",
      }
    : isReportMode
    ? {
        eyebrow: "Community Reports",
        icon: "📋",
        title: "Community Reports",
        subtitle: "Local road problems, accidents, waterlogging & citizen updates",
        badge: `${reports.length} Reports`,
        badgeBg: "rgba(245, 158, 11, 0.2)",
        badgeColor: "#fbbf24",
        badgeBorder: "rgba(245, 158, 11, 0.45)",
        borderColor: "rgba(245, 158, 11, 0.5)",
        glow: "0 0 25px rgba(245, 158, 11, 0.25)",
        accentColor: "#fbbf24",
      }
    : isEventMode
    ? {
        eyebrow: "Local Events & Meetups",
        icon: "🎟️",
        title: "Local Events",
        subtitle: "Community gatherings, festivals, music & upcoming meetups",
        badge: `${events.length} Events`,
        badgeBg: "rgba(236, 72, 153, 0.2)",
        badgeColor: "#f472b6",
        badgeBorder: "rgba(236, 72, 153, 0.45)",
        borderColor: "rgba(236, 72, 153, 0.5)",
        glow: "0 0 25px rgba(236, 72, 153, 0.25)",
        accentColor: "#f472b6",
      }
    : {
        eyebrow: "Live 3D World Map",
        icon: "🌍",
        title: "Global Overview",
        subtitle: "Real-time world view with community reports and live disaster alerts",
        badge: "Live Earth",
        badgeBg: "rgba(56, 189, 248, 0.16)",
        badgeColor: "#38bdf8",
        badgeBorder: "rgba(56, 189, 248, 0.4)",
        borderColor: "rgba(56, 189, 248, 0.4)",
        glow: "0 0 24px rgba(56, 189, 248, 0.2)",
        accentColor: "#38bdf8",
      };

  useEffect(() => {
    if (onCurrentPageChange) {
      onCurrentPageChange(currentPageInfo);
    }
  }, [
    currentPageInfo.title,
    currentPageInfo.badge,
    onCurrentPageChange,
  ]);

  useEffect(() => {
    let watchId;
    if (locationEnabled && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error watching location:", error);
          if (error.code === 1) {
            // PERMISSION_DENIED
            setLocationEnabled(false);
            setUserLocation(null);
            alert(
              "Location permission denied. Please enable it in your browser settings.",
            );
          }
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
      );
    } else {
      setUserLocation(null);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationEnabled]);

  // Sync user location to backend if logged in
  useEffect(() => {
    if (isLoggedIn && userLocation) {
      api.auth.updateProfile({
        lastLat: userLocation.lat,
        lastLng: userLocation.lng,
      }).catch(err => console.error("Failed to sync location:", err));
    }
  }, [isLoggedIn, userLocation]);

  useEffect(() => {
    if (viewerInstance.current && userLocation && locationEnabled) {
      const viewer = viewerInstance.current;
      let locationEntity = viewer.entities.getById("user-location-dot");
      if (!locationEntity) {
        viewer.entities.add({
          id: "user-location-dot",
          position: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat),
          point: {
            pixelSize: 12,
            color: Color.fromCssColorString('#3b82f6').withAlpha(0.99),
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: 1.2e7,
          },
        });
      } else {
        locationEntity.position = Cartesian3.fromDegrees(
          userLocation.lng,
          userLocation.lat,
        );
      }
      viewer.scene.requestRender();
    } else if (viewerInstance.current && (!locationEnabled || !userLocation)) {
      const viewer = viewerInstance.current;
      const locationEntity = viewer.entities.getById("user-location-dot");
      if (locationEntity) {
        viewer.entities.remove(locationEntity);
        viewer.scene.requestRender();
      }
    }
  }, [userLocation, locationEnabled]);

  useEffect(() => {
    if (cesiumContainer.current && !viewerInstance.current) {
      // Initialize the Cesium Viewer directly
      // Initialize the Cesium Viewer directly
      // Detect mobile to apply lighter rendering settings
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      viewerInstance.current = new Viewer(cesiumContainer.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        selectionIndicator: false,
        baseLayer: false, // Do not load default imagery (Bing Maps)
        // requestRenderMode: true prevents constant per-frame redraws — critical for mobile battery/performance
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity, // Only render when explicitly requested
        // Default skyBox and skyAtmosphere are enabled to show the beautiful starry space background
      });

      const viewer = viewerInstance.current;
      viewer.scene.fog.enabled = false; // Disable fog calculation to drastically save GPU fragment shader processing

      // Prevent 3D buildings from rendering through the globe and floating in the sky
      viewer.scene.globe.depthTestAgainstTerrain = true;

      // Snapchat Earth has a beautiful glowing blue/cyan atmosphere around the dark globe
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.hueShift = -0.1; // Shift towards blue/cyan
        viewer.scene.skyAtmosphere.saturationShift = 0.5; // Make the glow more vibrant
        viewer.scene.skyAtmosphere.brightnessShift = 0.5; // Make it glow brighter
      }

      // Snapchat Dark Mode: Background is totally black void
      viewer.scene.backgroundColor = Color.BLACK;
      if (viewer.scene.sun) viewer.scene.sun.show = false; // Saves render time
      if (viewer.scene.moon) viewer.scene.moon.show = false; // Saves render time

      // Use Google Maps raster tiles to provide Snapchat/Google Maps level label density, forced strictly to English (hl=en)
      const osmProvider = new UrlTemplateImageryProvider({
        url: "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
        credit: "© Google Maps",
        maximumLevel: 19,
        enablePickFeatures: false,
      });
      const baseLayer = viewer.imageryLayers.addImageryProvider(osmProvider);

      // Configure Light or Dark Mode Initially
      if (isDarkMode) {
        baseLayer.brightness = 0.25;
        baseLayer.contrast = 1.35;
        baseLayer.saturation = 0.1;
        baseLayer.gamma = 0.8;
      } else {
        baseLayer.brightness = 1.0;
        baseLayer.contrast = 1.0;
        baseLayer.saturation = 1.0;
        baseLayer.gamma = 1.0;
      }

      // Set view directly to India to massively speed up initial load (avoids loading tiles along a flight path)
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(78.9629, 20.5937, 5000000.0), // Center of India at ~5000km height
      });
      // Limit zoom out
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000.0;
      // Mobile-adaptive tile settings: reduce memory and tile count on mobile
      viewer.scene.globe.tileCacheSize = isMobile ? 100 : 500;
      // Higher error = fewer tiles loaded = faster (4 on mobile, 2 on desktop)
      viewer.scene.globe.maximumScreenSpaceError = isMobile ? 4 : 2;
      // Prevent camera from clipping underground (causes blank black screen)
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;

      // Remove Cesium logo/credits overlay for clean UI
      viewer.cesiumWidget.creditContainer.style.display = "none";

      // Disable default double-click zooming on entities (prevents camera clipping/blanking)
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
      );

      // Optimize native camera controls for smooth interaction
      const controller = viewer.scene.screenSpaceCameraController;
      controller.inertiaSpin = 0.9;
      controller.inertiaTranslate = 0.9;
      controller.inertiaZoom = 0.8; // Smooth deceleration on wheel scroll zoom
      controller.zoomEventTypes = [
        CameraEventType.WHEEL,
        CameraEventType.PINCH,
      ];
      // Enforce pitch limit when zoomed in
      viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        { eventType: CameraEventType.LEFT_DRAG, modifier: 1 }, // KeyboardEventModifier.CTRL is 1
        { eventType: CameraEventType.RIGHT_DRAG, modifier: 1 },
      ];

      const enforcePitch = () => {
        if (viewer.scene.mode !== SceneMode.SCENE3D) return;
        if (viewer.camera.pitch > CesiumMath.toRadians(-20)) {
          viewer.camera.setView({
            orientation: {
              heading: viewer.camera.heading,
              pitch: CesiumMath.toRadians(-20),
              roll: 0.0,
            },
          });
        }
      };
      viewer.camera.changed.addEventListener(enforcePitch);

      // Custom smooth inertia zoom for trackpads
      const handleTick = () => {
        // Continuous render frames during 2D/3D morphing transition
        if (viewer.scene.mode === SceneMode.MORPHING) {
          viewer.scene.requestRender();
        }

        if (Math.abs(zoomVelocityRef.current) > 0.01) {
          if (zoomVelocityRef.current > 0) {
            if (viewer.camera.positionCartographic.height >= 10000000) {
              zoomVelocityRef.current = 0;
            } else {
              viewer.camera.zoomOut(zoomVelocityRef.current * 0.15);
            }
          } else {
            viewer.camera.zoomIn(-zoomVelocityRef.current * 0.15);
          }
          zoomVelocityRef.current *= 0.85; // Apply friction

          // Request render since we disabled continuous rendering
          viewer.scene.requestRender();
        }
      };

      viewer.clock.onTick.addEventListener(handleTick);
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []); // Empty dependency array ensures viewer is created only once

  // Handle 2D / 3D mode switching using Cesium's morphTo2D and morphTo3D
  useEffect(() => {
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;
    if (viewer.scene.mode === SceneMode.MORPHING) return;

    if (is2DMode && viewer.scene.mode !== SceneMode.SCENE2D) {
      viewer.scene.morphTo2D(1.2);
      viewer.scene.requestRender();
    } else if (!is2DMode && viewer.scene.mode !== SceneMode.SCENE3D) {
      viewer.scene.morphTo3D(1.2);
      viewer.scene.requestRender();
    }
  }, [is2DMode]);

  // Handle morph complete listener to ensure Cesium renders the final transformed state
  useEffect(() => {
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;
    const handleMorphComplete = () => {
      viewer.scene.requestRender();
    };
    viewer.scene.morphComplete.addEventListener(handleMorphComplete);
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.scene.morphComplete.removeEventListener(handleMorphComplete);
      }
    };
  }, []);

  // Helper to create a search marker pin canvas
  const createSearchPinCanvas = (title) => {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 72;
    const ctx = canvas.getContext("2d");

    ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
    ctx.shadowBlur = 10;

    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(10, 8, 160, 36, 18);
    } else {
      ctx.rect(10, 8, 160, 36);
    }
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(82, 44);
    ctx.lineTo(98, 44);
    ctx.lineTo(90, 56);
    ctx.closePath();
    ctx.fillStyle = "#38bdf8";
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#38bdf8";
    ctx.font = "14px 'Segoe UI Emoji', sans-serif";
    ctx.fillText("📍", 24, 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px 'Outfit', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const label = title && title.length > 14 ? title.substring(0, 13) + "…" : (title || "Location");
    ctx.fillText(label, 44, 26);

    return canvas;
  };

  // Fly to searched location
  useEffect(() => {
    if (!searchTarget || !viewerInstance.current) return;
    const viewer = viewerInstance.current;
    const { lat, lng, name, boundingBox } = searchTarget;

    const oldPin = viewer.entities.getById("search-location-pin");
    if (oldPin) viewer.entities.remove(oldPin);

    let targetAltitude = 25000.0;
    if (boundingBox && boundingBox.length === 4) {
      const south = parseFloat(boundingBox[0]);
      const north = parseFloat(boundingBox[1]);
      const west = parseFloat(boundingBox[2]);
      const east = parseFloat(boundingBox[3]);
      const latDiff = Math.abs(north - south);
      const lonDiff = Math.abs(east - west);
      const maxSpan = Math.max(latDiff, lonDiff);
      targetAltitude = Math.min(Math.max(maxSpan * 111000 * 1.2, 5000), 5000000);
    }

    const pinCanvas = createSearchPinCanvas(name);
    viewer.entities.add({
      id: "search-location-pin",
      position: Cartesian3.fromDegrees(lng, lat),
      billboard: {
        image: pinCanvas,
        verticalOrigin: VerticalOrigin.BOTTOM,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: 1.2e7,
      },
      description: name || "Searched Location",
    });

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(lng, lat, targetAltitude),
      duration: 1.8,
      complete: () => {
        viewer.scene.requestRender();
      },
    });

    viewer.scene.requestRender();

    const timer = setTimeout(() => {
      if (viewerInstance.current && !viewerInstance.current.isDestroyed()) {
        const pin = viewerInstance.current.entities.getById("search-location-pin");
        if (pin) {
          viewerInstance.current.entities.remove(pin);
          viewerInstance.current.scene.requestRender();
        }
      }
      if (onClearSearchTarget) onClearSearchTarget();
    }, 15000);

    return () => clearTimeout(timer);
  }, [searchTarget]);

  // Effect to toggle dark/light mode on the fly
  useEffect(() => {
    if (viewerInstance.current) {
      const viewer = viewerInstance.current;
      const baseLayer = viewer.imageryLayers.get(0);
      if (baseLayer) {
        if (isDarkMode) {
          baseLayer.brightness = 0.25;
          baseLayer.contrast = 1.35;
          baseLayer.saturation = 0.1;
          baseLayer.gamma = 0.8;
          viewer.scene.backgroundColor = Color.BLACK;
          if (viewer.scene.skyAtmosphere) {
            viewer.scene.skyAtmosphere.hueShift = -0.1;
            viewer.scene.skyAtmosphere.saturationShift = 0.5;
            viewer.scene.skyAtmosphere.brightnessShift = 0.5;
          }
        } else {
          baseLayer.brightness = 1.0;
          baseLayer.contrast = 1.0;
          baseLayer.saturation = 1.0;
          baseLayer.gamma = 1.0;
          viewer.scene.backgroundColor = Color.WHITE;
          if (viewer.scene.skyAtmosphere) {
            viewer.scene.skyAtmosphere.hueShift = 0.0;
            viewer.scene.skyAtmosphere.saturationShift = 0.0;
            viewer.scene.skyAtmosphere.brightnessShift = 0.0;
          }
        }
        viewer.scene.requestRender();
      }
    }
  }, [isDarkMode]);

  // Force Cesium to re-render when UI overlays open/close since requestRenderMode is true
  useEffect(() => {
    if (viewerInstance.current && !viewerInstance.current.isDestroyed()) {
      viewerInstance.current.scene.requestRender();
      setTimeout(() => {
        if (viewerInstance.current && !viewerInstance.current.isDestroyed())
          viewerInstance.current.scene.requestRender();
      }, 50);
    }
  }, [
    selectedReportId,
    selectedEventId,
    isSelectingLocation,
    isSelectingEventLocation,
    isReportMode,
    isEventMode,
    isAlertMode,
  ]);

  useEffect(() => {
    let pulseInterval;
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;

    // Remove all entities except the live location dot
    viewer.entities.values.slice().forEach((entity) => {
      if (entity.id !== "user-location-dot") {
        viewer.entities.remove(entity);
      }
    });

    if (isReportMode || isEventMode || isAlertMode) {
      // Detect mobile once, re-use below
      const isMobileDevice = window.__isMobile ?? (
        window.__isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
      if (isDarkMode && !isMobileDevice) {
        // Bloom is visually great on desktop dark mode but too expensive for mobile GPUs
        viewer.scene.postProcessStages.bloom.enabled = true;
        viewer.scene.postProcessStages.bloom.uniforms.contrast = 128;
        viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.3;
        viewer.scene.postProcessStages.bloom.uniforms.delta = 1.0;
        viewer.scene.postProcessStages.bloom.uniforms.sigma = 1.5;
        viewer.scene.postProcessStages.bloom.uniforms.stepSize = 2.0;
      } else {
        // Disable bloom on mobile (perf) and light mode (visual)
        viewer.scene.postProcessStages.bloom.enabled = false;
      }

      const createHeatmapImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

        if (isEventMode) {
          if (isDarkMode) {
            gradient.addColorStop(0, "rgba(255, 20, 147, 0.4)"); // Pink core
            gradient.addColorStop(0.3, "rgba(255, 105, 180, 0.2)");
            gradient.addColorStop(0.6, "rgba(255, 182, 193, 0.1)");
            gradient.addColorStop(1, "rgba(255, 192, 203, 0.0)");
          } else {
            // Stronger, deeper colors for light mode so they pop without bloom
            gradient.addColorStop(0, "rgba(219, 39, 119, 0.9)");
            gradient.addColorStop(0.3, "rgba(236, 72, 153, 0.7)");
            gradient.addColorStop(0.6, "rgba(244, 114, 182, 0.3)");
            gradient.addColorStop(1, "rgba(252, 165, 165, 0.0)");
          }
        } else {
          if (isDarkMode) {
            gradient.addColorStop(0, "rgba(255, 0, 0, 0.4)");
            gradient.addColorStop(0.3, "rgba(255, 165, 0, 0.2)");
            gradient.addColorStop(0.6, "rgba(255, 255, 0, 0.1)");
            gradient.addColorStop(1, "rgba(255, 255, 0, 0.0)");
          } else {
            // Stronger, deeper colors for light mode
            gradient.addColorStop(0, "rgba(220, 38, 38, 0.9)");
            gradient.addColorStop(0.3, "rgba(239, 68, 68, 0.7)");
            gradient.addColorStop(0.6, "rgba(248, 113, 113, 0.3)");
            gradient.addColorStop(1, "rgba(252, 165, 165, 0.0)");
          }
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return canvas;
      };

      const createSeenHeatmapImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

        if (isDarkMode) {
          gradient.addColorStop(0, "rgba(128, 128, 128, 0.4)");
          gradient.addColorStop(0.3, "rgba(128, 128, 128, 0.2)");
          gradient.addColorStop(0.6, "rgba(128, 128, 128, 0.1)");
          gradient.addColorStop(1, "rgba(128, 128, 128, 0.0)");
        } else {
          gradient.addColorStop(0, "rgba(71, 85, 105, 0.9)");
          gradient.addColorStop(0.3, "rgba(100, 116, 139, 0.7)");
          gradient.addColorStop(0.6, "rgba(148, 163, 184, 0.3)");
          gradient.addColorStop(1, "rgba(203, 213, 225, 0.0)");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return canvas;
      };

      const heatmapImage = createHeatmapImage();
      const seenHeatmapImage = createSeenHeatmapImage();

      if (isReportMode) {
        reports.forEach((report) => {
          const id = report.id || report._id;
          viewer.entities.add({
            id: `report-${id}`,
            position: Cartesian3.fromDegrees(report.lng, report.lat),
            billboard: {
              image: report.seen ? seenHeatmapImage : heatmapImage,
              width: 45,
              height: 45,
              disableDepthTestDistance: 1.2e7,
            },
            description: report.description,
          });
        });
      } else if (isEventMode) {
        events.forEach((event) => {
          const id = event.id || event._id;
          viewer.entities.add({
            id: `event-${id}`,
            position: Cartesian3.fromDegrees(event.lng, event.lat),
            billboard: {
              image: event.seen ? seenHeatmapImage : heatmapImage,
              width: 55,
              height: 55,
              disableDepthTestDistance: 1.2e7,
            },
            description: event.description,
          });
        });
      } else if (isAlertMode) {
        if (!COLOR_CRITICAL) {
          COLOR_CRITICAL = Color.fromCssColorString("#ff1a1a");
          COLOR_HIGH = Color.fromCssColorString("#ff6600");
          COLOR_MEDIUM = Color.fromCssColorString("#ffcc00");
        }

        // Suspend entity events during batch insertion for maximum Cesium rendering performance
        viewer.entities.suspendEvents();

        const displayedAlerts = activeTrackerFilter === "all"
          ? alerts
          : alerts.filter((alertItem) => {
              const typeStr = (alertItem.type || "").toLowerCase().replace(/_/g, " ");
              if (activeTrackerFilter === "earthquake") return typeStr.includes("earthquake");
              if (activeTrackerFilter === "volcano") return typeStr.includes("volcano");
              if (activeTrackerFilter === "tsunami") return typeStr.includes("tsunami");
              if (activeTrackerFilter === "wildfire") return typeStr.includes("wildfire") || typeStr.includes("fire");
              if (activeTrackerFilter === "storm") return typeStr.includes("storm");
              if (activeTrackerFilter === "cyclone") return typeStr.includes("cyclone") || typeStr.includes("hurricane");
              return true;
            });

        displayedAlerts.forEach((alertItem) => {
          const id = alertItem.id || alertItem._id;
          const radii = { critical: 500000, high: 300000, medium: 150000, low: 50000 };
          const maxRadius = radii[alertItem.severity || "high"] || 300000;
          
          const alertColor =
            alertItem.severity === "critical" ? COLOR_CRITICAL :
            alertItem.severity === "high"     ? COLOR_HIGH :
                                                COLOR_MEDIUM;
          const typeStr = (alertItem.type || "").toLowerCase().replace(/_/g, " ");
          let emoji = "⚠️";
          if (typeStr.includes("earthquake")) emoji = "💥";
          else if (typeStr.includes("volcano")) emoji = "🌋";
          else if (typeStr.includes("tsunami")) emoji = "🌊";
          else if (typeStr.includes("wildfire") || typeStr.includes("fire")) emoji = "🔥";
          else if (typeStr.includes("storm")) emoji = "⛈️";
          else if (typeStr.includes("cyclone") || typeStr.includes("hurricane")) emoji = "🌀";
          else if (typeStr.includes("flood")) emoji = "💧";
          else if (typeStr.includes("drought")) emoji = "☀️";
          else if (typeStr.includes("ice") || typeStr.includes("snow")) emoji = "🧊";
          else if (typeStr.includes("dust") || typeStr.includes("haze")) emoji = "💨";

          const emojiCanvas = getCachedEmojiCanvas(emoji, alertItem.severity);
          const baseSize = alertItem.severity === "critical" ? 44 : 32;

          viewer.entities.add({
            id: `alert-${id}`,
            position: Cartesian3.fromDegrees(alertItem.lng, alertItem.lat),
            description: alertItem.description,
            billboard: {
              image: emojiCanvas,
              width: baseSize,
              height: baseSize,
              disableDepthTestDistance: 1.2e7,
            },
            ellipse: {
              semiMinorAxis: maxRadius,
              semiMajorAxis: maxRadius,
              material: alertColor.withAlpha(0.15),
              outline: true,
              outlineColor: alertColor.withAlpha(0.3),
            },
          });
        });

        // Resume events once all alert entities are registered
        viewer.entities.resumeEvents();

        if (viewerInstance.current && !viewerInstance.current.isDestroyed()) {
          viewerInstance.current.scene.requestRender();
        }
      }
      viewer.scene.requestRender();
      // Cesium's texture atlas takes a moment to process the dynamic canvas images.
      // Since requestRenderMode is true, we must manually request renders shortly after.
      setTimeout(() => {
        if (viewerInstance.current && !viewerInstance.current.isDestroyed())
          viewerInstance.current.scene.requestRender();
      }, 100);
      setTimeout(() => {
        if (viewerInstance.current && !viewerInstance.current.isDestroyed())
          viewerInstance.current.scene.requestRender();
      }, 400);
    } else {
      viewer.scene.postProcessStages.bloom.enabled = false;
      viewer.scene.requestRender();
    }

    return () => {
      // Clear one or many intervals depending on mode
      if (Array.isArray(pulseInterval)) pulseInterval.forEach(clearInterval);
      else if (pulseInterval) clearInterval(pulseInterval);
      else if (pulseInterval) clearInterval(pulseInterval);
    };
  }, [isReportMode, isEventMode, isAlertMode, reports, events, alerts, activeTrackerFilter]);

  useEffect(() => {
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    if (isReportMode || isEventMode || isAlertMode) {
      if (isSelectingLocation || isSelectingEventLocation) {
        const cursorSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23ef4444" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
        viewer.canvas.style.cursor = `url('${cursorSvg}') 18 36, crosshair`;
        handler.setInputAction((click) => {
          const cartesian = viewer.scene.camera.pickEllipsoid(
            click.position,
            viewer.scene.globe.ellipsoid,
          );
          if (cartesian) {
            const cartographic =
              viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            const lon = CesiumMath.toDegrees(cartographic.longitude);
            const lat = CesiumMath.toDegrees(cartographic.latitude);

            if (isSelectingLocation) {
              setNewReportLocation({ lat, lng: lon });
              setIsSelectingLocation(false);
            } else if (isSelectingEventLocation) {
              setNewEventLocation({ lat, lng: lon });
              setIsSelectingEventLocation(false);
            }
            viewer.canvas.style.cursor = "default";
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      } else {
        viewer.canvas.style.cursor = "default";
        handler.setInputAction((click) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (
            pickedObject &&
            pickedObject.id &&
            typeof pickedObject.id.id === "string"
          ) {
            if (pickedObject.id.id.startsWith("report-")) {
              if (!isLoggedIn) {
                if (onRequireLogin) onRequireLogin();
                return;
              }
              const reportId = pickedObject.id.id.replace("report-", "");
              const report = reports.find(
                (r) =>
                  r.id?.toString() === reportId ||
                  r._id?.toString() === reportId
              );
              if (report) {
                const finalId = report.id || report._id || reportId;
                setSelectedReportId(finalId);
                if (onReportOpened && !report.seen) {
                  onReportOpened(finalId);
                }
              }
            } else if (pickedObject.id.id.startsWith("event-")) {
              if (!isLoggedIn) {
                if (onRequireLogin) onRequireLogin();
                return;
              }
              const eventId = pickedObject.id.id.replace("event-", "");
              const event = events.find(
                (e) =>
                  e.id?.toString() === eventId ||
                  e._id?.toString() === eventId
              );
              if (event) {
                const finalId = event.id || event._id || eventId;
                setSelectedEventId(finalId);
                if (onEventOpened && !event.seen) {
                  onEventOpened(finalId);
                }
              }
            } else if (pickedObject.id.id.startsWith("alert-")) {
              // Official alerts are public — no login required
              const entityId = pickedObject.id.id; // e.g. "alert-usgs_us7000xxxx"
              const alertId = entityId.replace("alert-", "");
              const foundAlert = alerts.find(
                (a) =>
                  (a.id?.toString() === alertId) ||
                  (a._id?.toString() === alertId)
              );
              if (foundAlert) {
                setSelectedAlertId(foundAlert._id || foundAlert.id || alertId);
              } else {
                // Fallback: set by raw ID so the modal can show whatever we have
                setSelectedAlertId(alertId);
              }
            } else if (pickedObject.id.id === "user-location-dot") {
              if (userLocation) {
                const currentHeight = viewer.camera.positionCartographic.height;
                if (currentHeight < 5000) {
                  viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(
                      userLocation.lng,
                      userLocation.lat,
                      10000000.0,
                    ),
                    duration: 1.5,
                  });
                } else {
                  viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(
                      userLocation.lng,
                      userLocation.lat,
                      2000.0,
                    ),
                    duration: 1.5,
                  });
                }
              }
            }
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      }
    } else {
      viewer.canvas.style.cursor = "default";
      handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (
          pickedObject &&
          pickedObject.id &&
          typeof pickedObject.id.id === "string"
        ) {
          if (pickedObject.id.id === "user-location-dot") {
            if (userLocation) {
              const currentHeight = viewer.camera.positionCartographic.height;
              if (currentHeight < 5000) {
                viewer.camera.flyTo({
                  destination: Cartesian3.fromDegrees(
                    userLocation.lng,
                    userLocation.lat,
                    10000000.0,
                  ),
                  duration: 1.5,
                });
              } else {
                viewer.camera.flyTo({
                  destination: Cartesian3.fromDegrees(
                    userLocation.lng,
                    userLocation.lat,
                    2000.0,
                  ),
                  duration: 1.5,
                });
              }
            }
          }
        }
      }, ScreenSpaceEventType.LEFT_CLICK);
    }

    return () => {
      handler.destroy();
    };
  }, [
    isReportMode,
    isEventMode,
    isAlertMode,
    isLoggedIn,
    onRequireLogin,
    isSelectingLocation,
    isSelectingEventLocation,
    reports,
    events,
    alerts,
    userLocation,
    onEventOpened,
    onAlertOpened,
  ]);

  const handleWheel = (e) => {
    if (viewerInstance.current) {
      const camera = viewerInstance.current.camera;
      const height = camera.positionCartographic.height;
      if (e.deltaY > 0 && height >= 10000000) {
        zoomVelocityRef.current = 0;
        return;
      }
      const sensitivity = height * 0.005;
      zoomVelocityRef.current += e.deltaY * sensitivity;
      viewerInstance.current.scene.requestRender();
    }
  };

  const handleAddReportSubmit = async (reportData) => {
    if (onAddReport) {
      await onAddReport(reportData);
    } else {
      const newReport = {
        ...reportData,
        id: Date.now(),
        upvotes: 0,
        downvotes: 0,
        isMine: true,
      };
      setReports([...reports, newReport]);
    }
    setNewReportLocation(null);
  };

  const handleAddEventSubmit = async (eventData) => {
    if (onAddEvent) {
      await onAddEvent(eventData);
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now(),
        isMine: true,
      };
      setEvents([...events, newEvent]);
    }
    setNewEventLocation(null);
  };

  return (
    <div className="map-wrapper" onWheel={handleWheel}>
      <div ref={cesiumContainer} style={{ width: "100%", height: "100%" }} />
      {selectedReport &&
        createPortal(
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReportId(null)}
            onVote={onVote}
            onAuthorClick={onAuthorClick}
            userLocation={userLocation}
          />,
          document.body,
        )}
      {selectedEvent &&
        createPortal(
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
            onVote={onEventVote}
            onAuthorClick={onAuthorClick}
            userLocation={userLocation}
          />,
          document.body,
        )}
      {selectedAlert &&
        createPortal(
          <AlertDetailModal
            alert={selectedAlert}
            onClose={() => setSelectedAlertId(null)}
          />,
          document.body,
        )}

      {/* ── Mode Indicator Pill (Normal, clean, only shows when pinning or report/event mode is selected) ── */}
      {(isSelectingLocation || isSelectingEventLocation || isReportMode || isEventMode) && (
        <div className="geo-current-page-header" role="banner" aria-label="Current Mode">
          <div className="page-header-card">
            <div className="page-header-icon-wrap">
              <span>{currentPageInfo.icon}</span>
            </div>
            <div className="page-header-text">
              <div className="page-header-title-row">
                <span className="page-header-title">{currentPageInfo.title}</span>
                {currentPageInfo.badge && (
                  <span className="page-header-badge">
                    {currentPageInfo.badge}
                  </span>
                )}
              </div>
            </div>
            {(isSelectingLocation || isSelectingEventLocation) && (
              <button
                className="btn-cancel-pinning"
                onClick={() => {
                  setIsSelectingLocation(false);
                  setIsSelectingEventLocation(false);
                }}
                title="Cancel selection"
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {newReportLocation &&
        createPortal(
          <AddReportModal
            location={newReportLocation}
            onSubmit={handleAddReportSubmit}
            onClose={() => setNewReportLocation(null)}
          />,
          document.body,
        )}

      {newEventLocation &&
        createPortal(
          <AddEventModal
            location={newEventLocation}
            onSubmit={handleAddEventSubmit}
            onClose={() => setNewEventLocation(null)}
          />,
          document.body,
        )}

      {isSettingsOpen &&
        createPortal(
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            locationEnabled={locationEnabled}
            setLocationEnabled={setLocationEnabled}
            alertsEnabled={alertsEnabled}
            setAlertsEnabled={setAlertsEnabled}
            userName={userName}
            setUserName={setUserName}
            darkMode={isDarkMode}
            setDarkMode={setDarkMode}
          />,
          document.body,
        )}

      {/* Live Trackers Dropdown Menu in Alert Mode */}
      {isAlertMode && (
        <div className="live-tracker-dropdown-container" ref={liveTrackersDropdownRef}>
          <button
            type="button"
            className={`live-tracker-dropdown-btn ${isLiveTrackersOpen ? "active" : ""}`}
            onClick={() => setIsLiveTrackersOpen((prev) => !prev)}
            aria-expanded={isLiveTrackersOpen}
            aria-haspopup="true"
            title="Live Natural Disaster Trackers"
          >
            <span className="tracker-btn-icon">📡</span>
            <span className="tracker-btn-label">
              {activeTrackerFilter === "all"
                ? "Live Trackers"
                : trackerOptions.find((o) => o.key === activeTrackerFilter)?.label || "Live Trackers"}
            </span>
            {alertsLoading ? (
              <span className="tracker-badge-sync">
                <span className="sync-pulse-dot" /> Syncing
              </span>
            ) : (
              <span className="tracker-badge-count">
                ● {trackerCounts[activeTrackerFilter] || 0} Active
              </span>
            )}
            <svg
              className={`tracker-chevron-icon ${isLiveTrackersOpen ? "open" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isLiveTrackersOpen && (
            <div className="live-tracker-menu-card glass-card">
              <div className="tracker-menu-header">
                <div className="tracker-menu-title">
                  <span>DISASTER TRACKERS</span>
                  <span className="tracker-source-tag">NASA • USGS</span>
                </div>
                {activeTrackerFilter !== "all" && (
                  <button
                    type="button"
                    className="tracker-reset-btn"
                    onClick={() => {
                      setActiveTrackerFilter("all");
                      setIsLiveTrackersOpen(false);
                    }}
                    title="Show all trackers"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="tracker-options-list">
                <button
                  type="button"
                  className={`tracker-option-row ${activeTrackerFilter === "all" ? "selected" : ""}`}
                  onClick={() => {
                    setActiveTrackerFilter("all");
                    setIsLiveTrackersOpen(false);
                  }}
                >
                  <span className="tracker-opt-icon">🌐</span>
                  <span className="tracker-opt-name">All Active Trackers</span>
                  <span className="tracker-opt-badge">{trackerCounts.all}</span>
                </button>

                {trackerOptions.map((opt) => {
                  const count = trackerCounts[opt.key] || 0;
                  const isSelected = activeTrackerFilter === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={`tracker-option-row ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setActiveTrackerFilter(opt.key);
                        setIsLiveTrackersOpen(false);
                      }}
                    >
                      <span className="tracker-opt-icon">{opt.icon}</span>
                      <span className="tracker-opt-name">{opt.label}</span>
                      <span className={`tracker-opt-badge ${count > 0 ? "has-alerts" : "empty"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="tracker-menu-divider" />

              <div className="tracker-menu-subtitle">Severity Level</div>
              <div className="tracker-severity-list">
                <div className="severity-row">
                  <div className="severity-dot critical" /> Critical
                </div>
                <div className="severity-row">
                  <div className="severity-dot high" /> High
                </div>
                <div className="severity-row">
                  <div className="severity-dot medium" /> Medium / Low
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating 2D / 3D Projection Toggle Button */}
      <div className="floating-map-controls">
        <button
          type="button"
          className={`floating-projection-btn ${is2DMode ? "mode-2d" : "mode-3d"}`}
          onClick={() => {
            if (onToggle2D3D) onToggle2D3D(!is2DMode);
          }}
          title={is2DMode ? "Switch to 3D Globe" : "Switch to 2D Flat Map"}
          aria-label={is2DMode ? "Switch to 3D Globe" : "Switch to 2D Flat Map"}
        >
          <span className="proj-icon">{is2DMode ? "🌐" : "🗺️"}</span>
          <span className="proj-text">{is2DMode ? "Switch to 3D" : "Switch to 2D"}</span>
          <span className="proj-badge">{is2DMode ? "2D" : "3D"}</span>
        </button>
      </div>

      <div className="map-footer">
        <div className="map-footer-content">
          {isReportMode ? (
            <>
              <button
                className="btn btn-yellow footer-btn"
                onClick={() => {
                  if (!isLoggedIn && onRequireLogin) return onRequireLogin();
                  setIsSelectingLocation(true);
                }}
              >
                {t("addReport")}
              </button>
              <button
                className="btn btn-outline footer-btn"
                onClick={() => {
                  setIsReportMode(false);
                  setIsSelectingLocation(false);
                }}
              >
                {t("goBack")}
              </button>
            </>
          ) : isEventMode ? (
            <>
              <button
                className="btn btn-pink footer-btn"
                onClick={() => {
                  if (!isLoggedIn && onRequireLogin) return onRequireLogin();
                  setIsSelectingEventLocation(true);
                }}
              >
                {t("addEvent")}
              </button>
              <button
                className="btn btn-outline footer-btn"
                onClick={() => {
                  setIsEventMode(false);
                  setIsSelectingEventLocation(false);
                }}
              >
                {t("goBack")}
              </button>
            </>
          ) : isAlertMode ? (
            <>
              <button
                className="btn btn-outline footer-btn"
                onClick={() => {
                  setIsAlertMode(false);
                }}
              >
                {t("goBack")}
              </button>
            </>
          ) : (
            <>
              {/* Always-visible on both mobile and desktop */}
              <ReportsButton
                onClick={() => setIsReportMode(true)}
                label={t("reports")}
              />
              <button
                className="btn btn-outline footer-btn"
                onClick={() => setIsSettingsOpen(true)}
              >
                {t("settings")}
              </button>

              {/* ── 3-dot button: RIGHT of Settings, mobile only ── */}
              <button
                className="btn btn-outline footer-btn footer-more-btn"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="More options"
                aria-expanded={isMobileMenuOpen}
              >
                <span style={{ fontSize: "1.2rem", letterSpacing: "1px" }}>···</span>
              </button>

              {/* Overflow popup + backdrop — mobile only */}
              {isMobileMenuOpen && (
                <>
                  <div
                    className="footer-menu-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <div className="footer-overflow-menu">
                    <button
                      className="btn btn-outline footer-btn"
                      onClick={() => {
                        if (onToggle2D3D) onToggle2D3D(!is2DMode);
                        setIsMobileMenuOpen(false);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{is2DMode ? "🌐" : "🗺️"}</span>
                      {is2DMode ? "Switch to 3D" : "Switch to 2D"}
                    </button>
                    <button
                      className="btn btn-pink footer-btn"
                      onClick={() => { setIsEventMode(true); setIsMobileMenuOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>🎟️</span>
                      {t("events")}
                    </button>
                    <button
                      className="btn btn-blue footer-btn"
                      onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>⚙️</span>
                      Settings
                    </button>
                    <button
                      className="btn btn-danger footer-btn"
                      onClick={handleOpenAlerts}
                      style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                      Alerts
                    </button>
                  </div>
                </>
              )}

              {/* Desktop-only: Events, Settings (hidden on mobile) */}
              <button
                className="btn btn-pink footer-btn footer-desktop-only"
                onClick={() => setIsEventMode(true)}
                style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
              >
                <span style={{ fontSize: "1.1rem" }}>🎟️</span>
                {t("events")}
              </button>
              <button
                className="btn btn-blue footer-btn footer-desktop-only"
                onClick={() => setIsSettingsOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
              >
                <span style={{ fontSize: "1.1rem" }}>⚙️</span>
                Settings
              </button>
              <button
                className="btn btn-danger footer-btn footer-desktop-only"
                onClick={handleOpenAlerts}
                style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
              >
                <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                Alerts
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
