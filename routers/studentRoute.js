const express = require('express');
const studentRouter = express.Router();
const studentController = require('../controllers/studentcontroller.js');

studentRouter.post("/register-student",studentController.postRegisterStudents)
studentRouter.get("/register-student",studentController.getRegisterStudents)

module.exports = studentRouter;