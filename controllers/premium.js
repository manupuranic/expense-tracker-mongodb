const User = require("../models/user");

exports.getLeaderboards = async (req, res, next) => {
  const leaderboard = await User.find()
    .select("userName totalExpense")
    .sort({ totalExpense: -1 });
  res.json(leaderboard);
};
