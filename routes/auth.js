const express = require("express");
const authRouter = express.Router();

const { memoryMulter } = require("../constants/multer");

const {
  login,
  logout,
  register,
  createAccessToken,
} = require("../controllers/auth");

authRouter.post("/register", memoryMulter.single("image"), register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/token", createAccessToken);

module.exports = authRouter;
