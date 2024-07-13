const express = require("express");
const {getProduct,getProducts} = require('../controllers/productsController')

const router = express.Router();

router.route(
  "/products").get(getProducts)

//single products route
router.route(
  "/products/:id").get(getProduct)

module.exports = router;
