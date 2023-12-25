const Product = require("../models/product");
const User = require("../models/user");

const Roles = require("../constants/role-controller");
const { ref, uploadBytes, getStorage } = require("firebase/storage");
const { v1: uuidv1 } = require("uuid");
const path = require("path");
const CustomError = require("../errors/custom-errors");
const paypal = require("paypal-rest-sdk");

const getProducts = async (req, res) => {
  const { category, tag, sort } = req.query;

  const queryObject = {};

  if (category) queryObject.category = category;

  if (tag) queryObject.tag = tag;

  let products = Product.find(queryObject);

  if (sort) {
    const sortOptions = ["price", "-price"];

    const sortItems = sort.split(",").map((item) => {
      if (sortOptions.includes(item)) return item;
    });

    products = products.sort(sortItems.join(" "));
  }

  const pages = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const finalProducts = await products.skip((pages - 1) * limit).limit(limit);

  res.status(200).json({ success: true, data: finalProducts });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.proId });
  res.status(200).json({ success: true, data: product });
};

const createProduct = async (req, res) => {
  if (Roles.buyer == req.user.role)
    throw new CustomError(`you can't store a product on this account`, 400);

  if (!req.file) throw new CustomError("no product image found", 404);

  const storagePath = ref(
    getStorage(),
    `products/${uuidv1()}${path.extname(req.file.originalname)}`
  );
  const uploadData = await uploadBytes(storagePath, req.file.buffer);

  const product = await Product.create({
    ...req.body,
    seller: req.user.userId,
    image: uploadData.ref.name,
  });

  res.status(200).json({ success: true, data: product });
};

const likeProduct = async (req, res) => {
  const user = req.user;

  await Product.findOneAndUpdate(
    { _id: req.params.proId },
    {
      $push: { likes: { _Uid: user.userId, email: user.email } },
    },
    { new: true }
  );

  res.status(200).json({ success: true, msg: "liked" });
};

const addReview = async (req, res) => {
  const doc = await Product.findOneAndUpdate(
    { _id: req.params.proId },
    {
      $push: { reviews: { ...req.body } },
    },
    { new: true }
  );

  res.status(200).json({ success: true, data: doc });
};

const addToCart = async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      $push: {
        cart: { proId: req.params.proId, itemCount: req.body.itemCount },
      },
    },
    { new: true }
  );

  res.status(200).json({ success: true, msg: "added to cart" });
};

const buyProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.proId });

  if (!product)
    throw new CustomError(`no product with id ${req.params.proId}`, 404);

  const { cart } = await User.findOne({ _id: req.user.userId });

  const cartProduct = cart.find((e) => e.proId == req.params.proId);

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:${process.env.PORT || 8080
        }/api/v1/product/payment/success`,
      cancel_url: `http://localhost:${process.env.PORT || 8080
        }/api/v1/product/payment/cancel`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: product.name,
              sku: "001",
              price: `${product.price}`,
              currency: "USD",
              quantity: cartProduct.itemCount,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: `${product.price * cartProduct.itemCount}`,
        },
        description: "A Product from yGroup Store",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.status(error.httpStatusCode).json({ error: error.message });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

const successPayment = async (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
    if (error) {
      res.status(payment.httpStatusCode).send(`<div style="display: flex;
                                justify-content: center;
                                align-items: center;
                      height: 100vh;">
                      <h1 style="text-align: center;">This is a centered heading</h1>
                    </div>`);
    } else {
      // enter the home page
      res.redirect("/");
    }
  });
};

module.exports = {
  getProducts,
  getSingleProduct,
  createProduct,
  likeProduct,
  addReview,
  addToCart,
  buyProduct,
  successPayment,
};
