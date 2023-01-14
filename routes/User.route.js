const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

userRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    const users = await UserModel.find(query);
    res.send(users);
  } catch (err) {
    console.log(err);
    res.send({ err: "Oop's Something went wrong" });
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password, age, name } = req.body;
  try {
    bcrypt.hash(
      password,
      5,
      async (err, secure_password) => {
        // Store hash in your password DB.
        if (err) {
          console.log(err);
        } else {
          const user = new UserModel({
            name,
            email,
            age,
            password: secure_password,
          });
          await user.save();
          res.send("Registered Successfully");
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.send({ err: "Something went Wrong in Registration" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    const hashed_pass = user[0].password;
    if (user.length > 0) {
      bcrypt.compare(password, hashed_pass, (err, result) => {
        // result == true
        if (result) {
          var token = jwt.sign({ userID: user[0]._id }, process.env.jwtKey);
          res.send({ msg: "Login Successfull", token: token });
        } else {
          res.send("Wrong Credentials");
        }
      });
    } else {
      res.send("Wrong Credentials");
    }
    console.log(user);
  } catch (err) {
    console.log(err);
    res.send({ err: "Something went Wrong while Logging in" });
  }
});

userRouter.get("/cart", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.jwtKey, (err, decoded) => {
    if (err) {
      res.send("Invalid Token");
      console.log(err);
    } else {
      res.send("CART PAGE");
    }
  });
});

userRouter.get("/data", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.jwtKey, (err, decoded) => {
    if (err) {
      res.send("Invalid Token");
      console.log(err);
    } else {
      res.send("Data...");
    }
  });
});

module.exports = {
  userRouter,
};
