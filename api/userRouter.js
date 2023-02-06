const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUser,
  getUserByUsername,
  getallUsers,
} = require("../db/users");
const { createOrder } = require("../db/orders");

userRouter.use((req, res, next) => {
  console.log("A request is being made to /users...");
  next();
});

userRouter.post("/register", async (req, res, next) => {
  try {
    if (req.body.password.length < 8) {
      throw new Error("Password is too short, must be at least 8 characters");
    }

    const user = await createUser(req.body).catch((error) => {
      res.status(400).send({ error: "Error creating user" });
      throw error;
    });
    const userOrder = await createOrder({ creatorId: user.id });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.send({ user, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const user = await getUser(req.body);
    if (!user) {
      return res.status(400).send({ error: "Incorrect username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

userRouter.get("/me", async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.user.username);
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

userRouter.get("/all", async (req, res, next) => {
  try {
    const users = await getallUsers();
    res.send(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = userRouter;
