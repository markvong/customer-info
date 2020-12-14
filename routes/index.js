var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api", (req, res) => {
  fs.readFile(__dirname + "/db.json", (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  });
});

module.exports = router;
