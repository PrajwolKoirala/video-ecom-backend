const express = require("express");
const { fetchProduct, store, update, remove, getproduct, createReview} = require("../controller/products");
const router = express.Router();
const jwt = require("jsonwebtoken")
const {checkAuthenctication,isSeller, isBuyer} = require("../middleware/checkauthentication")


router.get("/", fetchProduct);
router.get("/:id", getproduct);

router.post("/",checkAuthenctication,isSeller,store);
// router.post("/",checkAuthenctication,isSeller,storeWithoutImg);

router.put("/:id",checkAuthenctication,isSeller,update);
router.delete("/:id",checkAuthenctication,isSeller,remove);
router.post("/:id/reviews",checkAuthenctication,isBuyer,createReview)

module.exports = router;