const Joi = require('joi');
const express = require("express");
const { store } = require("../controller/order.js");
const validateSchema  = require("../middleware/validateSchema.js");
const { checkAuthenctication, isBuyer } = require('../middleware/checkauthentication.js');
const router = express.Router();



router.post("/",checkAuthenctication,isBuyer,store);

module.exports = router;