const express = require('express');
const route = express.Router();
const createUser = require('../controllers/registerController')

route.post('/', createUser)

module.exports = route