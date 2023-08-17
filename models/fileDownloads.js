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

// const sequelize = require("../utils/database");
// const Sequelize = require("sequelize");

// const FileDownloads = sequelize.define("fileDownloads", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   fileUrl: Sequelize.STRING,
//   date: Sequelize.DATE,
// });

// module.exports = FileDownloads;
