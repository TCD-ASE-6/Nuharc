const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const http = require("http");
const config = require("config");
const path = require("path");
const request = require("request");
const createHealthCheckManager =
  require("./loadBalancers/health-checks/index").createHealthCheckManager;
const { Server } = require("socket.io");

//APIs
const directionsAPI = require("./routes/api/directions");
const incidentsAPI = require("./routes/api/reportDisasterAPI");
const usersAPI = require("./routes/api/users");
const bikesAPI = require("./routes/api/dublinBikesAPI");
const WeightedRoundRobin = require("./loadBalancers/weightedRoundRobin");

const app1 = express();
const app2 = express();

const servers = ["http://localhost:3004", "http://localhost:3005"];
const weightRandomPool = [
  { host: "http://localhost:3004", weight: 2 },
  { host: "http://localhost:3005", weight: 5 },
];
let cur = 0;
app1.use(express.json());
app2.use(express.json());

const roundRobinHandler = (req, res) => {
  const _req = request({ url: servers[cur] + req.url }).on("error", (error) => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
  console.log(`Using port ${servers[cur]}`);
  cur = (cur + 1) % servers.length;
};

const weightedRoundRobinHandler = (req, res) => {
  const loadBalance = new WeightedRoundRobin(weightRandomPool);
  const address = loadBalance.pickHost();
  // const addressString = JSON.stringify(address)
  console.log(`Using port ${address.host}`);
  const _req = request({ url: address.host + req.url }).on("error", (error) => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
};

// Get MongoDbURI according to ENV script
const db = config.get("mongoURI");
// process.env.NODE_ENV.trim() === "production"
// ? config.get("mongoURI")
// : config.get("devMongoURI");

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Error while connecting to MongoDB!" + err));

// const port = process.env.PORT || 8080;

const server = express()
  .get("*", weightedRoundRobinHandler)
  .post("*", weightedRoundRobinHandler)
  .put("*", weightedRoundRobinHandler);
server.use(cors());

const httpServer = http.createServer(server);
// httpServer.use(cors());
const io = new Server(httpServer);

// passport middleware
app1.use(passport.initialize());
app2.use(passport.initialize());

// passport config
require("./config/passport")(passport);

app1.use(cors());
app2.use(cors());

app1.use((req, res, next) => {
  req.io = io;
  return next();
});
app2.use((req, res, next) => {
  req.io = io;
  return next();
});

// Route base path rules
app1.use("/api/users", usersAPI);
app2.use("/api/users", usersAPI);

app1.use("/api/directions", directionsAPI);
app2.use("/api/directions", directionsAPI);

app1.use("/api/incident", incidentsAPI);
app2.use("/api/incident", incidentsAPI);

app1.use("/api/bikes", bikesAPI);
app2.use("/api/bikes", bikesAPI);

// app1.use(express.static(path.join(__dirname, "../client/build")));
// app2.use(express.static(path.join(__dirname, "../client/build")));
// // Catch all requests that don't match any route
// app1.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });
// app2.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

const beforeShutdownCallback = () => {
  console.log("Shutdown in Progress");
};

const onShutdownCallback = () => {
  console.log("Shutdown has occured");
};

const healthCheckLogger = (log, error) => {
  console.log("Log from healthcheck...", log);
  console.log("Error from healthcheck...", error);
};

const onSendFailureWithShutdownLogger = () => {
  console.log("Sending failure has occcured for Shutdown ");
};

const livenessCheck = () =>
  new Promise((resolve, reject) => {
    // TODO: Need to add logic overhere to set app functioning correctly
    const appFunctioning = true;
    if (appFunctioning) {
      resolve();
    } else {
      reject(new Error("App is not functioning correctly"));
    }
  });

/**
 * Code to support graceful shutdown for the database in case shutdown occurs
 */

function onSigterm() {
  console.log("server is starting cleanup");
  // Adding graceful shudown for database
  return Promise.all([mongoose.connection.close()]);
}

const options = {
  timeout: 1000,
  onShutdown: onShutdownCallback,
  beforeShutdown: beforeShutdownCallback,
  healthChecks: {
    "/health/liveness": livenessCheck,
    __unsafeExposeStackTraces: true,
    verbatim: true,
  },
  sendFailuresWithShutdown: true,
  onSendFailureWithShutdown: onSendFailureWithShutdownLogger,
  logging: healthCheckLogger,
  statusSuccess: 200,
  statusError: 500,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  onSignal: onSigterm,
};
createHealthCheckManager(server, options);

server.listen(8081);
httpServer.listen(8080);

app1.listen(3004, () => console.log(`server started on port 3004`));
app2.listen(3005, () => console.log(`server started on port 3005`));
