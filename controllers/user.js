const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateWebToken = (id, isPremium) => {
  return jwt.sign({ userId: id, isPremium: isPremium }, process.env.JWT_SECRET);
};

exports.postSignUpUser = async (req, res, next) => {
  // const t = await sequelize.transaction();
  const { userName, email, password } = req.body;
  try {
    const user = await User.find({ email: email });
    if (user.length !== 0) {
      res.json({
        message: "User already exists!",
      });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        const result = await User.create({
          userName: userName,
          email: email,
          password: hash,
          isPremium: false,
          totalExpense: 0,
        });
        console.log(result);
        res.json(result);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLoginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      const result = await bcrypt.compare(password, user.password);
      if (result === true) {
        res.json({
          message: "User logged in Successfully",
          success: true,
          token: generateWebToken(user._id, user.isPremium),
        });
      } else {
        res.status(401).json({
          message: "Password do not match",
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getUser = async (req, res, next) => {
  return res.json(req.user);
};
