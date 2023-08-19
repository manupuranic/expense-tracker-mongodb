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
