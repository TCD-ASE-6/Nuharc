const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const directions = require("./routes/api/directions");

const app = express();

app.use(bodyParser.json());

const db =
  process.env.NODE_ENV.trim() === "production"
    ? require("./config/keys").mongoURI
    : require("./config/keys").devMongoURI;

mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

app.use("/api/directions", directions);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server started on port ${port}`));
