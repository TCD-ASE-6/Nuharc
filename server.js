const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

const users = require("./routes/api/users");
const config = require("config");

const app = express();

app.use(express.json());

//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));

// Get MongoDbURI according to ENV script
const db =
  process.env.NODE_ENV.trim() === "production"
    ? config.get("mongoURI")
    : config.get("devMongoURI");

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// Route base path rules
app.use("/api/users", users);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server started on port ${port}`));
