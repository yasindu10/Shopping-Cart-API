const express = require("express");
const productRoute = express.Router();

const {
  getProducts,
  getSingleProduct,
  createProduct,
  likeProduct,
  addReview,
  addToCart,
  buyProduct,
  successPayment,
} = require("../controllers/product");

const authorization = require("../middlewares/authorization");
const { memoryMulter } = require("../constants/multer");

productRoute
  .route("/")
  .get(getProducts)
  .post(authorization, memoryMulter.single("image"), createProduct);

productRoute.patch("/like/:proId", likeProduct);

productRoute.get("/id/:proId", getSingleProduct);
productRoute.patch("/review/:proId", addReview);
productRoute.patch("/cart/:proId", addToCart);
productRoute.get("/buy/:proId", buyProduct);

productRoute.get("/payment/success", successPayment);
productRoute.get("/payment/cancel", buyProduct);

module.exports = productRoute;
