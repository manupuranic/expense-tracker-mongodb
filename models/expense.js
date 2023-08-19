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
