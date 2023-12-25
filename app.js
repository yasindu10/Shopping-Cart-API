require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDb = require("./db/connectDb");
const firebaseApp = require("firebase/app");
const errorHandeller = require("./middlewares/error-handeller");
const cookie = require("cookie-parser");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");

// routers
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

firebaseApp.initializeApp(require("./firebase/config"));

app.use("/api/v1/auth", authRoute);
app.use(require("./middlewares/authorization"));
app.use("/api/v1/product", productRoute);
app.post("/api/v1/contact", require("./controllers/contact"));

// error handeller
app.use(errorHandeller);

const port = process.env.PORT || 8080;
const start = async () => {
  await connectDb(process.env.MONGO_URL);

  app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
  });
};
start();
