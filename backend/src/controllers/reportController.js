import Report from "../models/Report.js";
import User from "../models/User.js";
import { isMongoConnected, memoryStore } from "../config/db.js";

const formatReport = (report, currentUserId = null, currentUserPhone = null) => {
  const repObj = report.toObject ? report.toObject() : { ...report };
  const repId = (repObj._id || repObj.id)?.toString();

  const isMine =
    (currentUserId && repObj.author?.user && repObj.author.user.toString() === currentUserId.toString()) ||
    (currentUserPhone && repObj.author?.phone && repObj.author.phone === currentUserPhone) ||
    Boolean(repObj.isMine);

  let userVote = null;
  if (currentUserId && repObj.upvotedBy) {
    if (repObj.upvotedBy.some((id) => id?.toString() === currentUserId.toString())) {
      userVote = "up";
    } else if (repObj.downvotedBy && repObj.downvotedBy.some((id) => id?.toString() === currentUserId.toString())) {
      userVote = "down";
    }
  }

  const seen =
    currentUserId && repObj.seenBy
      ? repObj.seenBy.some((id) => id?.toString() === currentUserId.toString())
      : Boolean(repObj.seen);

  return {
    ...repObj,
    id: repId,
    _id: repId,
    isMine,
    userVote,
    seen,
  };
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public / Optional Auth
export const getReports = async (req, res) => {
  try {
    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const currentUserPhone = req.user ? req.user.phone : null;

    let reports = [];
    if (isMongoConnected) {
      reports = await Report.find().sort({ createdAt: -1 });
    } else {
      reports = memoryStore.reports;
    }

    const formatted = reports.map((r) => formatReport(r, currentUserId, currentUserPhone));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      reports: formatted,
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public / Optional Auth
export const getReportById = async (req, res) => {
  try {
    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const currentUserPhone = req.user ? req.user.phone : null;

    let report = null;
    if (isMongoConnected) {
      report = await Report.findById(req.params.id);
    } else {
      report = memoryStore.reports.find((r) => (r._id || r.id)?.toString() === req.params.id?.toString());
    }

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      report: formatReport(report, currentUserId, currentUserPhone),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { title, description, websiteLink, image, video, media, lat, lng } = req.body;

    if (!title || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "Title, latitude and longitude are required" });
    }

    const userId = req.user._id || req.user.id;
    let report;

    if (isMongoConnected) {
      report = await Report.create({
        title,
        description: description || "",
        websiteLink: websiteLink || "",
        image: image || media || null,
        video: video || null,
        media: media || image || null,
        lat: Number(lat),
        lng: Number(lng),
        author: {
          user: userId,
          name: req.user.name,
          profilePic: req.user.profilePic,
          phone: req.user.phone,
        },
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: [],
        seenBy: [userId],
      });
    } else {
      const newId = `rep_${Date.now()}`;
      report = {
        _id: newId,
        id: newId,
        title,
        description: description || "",
        websiteLink: websiteLink || "",
        image: image || media || null,
        video: video || null,
        media: media || image || null,
        lat: Number(lat),
        lng: Number(lng),
        author: {
          user: userId,
          name: req.user.name,
          profilePic: req.user.profilePic,
          phone: req.user.phone,
        },
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: [],
        seenBy: [userId],
        createdAt: new Date().toISOString(),
      };
      memoryStore.reports.unshift(report);
    }

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      report: formatReport(report, userId, req.user.phone),
    });
  } catch (error) {
    console.error("Create report error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing report
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id)?.toString();
    const { title, description, websiteLink, image, video, media } = req.body;

    let report = null;
    if (isMongoConnected) {
      report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      if (report.author?.user && report.author.user.toString() !== userId && report.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to update this report" });
      }

      if (title !== undefined) report.title = title;
      if (description !== undefined) report.description = description;
      if (websiteLink !== undefined) report.websiteLink = websiteLink;
      if (image !== undefined) report.image = image;
      if (video !== undefined) report.video = video;
      if (media !== undefined) report.media = media;

      report.upvotes = 0;
      report.downvotes = 0;
      report.upvotedBy = [];
      report.downvotedBy = [];

      await report.save();
    } else {
      report = memoryStore.reports.find((r) => (r._id || r.id)?.toString() === req.params.id?.toString());
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      if (report.author?.user && report.author.user.toString() !== userId && report.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to update this report" });
      }

      if (title !== undefined) report.title = title;
      if (description !== undefined) report.description = description;
      if (websiteLink !== undefined) report.websiteLink = websiteLink;
      if (image !== undefined) report.image = image;
      if (video !== undefined) report.video = video;
      if (media !== undefined) report.media = media;

      report.upvotes = 0;
      report.downvotes = 0;
      report.upvotedBy = [];
      report.downvotedBy = [];
    }

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report: formatReport(report, userId, req.user.phone),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id)?.toString();

    if (isMongoConnected) {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      if (report.author?.user && report.author.user.toString() !== userId && report.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this report" });
      }

      await report.deleteOne();
    } else {
      const index = memoryStore.reports.findIndex((r) => (r._id || r.id)?.toString() === req.params.id?.toString());
      if (index === -1) return res.status(404).json({ success: false, message: "Report not found" });

      const report = memoryStore.reports[index];
      if (report.author?.user && report.author.user.toString() !== userId && report.author.phone !== req.user.phone) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this report" });
      }

      memoryStore.reports.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Vote on a report
