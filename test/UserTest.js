// delete user if already existing

describe("user test cases", function () {
  describe("user post", () => {
    it("should give error saying different passwords", async () => {
      const fetch = require("node-fetch");
      const assert = require("assert");
      var user = {
        name: "olivertest6",
        surname: "k",
        password1: "k1234567",
        password2: "k123456",
        email: "ok6@xyz.com",
        role: "admin",
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      };

      await fetch("http://localhost:8080/api/users/signup", requestOptions)
        .then((response) => {
          // console.log(response);
          assert.equal(response.status, 400);
        });
    });
  });

  describe("user post", () => {
    it("should create new user", async () => {
      const fetch = require("node-fetch");
      const assert = require("assert");
      var user = {
        name: "olivertest5",
        surname: "k",
        password1: "k123456",
        password2: "k123456",
        email: "ok5@xyz.com",
        role: "admin",
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      };

      await fetch("http://localhost:8080/api/users/signup", requestOptions)
        .then((response) => {
          assert.equal(response.status, 200);
        });
    });
  });

  describe("user post", () => {
    it("should give error getting user with wrong password", async () => {
      const fetch = require("node-fetch");
      const assert = require("assert");
      var user = {
        email: "ok5@xyz.com",
        password: "k12345634"
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      };

      await fetch("http://localhost:8080/api/users/login", requestOptions)
        .then((response) => {
          assert.equal(response.status, 400);
        });
    });
  });

  describe("user post", () => {
    it("should give 200 when logging in with correct details", async () => {
      const fetch = require("node-fetch");
      const assert = require("assert");
      var user = {
        email: "ok5@xyz.com",
        password: "k123456"
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      };

      await fetch("http://localhost:8080/api/users/login", requestOptions)
        .then((response) => {
          assert.equal(response.status, 200);
        });
    });
  });
});
