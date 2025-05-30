const express = require("express");
const facultyController = require("../controllers/facultycontroller");
const facultyRouter = express.Router();


facultyRouter.get("/faculty", (req, res) => {
  res.send("Faculty route");
});

facultyRouter.post("/faculty-signup", facultyController.facultySignup);
facultyRouter.post("/faculty-login", facultyController.facultyLogin);
facultyRouter.post("/faculty/forget-password", facultyController.facultyForgetPassword);
facultyRouter.post("/faculty/reset-password/:email", facultyController.facultyResetPassword);
facultyRouter.post("/faculty/verify-otp/:email", facultyController.facultyVerifyOtp);
facultyRouter.get("/faculty/verify",facultyController.jwtAuth)


module.exports = facultyRouter;
