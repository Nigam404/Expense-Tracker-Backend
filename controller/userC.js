const sequelize = require("../utils/database");
const User = require("../models/userM");

exports.getUser = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  res.json(user);
};

exports.updateTotalExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.user.id;
    const amount = Number(req.body.amount); //because req.body.amount is coming as a string
    const user = await User.findByPk(id);

    console.log("type check->", typeof amount, typeof user.totalexpense);

    if (!user.totalexpense) {
      await user.update({ totalexpense: amount }, { transaction: t });
      await t.commit();
    } else {
      const newTotal = user.totalexpense + amount;
      await user.update({ totalexpense: newTotal }, { transaction: t });
      await t.commit();
    }
    res.json({ message: "Total expense updated(added)" });
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

exports.subtractTotalExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.user.id;
    const amount = Number(req.body.amount); //because req.body.amount is coming as a string
    const user = await User.findByPk(id);
    await user.update(
      { totalexpense: user.totalexpense - amount },
      { transaction: t }
    );
    await t.commit();
    res.json({ message: "Total expense reduced" });
  } catch (error) {
    await t.rollback();
  }
};
