const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileDownloadsSchema = new Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  date: Date,
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = mongoose.model("FileDownloads", fileDownloadsSchema);
