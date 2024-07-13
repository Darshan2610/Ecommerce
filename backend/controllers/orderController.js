const asyncHandler = require("express-async-handler");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");


const addOrderItem = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Found");
    return;
  } else {
    const user = await User.findById(req.user._id).select("name email");

    const order = new Order({
      orderItems,
      user: req.user._id,
      name: user.name,
      email: user.email,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });


    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});



const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});


const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
  


    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } if (order) {
        order.isDelivered = true;
        order.deliverAt = Date.now();
        order.deliverResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
    };
        const updateOrder = await order.save();
        res.status(200).json(updateOrder);
    
  }
  else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (isAdmin) {
    const orders = await Order.find({}).populate("user", "name email");
    res.status(200).json(orders);
  } else {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  }
});



module.exports = { addOrderItem, getOrderById, updateOrderToPaid, getMyOrders };
