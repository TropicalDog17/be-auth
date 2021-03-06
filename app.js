const express = require("express");
const app = express();
const dbConnect = require("./db/dbConnect");
const User = require("./model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
// body parser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConnect();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.get("/", (req, res, next) => {
  res.json({ message: "Hey! This is your server response!" });
  next();
});
async function hashPassword(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    req.newUser = newUser;
    next();
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Password was not hashed successfully", err });
  }
}
app.post("/register", hashPassword, async (req, res) => {
  //Saving new user to db
  try {
    const result = await newUser.save();
    return res.status(201).send({
      message: "User created successfully",
      result,
    });
  } catch (err) {
    //Catch error if not save successfully
    return res.status(500).send({
      message: "Error creating user",
      err,
    });
  }
});
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({ message: "Password do not match" });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOMTOKEN"
          );
          return res.status(200).send({
            message: "Login successfully",
            email: user.email,
            access_token: token,
          });
        })
        .catch((err) => {
          res.status(400).send({
            message: "Password do not match",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        message: "Email not found",
        err,
      });
    });
});
app.get("/free-endpoint", (req, res) => {
  res.status(200).json({ message: "Free to access!" });
});
app.get("/auth-endpoint", auth, (req, res) => {
  res.status(200).json({ message: "You are authorized to access me!" });
});
module.exports = app;
