var express = require("express");
var router = express.Router();
var fs = require("fs");
var app = express();
const serverless = require("serverless-http");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.get("/", (req, res) => {
  fs.readFile(__dirname + "/db.json", (err, json) => {
    res.json({
      members: [
        {
          memberId: 1234,
          firstName: "Mark",
          lastName: "Vong"
        },
        {
          memberId: 12345,
          firstName: "Meek",
          lastName: "Vong"
        }
      ]
    });
  });
});

router.post("/", (req, res) => {
  res.json(req);
});

app.use("/.netlify/functions/index", router);

module.exports.handler = serverless(app);
