const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const Order = require("../models/orderM");
const sequelize = require("../utils/database");

dotenv.config();

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 30000;

    //..
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      } else {
        try {
          await req.user.createOrder({ orderid: order.id, status: "PENDING" });
          res.status(201).json({ order, key_id: rzp.key_id });
        } catch (error) {
          console.log(error);
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "something went wrong!!!", error: error });
  }
};

//...................................................................................................

exports.updateTransactionStatusSuccess = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { orderid: req.body.order_id },
    });

    const promise1 = order.update(
      {
        paymentid: req.body.payment_id,
        status: "SUCCESSFUL",
      },
      { transaction: t }
    );
    const promise2 = req.user.update(
      { ispremiumuser: true },
      { transaction: t }
    );

    //parallaly running both promises.
    Promise.all([promise1, promise2]).then(async () => {
      await t.commit();
      res
        .status(202)
        .json({ success: true, message: "Transaction Successful" });
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

exports.updateTransactionStatusFailed = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { orderid: req.body.order_id },
    });
    await order.update({ status: "FAILED" }, { transaction: t });
    await t.commit();
    res.json({ message: "status updated to failed" });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};
