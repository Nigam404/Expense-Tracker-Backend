const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  userId:Sequelize.INTEGER
});

module.exports = Forgotpassword;
