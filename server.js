const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const config = require("config");
const bodyParser = require("body-parser");
const directions = require("./routes/api/directions");
const request = require("request");

const app1 = express();
const app2 = express();

const servers = ["http://localhost:3004", "http://localhost:3005"];
let cur = 0;
app1.use(express.json());
app2.use(express.json());

const handler = (req, res) => {
  const _req = request({ url: servers[cur] + req.url }).on("error", (error) => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
  console.log(`Using port ${servers[cur]}`);
  cur = (cur + 1) % servers.length;
};

// Add the client URL to the CORS policy
// const whitelist = process.env.WHITELISTED_DOMAINS
//   ? process.env.WHITELISTED_DOMAINS.split(",")
//   : [];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },

//   credentials: true,
// };

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
app1.use(passport.initialize());
app2.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// Route base path rules
app1.use("/api/users", users);
app2.use("/api/users", users);

app1.use("/api/directions", directions);
app2.use("/api/directions", directions);

// const port = process.env.PORT || 8080;

const server = express().get("*", handler).post("*", handler);

server.listen(8080);

app1.listen(3004, () => console.log(`server started on port 3004`));
app2.listen(3005, () => console.log(`server started on port 3005`));
