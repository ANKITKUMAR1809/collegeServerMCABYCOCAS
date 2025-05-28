const express = require('express');
const chatBotRouter = express.Router();
const chatBotController = require('../controllers/chatbotController.js');

chatBotRouter.post('/ai', chatBotController.postChat);


module.exports= chatBotRouter;