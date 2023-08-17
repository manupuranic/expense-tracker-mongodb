const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = model("Expense", expenseSchema);

// const sequelize = require("../utils/database");
// const Sequelize = require("sequelize");

// const Expense = sequelize.define("expense", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   amount: Sequelize.DOUBLE,
//   desc: Sequelize.STRING,
//   category: Sequelize.STRING,
// });

// module.exports = Expense;
