const Notification = require("../models/notificationModel");
const Faculty = require("../models/facultyModel");

exports.createNotification = async (req, res) => {
  try {
    const id = req.session.user.id;
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(401).json({ message: "Please login as Faculty" });
    }

    const { notice } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = file.secure_url || file.path;

    const notification = new Notification({
      name: faculty.name,
      notice,
      image: imageUrl,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      notification,
      message: "Notification with image created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
