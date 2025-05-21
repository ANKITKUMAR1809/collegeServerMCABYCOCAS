const express = require("express");
const notificationRouter = express.Router();
const notificationController = require("../controllers/notificationController");
const upload = require('../middleware/upload');

notificationRouter.post(
  "/publish-notification",
  upload.single("file"),
  notificationController.createNotification
);

notificationRouter.get(
  "/get-notification",
  notificationController.getAllNotifications
);

module.exports = notificationRouter;
