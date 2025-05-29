const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notice: String,
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
