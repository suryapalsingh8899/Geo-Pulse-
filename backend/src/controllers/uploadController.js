// @desc    Upload image or video file
// @route   POST /api/upload
// @access  Public / Private
export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
      relativeUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public / Private
export const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }

    const host = req.get("host");
    const protocol = req.protocol;

    const uploadedFiles = req.files.map((file) => ({
      url: `${protocol}://${host}/uploads/${file.filename}`,
      relativeUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
