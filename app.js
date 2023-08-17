const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const sequelize = require("./utils/database");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");
// const User = require("./models/user");
// const Expense = require("./models/expense");
// const Order = require("./models/order");
// const ForgotPasswordRequests = require("./models/forgotPasswordRequests");
// const FileDownloads = require("./models/fileDownloads");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.use("/purchase", purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);

app.use(express.static(path.join(__dirname, `public`)));

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgotPasswordRequests);
// ForgotPasswordRequests.belongsTo(User);

// User.hasMany(FileDownloads);
// FileDownloads.belongsTo(User);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("connected");
  app.listen(process.env.PORT);
});
