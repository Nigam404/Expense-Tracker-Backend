const Expense = require("../models/expenseM");
const sequelize = require("../utils/database");
//getting expense controller...............................................................................
module.exports.getExpense = async (req, res, next) => {
  try {
    //Method 1-normal sequelize method to find expenses.
    const expenses = await Expense.findAll({ where: { userId: req.user.id } }); //getting expenses added by authenticated user.

    //Method 2-Sequelize association method to find expenses.
    // const expenses = req.user.getExpense();
    console.log("USER ID-", req.user.id);

    if (expenses.length > 0) {
      res.json(expenses);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
};

//post or adding expense controller........................................................................
module.exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //req.body is the object pass by axios from front-end.
    const savedData = await Expense.create(
      {
        amount: req.body.amount,
        description: req.body.description,
        catagory: req.body.catagory,
        userId: req.user.id, //req.user carry the user info that passed from authentication middleware.
      },
      { transaction: t }
    );
    await t.commit();
    console.log("data saved in DB", savedData.dataValues);
    res.json(savedData.dataValues);
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

//delete controller......................................................................................
module.exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.expId;
    const expense = await Expense.findByPk(id);
    res.json(expense);
    await expense.destroy({ transaction: t });
    await t.commit();
    console.log("Expense info removed from DB");
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};
