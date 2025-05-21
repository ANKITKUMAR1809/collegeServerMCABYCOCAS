const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


// Load environment variables from .env file
dotenv.config();

// Importing the express module
const app = express();

// Importing routes
const studentRouter = require("./routers/studentRoute");
const facultyRouter = require("./routers/facultyRouter");
const notificationRouter = require('./routers/notificationRouter');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
// Middleware for session management
app.use(
  cors({
    origin: "https://mcabycocas.onrender.com/",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store, 
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(studentRouter);

app.use("/auth", facultyRouter);

app.use(notificationRouter);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT ||4000, () => {
      console.log("Connected to MongoDB");
      console.log("Server is running on port " + process.env.PORT);
      console.log("http://localhost:" + (process.env.PORT || 4000));
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
