const BackendController = require('../Controller/Backend');
const express = require('express');
const Router = express.Router();

Router.post('/addNewBackend', BackendController.addNewBackend);
Router.post('/getAllUserBackends', BackendController.getAllUserBackends);
Router.post('/getLastUserBackend', BackendController.getLastUserBackend);

module.exports = Router;

