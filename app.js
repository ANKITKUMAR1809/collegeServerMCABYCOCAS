const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load env variables
dotenv.config();

// App init
const app = express();

// ✅ CORS Middleware - allow frontend origin and credentials
app.use(cors({
  origin: "https://mcabycocas.onrender.com" && "http://localhost:5173",  // Replace with your frontend domain
  credentials: true,
}));

// ✅ Body parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB session store


// ✅ Express session with cookie config for cross-origin


// ✅ Routes
const studentRouter = require("./routers/studentRoute");
const facultyRouter = require("./routers/facultyRouter");
const notificationRouter = require("./routers/notificationRouter");
const chatBotRouter =require("./routers/chatbotRouter");

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Mount routers
app.use(studentRouter);
app.use("/auth", facultyRouter);
app.use(notificationRouter);
app.use("/chat", chatBotRouter);

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log("Connected to MongoDB");
      console.log("Server running on port " + port);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
