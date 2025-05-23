const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Load env variables
dotenv.config();

// App init
const app = express();

// CORS Middleware (must come first!)
app.use(cors({
  origin: "https://mcabycocas.onrender.com", // your frontend origin
  credentials: true, // allow cookies/session
}));

// Body parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store, 
  })
);

// Routes
const studentRouter = require("./routers/studentRoute");
const facultyRouter = require("./routers/facultyRouter");
const notificationRouter = require("./routers/notificationRouter");

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routers
app.use(studentRouter);
app.use("/auth", facultyRouter);
app.use(notificationRouter);

// Connect to MongoDB and start server
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
