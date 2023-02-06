require("dotenv").config();
const express = require("express");
const apiRouter = require("./api");
const JWT = require("jsonwebtoken");
const morgan = require("morgan");
let PORT = process.env.PORT || 3001;
const { getUserById } = require("./db/users");
const { getCartByUserId, getAllProductsByOrderId } = require("./db/orders");

const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return next();
    }
    try {
      const auth = req.headers.authorization.split(" ")[1];
      const _user = await JWT.decode(auth, process.env.JWT_SECRET);
      if (!_user) {
        return next();
      }
      const user = await getUserById(_user.id);
      req.user = user;
      req.user.cart = await getCartByUserId(user.id);
      req.user.cart.products = await getAllProductsByOrderId(req.user.cart.id);
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).send({ error: "Invalid Token" });
      }
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

app.use("/api", apiRouter);

app.use(express.static("build"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.use(({ name, message }, req, res, next) => {
  res.status(400).send({ name, message });
});

app.listen(PORT, () => {
  console.log("Server is up on port: " + PORT);
});
