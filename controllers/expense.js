const Expense = require("../models/expense");
const FileDownloads = require("../models/fileDownloads");
const AWS = require("aws-sdk");

exports.addExpense = async (req, res, next) => {
  let { amount, desc, category } = req.body;
  req.user.totalExpense = parseInt(req.user.totalExpense) + parseInt(amount);
  try {
    const [expense] = await Promise.all([
      await Expense.create({
        amount: amount,
        desc: desc,
        category: category,
        user: {
          userId: req.user,
        },
      }),
      await req.user.save(),
    ]);
    return res.json(expense);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getExpenses = async (req, res, next) => {
  let page = req.params.id;
  page = +page;
  const ITEMS_PER_PAGE = +req.query.perPage;
  try {
    // get the count of documents of specified user
    const totalItems = await Expense.countDocuments({
      "user.userId": req.user,
    });
    const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const expenses = await Expense.find({ "user.userId": req.user })
      .select("_id amount desc category")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    return res.json({
      expenses: expenses,
      currentPage: page,
      isNextPage: page !== lastPage,
      isPreviousPage: page !== 1,
      previousPage: page - 1,
      nextPage: page + 1,
      lastPage: lastPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findById(id);
    req.user.totalExpense =
      parseInt(req.user.totalExpense) - parseInt(expense.amount);
    // deleteOne: prototype method to delete this of the expense
    Promise.all([await req.user.save(), await expense.deleteOne()]);
    res.json({
      message: "Expense deleted",
    });
  } catch (err) {
    res.status(404).json({
      message: "Expense not found, try again",
    });
  }
};

const uploadToS3 = (data, file) => {
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((res, rej) => {
    s3Bucket.upload(params, (err, response) => {
      if (err) {
        console.log("Something went wrong", err);
        rej(err);
      } else {
        res(response.Location);
      }
    });
  });
};

exports.downloadExpenses = async (req, res, next) => {
  try {
    if (req.user.isPremium) {
      try {
        const expenses = await Expense.find({ "user.userId": req.user });
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user._id;
        const fileName = `Expense-${userId}/${new Date()}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName);
        const date = new Date().toISOString().slice(0, 10);
        await FileDownloads.create({
          fileUrl: fileUrl,
          date: date,
          user: {
            userId: req.user,
          },
        });
        return res.status(201).json({
          fileUrl,
          success: true,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          fileUrl: "",
          success: false,
          error: err,
        });
      }
    } else {
      throw new Error("Unauthorized User");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: err,
    });
  }
};

exports.getFileDownloads = async (req, res, next) => {
  try {
    const files = await FileDownloads.find({ "user.userId": req.user }).select(
      "fileUrl date"
    );
    return res.status(200).json({
      files: files,
    });
  } catch (err) {
    console.log(err);
  }
};
