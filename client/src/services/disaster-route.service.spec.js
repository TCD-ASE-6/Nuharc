const http = require("http");
const DisasterRouteService = require("./disaster-route.service");
const expect = require("chai").expect;

// import DisasterRouteService from "./disaster-route.service";
// import http from "http";
// import { expect } from "chai";

process.setMaxListeners(100); // Removes node's built in max listeners warning while we're testing

const isContentTypeJSONPresent = (response) => {
  expect(response.headers.has("Content-Type")).to.eql(true);
  expect(response.headers.get("Content-Type")).to.eql("application/json");
};

describe("Disaster Route Service", () => {
  let server;
  beforeEach(() => {
    server = http.createServer((req, res) => res.end("server"));
  });

  afterEach(() => {
    server.close();
  });

  describe("Supports code for DisasterRouteService", () => {
    it("getRoute", async () => {
      const routeService = new DisasterRouteService();
      const source = "53.33810241909542,-6.2587451872999305";
      const destination = "53.35674586966649,-6.257488946686209";

      const currentRoute = await routeService.getRoute(source, destination);
      const outputListFirstElement = [53.33926, -6.258];

      expect(currentRoute[0]).to.eql(outputListFirstElement);
    });

    it("getRouteFail", async () => {
      const routeService = new DisasterRouteService();
      const source = "53.33810241909542,-6.2587451872999305";
      const destination = "53.35674586966649,-6.257488946686209";

      const currentRoute = await routeService.getRoute(source, destination);
      const outputListFirstElement = [53.33926, -6.258];

      expect(currentRoute[0][0]).to.not.eql(outputListFirstElement);
    });

    it("getOptimalRoute", async () => {
      const routeService = new DisasterRouteService();
      const incidentList = {
        data: [
          {
            _id: "624f04dba9b09a7112126c5a",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-07T15:35:55.765Z",
            __v: 0,
          },
          {
            _id: "624efea61ef63cc5c19e0088",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:26.714Z",
            __v: 0,
          },
          {
            _id: "624efe9f1ef63cc5c19e0084",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:19.243Z",
            __v: 0,
          },
          {
            _id: "624afcb6595cd2d8478f4064",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-04T14:12:06.553Z",
            __v: 0,
          },
          {
            _id: "6249e8c4e86337e6a1d5383e",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T18:34:44.823Z",
            __v: 0,
          },
          {
            _id: "6249dd5fdec616382e1bb96f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-03T17:46:07.759Z",
            __v: 0,
          },
          {
            _id: "6249dcef110d4222ef65e74f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T17:44:15.277Z",
            __v: 0,
          },
          {
            _id: "62487af5a39e191e1269c341",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-02T16:33:57.520Z",
            __v: 0,
          },
          {
            _id: "6248736bf48c5372837a7386",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-02T16:01:47.481Z",
            __v: 0,
          },
          {
            _id: "6248434ac18d2c896da695b7",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-02T12:36:26.203Z",
            __v: 0,
          },
          {
            _id: "6246d94d562f48d4138db87d",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-01T10:51:57.126Z",
            __v: 0,
          },
        ],
      };

      const routes = [
        [
          [53.33926, -6.258],
          [53.33947, -6.25869],
          [53.33949, -6.25874],
          [53.33951, -6.25878],
          [53.33992, -6.25866],
          [53.34057, -6.25846],
          [53.34132, -6.25824],
          [53.34128, -6.25804],
          [53.34124, -6.2577],
          [53.34118, -6.25716],
          [53.34115, -6.25702],
          [53.34121, -6.257],
          [53.3415, -6.25686],
          [53.34161, -6.25681],
          [53.34257, -6.25629],
          [53.34216, -6.25437],
          [53.342, -6.25363],
          [53.34186, -6.25286],
          [53.34184, -6.25253],
          [53.34186, -6.25244],
          [53.34203, -6.25199],
          [53.34215, -6.25158],
          [53.34215, -6.25139],
          [53.34201, -6.25059],
          [53.34248, -6.2503],
          [53.34358, -6.24963],
          [53.34376, -6.24953],
          [53.34385, -6.24947],
          [53.34395, -6.24947],
          [53.34404, -6.24949],
          [53.34413, -6.24956],
          [53.34418, -6.24963],
          [53.34422, -6.2498],
          [53.34438, -6.25053],
          [53.34459, -6.2515],
          [53.34472, -6.25227],
          [53.34503, -6.25395],
          [53.34522, -6.25499],
          [53.34529, -6.25513],
          [53.34533, -6.25517],
          [53.34541, -6.25517],
          [53.34587, -6.25515],
          [53.34653, -6.25513],
          [53.34682, -6.25511],
          [53.34757, -6.25499],
          [53.3482, -6.25496],
          [53.34845, -6.25495],
          [53.34854, -6.25493],
          [53.3486, -6.25493],
          [53.34866, -6.25497],
          [53.34877, -6.25492],
          [53.34909, -6.25478],
          [53.34919, -6.25474],
          [53.34924, -6.25465],
          [53.34941, -6.2542],
          [53.3495, -6.25386],
          [53.34958, -6.25377],
          [53.34963, -6.25374],
          [53.34969, -6.25375],
          [53.34975, -6.25377],
          [53.34978, -6.25377],
          [53.34981, -6.25376],
          [53.34992, -6.25386],
          [53.35013, -6.254],
          [53.35058, -6.25431],
          [53.35147, -6.25493],
          [53.35159, -6.25502],
          [53.35206, -6.25536],
          [53.35303, -6.25605],
          [53.35364, -6.25648],
          [53.35416, -6.25686],
          [53.3547, -6.25725],
          [53.35565, -6.25794],
          [53.35629, -6.25856],
          [53.35687, -6.25913],
          [53.35722, -6.25814],
        ],
      ];

      const output = [
        [53.33926, -6.258],
        [53.33947, -6.25869],
        [53.33949, -6.25874],
        [53.33951, -6.25878],
        [53.33992, -6.25866],
        [53.34057, -6.25846],
        [53.34132, -6.25824],
        [53.34128, -6.25804],
        [53.34124, -6.2577],
        [53.34118, -6.25716],
        [53.34115, -6.25702],
        [53.34121, -6.257],
        [53.3415, -6.25686],
        [53.34161, -6.25681],
        [53.34257, -6.25629],
        [53.34216, -6.25437],
        [53.342, -6.25363],
        [53.34186, -6.25286],
        [53.34184, -6.25253],
        [53.34186, -6.25244],
        [53.34203, -6.25199],
        [53.34215, -6.25158],
        [53.34215, -6.25139],
        [53.34201, -6.25059],
        [53.34248, -6.2503],
        [53.34358, -6.24963],
        [53.34376, -6.24953],
        [53.34385, -6.24947],
        [53.34395, -6.24947],
        [53.34404, -6.24949],
        [53.34413, -6.24956],
        [53.34418, -6.24963],
        [53.34422, -6.2498],
        [53.34438, -6.25053],
        [53.34459, -6.2515],
        [53.34472, -6.25227],
        [53.34503, -6.25395],
        [53.34522, -6.25499],
        [53.34529, -6.25513],
        [53.34533, -6.25517],
        [53.34541, -6.25517],
        [53.34587, -6.25515],
        [53.34653, -6.25513],
        [53.34682, -6.25511],
        [53.34757, -6.25499],
        [53.3482, -6.25496],
        [53.34845, -6.25495],
        [53.34854, -6.25493],
        [53.3486, -6.25493],
        [53.34866, -6.25497],
        [53.34877, -6.25492],
        [53.34909, -6.25478],
        [53.34919, -6.25474],
        [53.34924, -6.25465],
        [53.34941, -6.2542],
        [53.3495, -6.25386],
        [53.34958, -6.25377],
        [53.34963, -6.25374],
        [53.34969, -6.25375],
        [53.34975, -6.25377],
        [53.34978, -6.25377],
        [53.34981, -6.25376],
        [53.34992, -6.25386],
        [53.35013, -6.254],
        [53.35058, -6.25431],
        [53.35147, -6.25493],
        [53.35159, -6.25502],
        [53.35206, -6.25536],
        [53.35303, -6.25605],
        [53.35364, -6.25648],
        [53.35416, -6.25686],
        [53.3547, -6.25725],
        [53.35565, -6.25794],
        [53.35629, -6.25856],
        [53.35687, -6.25913],
        [53.35722, -6.25814],
      ];

      const optimalRoute = routeService.getOptimalRoute(routes, incidentList);

      expect(optimalRoute).to.eql(output);
    });

    it("getOptimalRouteFail", async () => {
      const routeService = new DisasterRouteService();
      const incidentList = {
        data: [
          {
            _id: "624f04dba9b09a7112126c5a",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-07T15:35:55.765Z",
            __v: 0,
          },
          {
            _id: "624efea61ef63cc5c19e0088",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:26.714Z",
            __v: 0,
          },
          {
            _id: "624efe9f1ef63cc5c19e0084",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:19.243Z",
            __v: 0,
          },
          {
            _id: "624afcb6595cd2d8478f4064",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-04T14:12:06.553Z",
            __v: 0,
          },
          {
            _id: "6249e8c4e86337e6a1d5383e",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T18:34:44.823Z",
            __v: 0,
          },
          {
            _id: "6249dd5fdec616382e1bb96f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-03T17:46:07.759Z",
            __v: 0,
          },
          {
            _id: "6249dcef110d4222ef65e74f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T17:44:15.277Z",
            __v: 0,
          },
          {
            _id: "62487af5a39e191e1269c341",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-02T16:33:57.520Z",
            __v: 0,
          },
          {
            _id: "6248736bf48c5372837a7386",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-02T16:01:47.481Z",
            __v: 0,
          },
          {
            _id: "6248434ac18d2c896da695b7",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-02T12:36:26.203Z",
            __v: 0,
          },
          {
            _id: "6246d94d562f48d4138db87d",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-01T10:51:57.126Z",
            __v: 0,
          },
        ],
      };

      const routes = [
        [
          [53.33926, -6.258],
          [53.33947, -6.25869],
          [53.33949, -6.25874],
          [53.33951, -6.25878],
          [53.33992, -6.25866],
          [53.34057, -6.25846],
          [53.34132, -6.25824],
          [53.34128, -6.25804],
          [53.34124, -6.2577],
          [53.34118, -6.25716],
          [53.34115, -6.25702],
          [53.34121, -6.257],
          [53.3415, -6.25686],
          [53.34161, -6.25681],
          [53.34257, -6.25629],
          [53.34216, -6.25437],
          [53.342, -6.25363],
          [53.34186, -6.25286],
          [53.34184, -6.25253],
          [53.34186, -6.25244],
          [53.34203, -6.25199],
          [53.34215, -6.25158],
          [53.34215, -6.25139],
          [53.34201, -6.25059],
          [53.34248, -6.2503],
          [53.34358, -6.24963],
          [53.34376, -6.24953],
          [53.34385, -6.24947],
          [53.34395, -6.24947],
          [53.34404, -6.24949],
          [53.34413, -6.24956],
          [53.34418, -6.24963],
          [53.34422, -6.2498],
          [53.34438, -6.25053],
          [53.34459, -6.2515],
          [53.34472, -6.25227],
          [53.34503, -6.25395],
          [53.34522, -6.25499],
          [53.34529, -6.25513],
          [53.34533, -6.25517],
          [53.34541, -6.25517],
          [53.34587, -6.25515],
          [53.34653, -6.25513],
          [53.34682, -6.25511],
          [53.34757, -6.25499],
          [53.3482, -6.25496],
          [53.34845, -6.25495],
          [53.34854, -6.25493],
          [53.3486, -6.25493],
          [53.34866, -6.25497],
          [53.34877, -6.25492],
          [53.34909, -6.25478],
          [53.34919, -6.25474],
          [53.34924, -6.25465],
          [53.34941, -6.2542],
          [53.3495, -6.25386],
          [53.34958, -6.25377],
          [53.34963, -6.25374],
          [53.34969, -6.25375],
          [53.34975, -6.25377],
          [53.34978, -6.25377],
          [53.34981, -6.25376],
          [53.34992, -6.25386],
          [53.35013, -6.254],
          [53.35058, -6.25431],
          [53.35147, -6.25493],
          [53.35159, -6.25502],
          [53.35206, -6.25536],
          [53.35303, -6.25605],
          [53.35364, -6.25648],
          [53.35416, -6.25686],
          [53.3547, -6.25725],
          [53.35565, -6.25794],
          [53.35629, -6.25856],
          [53.35687, -6.25913],
          [53.35722, -6.25814],
        ],
      ];

      const output = [
        [53.33926, -6.258],
        [53.33947, -6.25869],
        [53.33949, -6.25874],
        [53.33951, -6.25878],
        [53.33992, -6.25866],
        [53.34057, -6.25846],
        [53.34132, -6.25824],
        [53.34128, -6.25804],
        [53.34124, -6.2577],
        [53.34118, -6.25716],
        [53.34115, -6.25702],
        [53.34121, -6.257],
        [53.3415, -6.25686],
        [53.34161, -6.25681],
        [53.34257, -6.25629],
        [53.34216, -6.25437],
        [53.342, -6.25363],
        [53.34186, -6.25286],
        [53.34184, -6.25253],
        [53.34186, -6.25244],
        [53.34203, -6.25199],
        [53.34215, -6.25158],
        [53.34215, -6.25139],
        [53.34201, -6.25059],
        [53.34248, -6.2503],
        [53.34358, -6.24963],
        [53.34376, -6.24953],
        [53.34385, -6.24947],
        [53.34395, -6.24947],
        [53.34404, -6.24949],
        [53.34413, -6.24956],
        [53.34418, -6.24963],
        [53.34422, -6.2498],
        [53.34438, -6.25053],
        [53.34459, -6.2515],
        [53.34472, -6.25227],
        [53.34503, -6.25395],
        [53.34522, -6.25499],
        [53.34529, -6.25513],
        [53.34533, -6.25517],
        [53.34541, -6.25517],
        [53.34587, -6.25515],
        [53.34653, -6.25513],
        [53.34682, -6.25511],
        [53.34757, -6.25499],
        [53.3482, -6.25496],
        [53.34845, -6.25495],
        [53.34854, -6.25493],
        [53.3486, -6.25493],
        [53.34866, -6.25497],
        [53.34877, -6.25492],
        [53.34909, -6.25478],
        [53.34919, -6.25474],
        [53.34924, -6.25465],
        [53.34941, -6.2542],
        [53.3495, -6.25386],
        [53.34958, -6.25377],
        [53.34963, -6.25374],
        [53.34969, -6.25375],
        [53.34975, -6.25377],
        [53.34978, -6.25377],
        [53.34981, -6.25376],
        [53.34992, -6.25386],
        [53.35013, -6.254],
        [53.35058, -6.25431],
        [53.35147, -6.25493],
        [53.35159, -6.25502],
        [53.35206, -6.25536],
        [53.35303, -6.25605],
        [53.35364, -6.25648],
        [53.35416, -6.25686],
        [53.3547, -6.25725],
        [53.35565, -6.25794],
        [53.35629, -6.25856],
        [53.35687, -6.25913],
        [53.35722, -6.25814],
      ];

      const optimalRoute = routeService.getOptimalRoute(routes, incidentList);

      expect(optimalRoute).to.not.eql(output[0]);
    });

    it("arePointsNear", async () => {
      const routeService = new DisasterRouteService();
      const p1 = {
        lat: 53.35722,
        lng: -6.25814,
      };
      const p2 = {
        lat: 53.35722,
        lng: -6.25814,
      };

      const boolOutput = routeService.arePointsNear(p1, p2, 0.2);
      expect(boolOutput).to.eql(true);
    });

    it("arePointsNear", async () => {
      const routeService = new DisasterRouteService();
      const p1 = {
        lat: 53.35722,
        lng: -6.25814,
      };
      const p2 = {
        lat: 53.35722,
        lng: -6.25814,
      };

      const boolOutput = routeService.arePointsNear(p1, p2, 0.2);
      expect(boolOutput).to.not.eql(false);
    });

    it("configureIncidentList", async () => {
      const routeService = new DisasterRouteService();
      const incidentList = {
        data: [
          {
            _id: "624f04dba9b09a7112126c5a",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-07T15:35:55.765Z",
            __v: 0,
          },
          {
            _id: "624efea61ef63cc5c19e0088",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:26.714Z",
            __v: 0,
          },
          {
            _id: "624efe9f1ef63cc5c19e0084",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-07T15:09:19.243Z",
            __v: 0,
          },
          {
            _id: "624afcb6595cd2d8478f4064",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-04T14:12:06.553Z",
            __v: 0,
          },
          {
            _id: "6249e8c4e86337e6a1d5383e",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T18:34:44.823Z",
            __v: 0,
          },
          {
            _id: "6249dd5fdec616382e1bb96f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-03T17:46:07.759Z",
            __v: 0,
          },
          {
            _id: "6249dcef110d4222ef65e74f",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-03T17:44:15.277Z",
            __v: 0,
          },
          {
            _id: "62487af5a39e191e1269c341",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Fire",
            active: true,
            date: "2022-04-02T16:33:57.520Z",
            __v: 0,
          },
          {
            _id: "6248736bf48c5372837a7386",
            longitude: [Object],
            latitude: [Object],
            incidentType: "CarAccident",
            active: true,
            date: "2022-04-02T16:01:47.481Z",
            __v: 0,
          },
          {
            _id: "6248434ac18d2c896da695b7",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-02T12:36:26.203Z",
            __v: 0,
          },
          {
            _id: "6246d94d562f48d4138db87d",
            longitude: [Object],
            latitude: [Object],
            incidentType: "Explosion",
            active: true,
            date: "2022-04-01T10:51:57.126Z",
            __v: 0,
          },
        ],
      };
      await routeService.configureIncidentList();
      expect(incidentList).to.not.eql(routeService.incidentList.data);
    });
  });
});
