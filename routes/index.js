var express = require("express");
var router = express.Router();
var fs = require("fs");
var app = express();
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/.netlify/functions/index", router);

const members = [
  {
    memberId: 2,
    managerId: 1,
    firstName: "Tom",
    lastName: "Smith"
  },
  {
    memberId: 1234,
    managerId: 21234,
    firstName: "Mark",
    lastName: "Vong"
  },
  {
    memberId: 5432,
    managerId: 1234,
    firstName: "Kevin",
    lastName: "Ross"
  },
  {
    memberId: 9812,
    managerId: 2136,
    firstName: "Louis",
    lastName: "Garcia"
  }
];
router.get("/", (req, res) => {
  fs.readFile(__dirname + "/db.json", (err, json) => {
    res.json({
      members: members
    });
  });
});

router.post("/", (req, res) => {
  const userProfile = req.body["data"]["userProfile"];
  const member = members.find(
    (member) => member["memberId"] === userProfile["memberId"]
  );
  let memberExists = false;
  const deny = {
    commands: [
      {
        type: "com.okta.action.update",
        value: {
          registration: "DENY"
        }
      }
    ],
    error: {
      errorSummary: "Errors were found in the user profile",
      errorCauses: [
        {
          errorSummary:
            "You must be an existing customer to create a user profile. Contact support for help.",
          reason: "INVALID_EMAIL_DOMAIN",
          locationType: "body",
          location: "data.userProfile.login",
          domain: "end-user"
        }
      ]
    }
  };
  if (member) {
    memberExists =
      member["lastName"].toLowerCase() ===
        userProfile["lastName"].toLowerCase() &&
      member["firstName"].toLowerCase() ===
        userProfile["firstName"].toLowerCase();
  } else {
    res.json(deny);
  }

  // console.log(member["managerId"]);
  // const managerId = member["managerId"];
  const approve = {
    commands: [
      {
        type: "com.okta.action.update",
        value: {
          registration: "ALLOW"
        }
      },
      {
        type: "com.okta.user.profile.update",
        value: {
          managerId: member["managerId"],
          memberId: member["memberId"],
          firstName: userProfile["firstName"],
          lastName: userProfile["lastName"],
          email: userProfile["email"],
          login: userProfile["login"]
        }
      }
    ]
  };
  if (!memberExists) {
    res.json(deny);
  } else {
    res.json(approve);
  }
});

module.exports.handler = serverless(app);
