const Joi = require('joi');
const express = require("express");
const validateSchema  = require("../middleware/validateSchema.js");
const { checkAuthenctication, isBuyer } = require('../middleware/checkauthentication.js');
const { review_product } = require('../controller/review.js');
const router = express.Router();



router.post("/",checkAuthenctication,isBuyer,review_product);

module.exports = router;