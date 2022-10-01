const bcrypt = require("bcrypt");
const dataModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require("dotenv").config();

let salt = 10;

const signup = async (req, resp) => {
  bcrypt.hash(req.body.password, salt, async function (err, hash) {
    let data = new dataModel({
      username: req.body.username,
      password: hash,
    });

    console.log(`req: ${req}\n\ndata: ${data}\n\nhash:${hash}\n\nerr:${err}`);

    let user = await dataModel.find({ username: req.body.username });

    if (user.length == 0) {
      let result = await data.save();
      console.log(`result: ${result}`);

      resp
        .status(200)
        .send({ username: result.username, password: result.password });
    } else {
      resp.status(400).send({
        message: "You cannot use this username",
      });
    }
  });
};

const login = async (req, resp) => {
  console.log(req.body);
  let user = await dataModel.findOne({ username: req.body.username });
  if (user) {
    console.log(user, req.body.password);
    bcrypt.compare(
      req.body.password,
      user.password,
      async function (err, result) {
        console.log(result);
        if (result === true) {
          jwt.sign(
            { data: user },
            process.env.ACCESS_TOKEN_SECRET,
            (err, token) => {
              if (err) {
                throw err;
              } else {
                user.token = token;
                resp.status(200).send({
                  message: "Logged in successfully",
                  token: user.token,
                });
                console.log("Logged in successfully");
                console.log(user.token);
              }
            }
          );
        } else {
          resp.status(404).send({
            message: "Password doesn't match",
          });
          console.log("Password doesn't match");
        }
      }
    );
  } else {
    resp.status(404).send({
      message: "User doesn't exist",
    });
    console.log("User doesn't exist");
  }
};

const show = async (req, resp) => {
  let user = req.user.data.username;
  let data = await userModel.findOne({ username: user });
  resp.status(200).send({ data });
  console.log({ data });
};

const update = async (req, resp) => {
  let user = await userModel.find({ username: req.body.username });
  if (user.length == 0) {
    let newUsername = req.body.username;

    let data = await userModel.updateOne(
      { username: req.user.data.username },
      { $set: { username: newUsername } }
    );
    console.log("Second: ", data);

    const newUserData = await userModel.findOne({ username: newUsername });
    console.log(newUserData);

    jwt.sign(
      { data: newUserData },
      process.env.ACCESS_TOKEN_SECRET,
      (err, token) => {
        if (err) {
          throw err;
        } else {
          resp.status(200).send({
            message: "Username updated",
            updatedToken: token,
          });
          console.log("Username updated");
          console.log(token);
        }
      }
    );
  } else {
    resp.status(400).send({
      message: "You cannot use this username",
    });
    console.log("You cannot use this username");
  }
};

const remove = async (req, resp) => {
  let data = await userModel.deleteOne({ username: req.user.data.username });
  resp.status(200).send({
    message: "User deleted successfully",
  });
  console.log("User deleted");
};

module.exports = { signup, login, show, update, remove };
