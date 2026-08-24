import Event from "../models/Event.js";
import { isMongoConnected, memoryStore } from "../config/db.js";

const formatEvent = (event, currentUserId = null, currentUserPhone = null) => {
  const evObj = event.toObject ? event.toObject() : { ...event };
  const evId = (evObj._id || evObj.id)?.toString();

  const isMine =
    (currentUserId && evObj.author?.user && evObj.author.user.toString() === currentUserId.toString()) ||
    (currentUserPhone && evObj.author?.phone && evObj.author.phone === currentUserPhone) ||
    Boolean(evObj.isMine);

  const userVote =
    currentUserId && evObj.upvotedBy
      ? evObj.upvotedBy.some((id) => id?.toString() === currentUserId.toString())
        ? "up"
        : null
      : null;

  const seen =
    currentUserId && evObj.seenBy
      ? evObj.seenBy.some((id) => id?.toString() === currentUserId.toString())
      : Boolean(evObj.seen);

  return {
    ...evObj,
    id: evId,
    _id: evId,
    isMine,
    userVote,
    seen,
  };
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public / Optional Auth
export const getEvents = async (req, res) => {
  try {
    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const currentUserPhone = req.user ? req.user.phone : null;

    let events = [];
    if (isMongoConnected) {
      try {
        events = await Event.find().sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB query failed, using memory store fallback:", dbErr.message);
        events = memoryStore.events;
      }
    } else {
      events = memoryStore.events;
    }

    const formatted = events.map((e) => formatEvent(e, currentUserId, currentUserPhone));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      events: formatted,
    });
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(200).json({
      success: true,
      count: memoryStore.events.length,
      events: memoryStore.events,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public / Optional Auth
export const getEventById = async (req, res) => {
  try {
    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const currentUserPhone = req.user ? req.user.phone : null;

    let event = null;
    if (isMongoConnected) {
      event = await Event.findById(req.params.id);
    } else {
      event = memoryStore.events.find((e) => (e._id || e.id)?.toString() === req.params.id?.toString());
    }

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      event: formatEvent(event, currentUserId, currentUserPhone),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      timing,
      isPublic = true,
      poster,
      photos = [],
      videos = [],
      lat,
      lng,
    } = req.body;

    if (!title || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "Title, latitude and longitude are required" });
    }

    const userId = req.user._id || req.user.id;
    let event;

    if (isMongoConnected) {
      event = await Event.create({
        title,
        description: description || "",
        timing: timing || "",
        isPublic: Boolean(isPublic),
        poster: poster || null,
        photos: Array.isArray(photos) ? photos : [],
        videos: Array.isArray(videos) ? videos : [],
        lat: Number(lat),
        lng: Number(lng),
        author: {
          user: userId,
          name: req.user.name,
          profilePic: req.user.profilePic,
          phone: req.user.phone,
        },
        upvotes: 0,
        upvotedBy: [],
        seenBy: [userId],
      });
    } else {
      const newId = `ev_${Date.now()}`;
      event = {
        _id: newId,
        id: newId,
        title,
        description: description || "",
        timing: timing || "",
        isPublic: Boolean(isPublic),
        poster: poster || null,
        photos: Array.isArray(photos) ? photos : [],
        videos: Array.isArray(videos) ? videos : [],
        lat: Number(lat),
        lng: Number(lng),
        author: {
          user: userId,
          name: req.user.name,
          profilePic: req.user.profilePic,
          phone: req.user.phone,
        },
        upvotes: 0,
        upvotedBy: [],
        seenBy: [userId],
        createdAt: new Date().toISOString(),
      };
      memoryStore.events.unshift(event);
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: formatEvent(event, userId, req.user.phone),
    });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id)?.toString();
    const { title, description, timing, isPublic, poster, photos, videos } = req.body;

    let event = null;
    if (isMongoConnected) {
      event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      if (event.author?.user && event.author.user.toString() !== userId && event.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to update this event" });
      }

      if (title !== undefined) event.title = title;
      if (description !== undefined) event.description = description;
      if (timing !== undefined) event.timing = timing;
      if (isPublic !== undefined) event.isPublic = isPublic;
      if (poster !== undefined) event.poster = poster;
      if (photos !== undefined) event.photos = photos;
      if (videos !== undefined) event.videos = videos;

      await event.save();
    } else {
      event = memoryStore.events.find((e) => (e._id || e.id)?.toString() === req.params.id?.toString());
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      if (event.author?.user && event.author.user.toString() !== userId && event.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to update this event" });
      }

      if (title !== undefined) event.title = title;
      if (description !== undefined) event.description = description;
      if (timing !== undefined) event.timing = timing;
      if (isPublic !== undefined) event.isPublic = isPublic;
      if (poster !== undefined) event.poster = poster;
      if (photos !== undefined) event.photos = photos;
      if (videos !== undefined) event.videos = videos;
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: formatEvent(event, userId, req.user.phone),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id)?.toString();

    if (isMongoConnected) {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      if (event.author?.user && event.author.user.toString() !== userId && event.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
      }

      await event.deleteOne();
    } else {
      const index = memoryStore.events.findIndex((e) => (e._id || e.id)?.toString() === req.params.id?.toString());
      if (index === -1) return res.status(404).json({ success: false, message: "Event not found" });

      const event = memoryStore.events[index];
      if (event.author?.user && event.author.user.toString() !== userId && event.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
      }

      memoryStore.events.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Vote on an event
// @route   POST /api/events/:id/vote
// @access  Private
export const voteEvent = async (req, res) => {
  try {
    const { action } = req.body;
    const userId = req.user._id || req.user.id;

    let event = null;

    if (isMongoConnected) {
      event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      const hadUpvoted = (event.upvotedBy || []).some((id) => id.toString() === userId.toString());
      event.upvotedBy = (event.upvotedBy || []).filter((id) => id.toString() !== userId.toString());

      if (action === "up" && !hadUpvoted) {
        event.upvotedBy.push(userId);
      }

      event.upvotes = event.upvotedBy.length;
      await event.save();
    } else {
      event = memoryStore.events.find((e) => (e._id || e.id)?.toString() === req.params.id?.toString());
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });

      const hadUpvoted = (event.upvotedBy || []).some((id) => id?.toString() === userId?.toString());
      event.upvotedBy = (event.upvotedBy || []).filter((id) => id?.toString() !== userId?.toString());

      if (action === "up" && !hadUpvoted) {
        event.upvotedBy.push(userId);
      }

      event.upvotes = event.upvotedBy.length;
    }

    return res.status(200).json({
      success: true,
      event: formatEvent(event, userId, req.user.phone),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark event as seen
// @route   POST /api/events/:id/seen
// @access  Public / Optional Auth
export const markEventSeen = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) return res.status(200).json({ success: true });

    if (isMongoConnected) {
      const event = await Event.findById(req.params.id);
      if (event && !event.seenBy.includes(userId)) {
        event.seenBy.push(userId);
        await event.save();
      }
    } else {
      const event = memoryStore.events.find((e) => (e._id || e.id)?.toString() === req.params.id?.toString());
      if (event) {
        event.seenBy = event.seenBy || [];
        if (!event.seenBy.includes(userId)) event.seenBy.push(userId);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
