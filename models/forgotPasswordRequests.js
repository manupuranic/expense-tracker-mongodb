const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPasswordRequestsSchema = new Schema({
  isActive: Boolean,
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = mongoose.model(
  "ForgotPasswordRequests",
  forgotPasswordRequestsSchema
);

// const sequelize = require("../utils/database");
// const Sequelize = require("sequelize");

// const ForgotPasswordRequests = sequelize.define("forgotPasswordRequests", {
//   id: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true,
//   },
//   isActive: Sequelize.BOOLEAN,
// });

// module.exports = ForgotPasswordRequests;
