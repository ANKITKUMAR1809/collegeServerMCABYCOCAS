const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notice: String,
  image: {
    type: String,
    required: true,
    validate: {
      validator: url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
      message: "Only valid image URLs are allowed",
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
