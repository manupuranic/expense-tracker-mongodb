const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

// Import Routers
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

// Initializing Server
const app = express();

// cors and bodyParser middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.use("/purchase", purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);

// serving static/frontend files (html, js, css || frontend)
app.use(express.static(path.join(__dirname, `public`)));

// establishing connection with mongodb with mongoose
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
  }
};

// establishing connection and starting server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`server listening on port 3000:`);
  });
});
