const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.use("/purchase", purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);

app.use(express.static(path.join(__dirname, `public`)));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("listening for requests");
  });
});
