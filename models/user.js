const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: Boolean,
  totalExpense: Number,
});

module.exports = mongoose.model("User", userSchema);

// const sequelize = require("../utils/database");
// const Sequelize = require("sequelize");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   userName: Sequelize.STRING,
//   email: Sequelize.STRING,
//   password: Sequelize.STRING,
//   isPremium: Sequelize.BOOLEAN,
//   totalExpense: Sequelize.DOUBLE,
// });

// module.exports = User;