// @route   POST /api/reports/:id/vote
// @access  Private
export const voteReport = async (req, res) => {
  try {
    const { action } = req.body; // "up" | "down" | "cancel"
    const userId = req.user._id || req.user.id;

    let report = null;

    if (isMongoConnected) {
      report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      report.upvotedBy = (report.upvotedBy || []).filter((id) => id.toString() !== userId.toString());
      report.downvotedBy = (report.downvotedBy || []).filter((id) => id.toString() !== userId.toString());

      if (action === "up") {
        report.upvotedBy.push(userId);
      } else if (action === "down") {
        report.downvotedBy.push(userId);
      }

      report.upvotes = report.upvotedBy.length;
      report.downvotes = report.downvotedBy.length;
      await report.save();

      // Recalculate author reputation
      if (report.author?.user) {
        const authorReports = await Report.find({ "author.user": report.author.user });
        const totalUp = authorReports.reduce((s, r) => s + (r.upvotes || 0), 0);
        const totalDown = authorReports.reduce((s, r) => s + (r.downvotes || 0), 0);
        await User.findByIdAndUpdate(report.author.user, {
          stats: { totalUpvotes: totalUp, totalDownvotes: totalDown },
        });
      }
    } else {
      report = memoryStore.reports.find((r) => (r._id || r.id)?.toString() === req.params.id?.toString());
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      report.upvotedBy = (report.upvotedBy || []).filter((id) => id?.toString() !== userId?.toString());
      report.downvotedBy = (report.downvotedBy || []).filter((id) => id?.toString() !== userId?.toString());

      if (action === "up") {
        report.upvotedBy.push(userId);
      } else if (action === "down") {
        report.downvotedBy.push(userId);
      }

      report.upvotes = report.upvotedBy.length;
      report.downvotes = report.downvotedBy.length;

      // Recalculate author reputation
      const authorId = report.author?.user;
      if (authorId) {
        const authorUser = memoryStore.users.find((u) => (u._id || u.id)?.toString() === authorId.toString());
        if (authorUser) {
          const authorReports = memoryStore.reports.filter((r) => r.author?.user?.toString() === authorId.toString());
          const totalUp = authorReports.reduce((s, r) => s + (r.upvotes || 0), 0);
          const totalDown = authorReports.reduce((s, r) => s + (r.downvotes || 0), 0);
          authorUser.stats = { totalUpvotes: totalUp, totalDownvotes: totalDown };
        }
      }
    }

    return res.status(200).json({
      success: true,
      report: formatReport(report, userId, req.user.phone),
    });
  } catch (error) {
    console.error("Vote report error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark report as seen
// @route   POST /api/reports/:id/seen
// @access  Public / Optional Auth
export const markReportSeen = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) return res.status(200).json({ success: true });

    if (isMongoConnected) {
      const report = await Report.findById(req.params.id);
      if (report && !report.seenBy.includes(userId)) {
        report.seenBy.push(userId);
        await report.save();
      }
    } else {
      const report = memoryStore.reports.find((r) => (r._id || r.id)?.toString() === req.params.id?.toString());
      if (report) {
        report.seenBy = report.seenBy || [];
        if (!report.seenBy.includes(userId)) report.seenBy.push(userId);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
