const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Fileurl = sequelize.define("fileurl", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  url: Sequelize.STRING,
  userId: Sequelize.INTEGER,
});

module.exports = Fileurl;
