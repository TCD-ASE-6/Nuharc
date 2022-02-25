const express = require("express");
const router = express.Router();
const axios = require("axios");
var polyline = require("google-polyline");

const keys = require("../../config/keys");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/getRoute", async (req, res) => {
  const params = req.url.split("?")[1].split("&");
  const from = params[0].split("=")[1];
  const to = params[1].split("=")[1];
  const wayPoints = [];
  axios
    .get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${keys.googleMapsAPIKey}&sensor=false&alternatives=true`
    )
    .then(function (response) {
      // res.send(response.data);
      routes = response.data.routes;
      routes.map((route, idx) => {
        route_decoded = polyline.decode(route.overview_polyline.points);
        wayPoints.push(route_decoded);
      });
      console.log(wayPoints);
      res.send(wayPoints);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
