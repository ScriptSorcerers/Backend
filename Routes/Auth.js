const AuthController = require("../Controller/Auth") ;
const express = require("express");
const Router = express.Router();

Router.post("/login", AuthController.login);
Router.post("/signup", AuthController.signup);

module.exports = Router;