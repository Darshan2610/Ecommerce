const express = require("express");
require('colors')
const products = require("./data/products");
const dotenv = require("dotenv");
const connectDb = require("./config/config");
const productRoutes = require('./routes/ProductsRoute')
const {errorHandler} = require('./middlewares/errorMiddleware')
const userRoutes = require('./routes/UserRoute')
const orderRoutes = require('./routes/orderRoute')




const app = express();
app.use(express.json())


dotenv.config();
connectDb();

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.use("/api", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
} );

app.use(errorHandler)
const PORT = 8080;

app.listen(process.env.PORT || PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.blue.inverse
  );
});
