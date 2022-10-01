const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, resp, next) => {
  if (!req.headers.authorization) {
    resp.status(403).send({
      message: "Token required",
    });
    console.log("Token required");
  } else {
    console.log(req.headers);
    let token = req.headers.authorization.split(" ")[1];
    console.log(token);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, decoded) {
        if (err) {
          resp.status(401).send({
            message: "Invalid Request",
          });
          console.log("Invalid Request");
        }
        req.user = decoded;
        console.log(req.user);
        next();
      }
    );
  }
};

module.exports = verifyToken;
