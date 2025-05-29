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

// ✅ IMPORTANT: Trust proxy for secure cookies (Render HTTPS)
app.set("trust proxy", 1);

// ✅ CORS Middleware - allow frontend origin and credentials
app.use(cors({
  origin: "https://mcabycocas.onrender.com", // your frontend domain
  credentials: true,
}));

// ✅ Body parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

// ✅ Express session setup with secure cookie config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: true,         // ✅ Required for HTTPS (Render uses HTTPS)
    sameSite: "none",     // ✅ Required for cross-site cookies
    maxAge: 1000 * 60 * 60, // 1 hour
  },
}));

// ✅ TEMP TEST: Session checker route (for debugging)
app.get("/auth/session-check", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ Mount your routers
const studentRouter = require("./routers/studentRoute");
const facultyRouter = require("./routers/facultyRouter");
const notificationRouter = require("./routers/notificationRouter");

app.get("/", (req, res) => {
  res.send("Hello World from Backend");
});

app.use(studentRouter);
app.use("/auth", facultyRouter);
app.use(notificationRouter);

// ✅ MongoDB connection and server start
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
