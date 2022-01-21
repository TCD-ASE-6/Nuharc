const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");

const app = express();

app.use(bodyParser.json());

// Get MongoDbURI according to ENV script
const db =
  process.env.NODE_ENV.trim() === "production"
    ? require("./config/keys").mongoURI
    : require("./config/keys").devMongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

// Route base path rules
app.use("/api/users", users);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server started on port ${port}`));