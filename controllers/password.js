const SibApiV3Sdk = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const ForgotPasswordRequests = require("../models/forgotPasswordRequests");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");

exports.postForgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: "manupuranic@gmail.com",
    name: "Expense-Tracker",
  };
  const receivers = [
    {
      email: email,
    },
  ];
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const result = await ForgotPasswordRequests.create({
        isActive: true,
        user: {
          userId: user,
        },
      });
      console.log(result);
      const resetUrl = `http://localhost:3000/password/resetpassword/${result._id}`;
      const response = await transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Forgot Password",
        textContent: `Click on the below link to Reset your password
          ${resetUrl}
          `,
      });
      console.log(response);
      res.json({
        message: "Mail Has been sent",
      });
    } else {
      throw new Error("User not found!!");
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
};

exports.getResetPassword = async (req, res, next) => {
  const requestId = req.params.id;
  const form = `<html>
                    <script>
                        function formsubmitted(e){
                            e.preventDefault();
                            console.log('called')
                        }
                    </script>

                    <form action="/password/updatepassword/${requestId}" method="GET">
                        <label for="newpassword">Enter New password:</label>
                        <input name="newpassword" type="password" required></input>
                        <button>Reset password</button>
                    </form>
                </html>`;
  const inactive = `<html>
                        <p>Link Expired!!</p>
  </html>`;
  try {
    const receipt = await ForgotPasswordRequests.findById(requestId);
    if (receipt) {
      if (receipt.isActive) {
        // send the reset form
        await ForgotPasswordRequests.updateOne(
          { _id: requestId },
          {
            isActive: false,
          }
        );
        return res.status(200).send(form);
      } else {
        //send the inactive form
        return res.status(403).send(inactive);
      }
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const receiptId = req.params.id;
  const { newpassword } = req.query;
  const success = `<html>
                      <p>Password Updated</p>
                  </html>`;
  try {
    const receipt = await ForgotPasswordRequests.findById(receiptId);
    bcrypt.hash(newpassword, 10, async (err, hash) => {
      console.log(hash);
      await User.updateOne(
        { _id: receipt.user.userId },
        {
          password: hash,
        }
      );
      res.send(success);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
