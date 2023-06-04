const UserController = require('../Controller/User');
const {verifyLogin, isLoggedIn} = require("../Middlewares")
const express = require("express");
const Router = express.Router();

Router.get("/user/profile",verifyLogin,UserController.getOwnProfile);
Router.put("/user/profile",verifyLogin,UserController.editProfile);
Router.delete("/user/profile",verifyLogin,UserController.deleteProfile);
Router.put("/user/profile/password",verifyLogin,UserController.changePassword);
Router.get("/user/all",isLoggedIn,UserController.getAllUsers);
Router.post("/user/forgot-password",UserController.forgotPassword);
Router.post("/user/reset-password",UserController.resetPassword);


module.exports = Router;