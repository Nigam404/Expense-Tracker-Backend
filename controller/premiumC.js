const User = require("../models/userM");
const AWS = require("aws-sdk");
const dotenv = require("dotenv").config();
const sequelize = require("../utils/database");
const Expense = require("../models/expenseM");
const Reporturl = require("../models/reporturlM");
const { resolve } = require("path");
exports.getLeaderBoardData = async (req, res, next) => {
  try {
    //METHOD-1 USING SEQUELIZE JOIN....
    // //getting data by joining users and expenses table using sequelize ORM.
    // const userWithTotalExpenses = await User.findAll({
    //   attributes: [
    //     "id",
    //     "name",
    //     [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
    //   ],
    //   include: [{ model: Expense, attributes: [] }],
    //   group: ["user.id"],
    //   order: [["total_cost", "DESC"]],
    // });
    // res.json(userWithTotalExpenses);

    //METHOD-2 FROM USER TABLE'S TOTALEXPENSE DATA.
    const userInfo = await User.findAll({
      attributes: ["name", "totalexpense"],
      order: [["totalexpense", "DESC"]],
    });
    res.json(userInfo);
  } catch (error) {
    //catch block
    console.log(error);
  }
};

//function to upload data to aws s3.
async function uploadToS3(data, fName) {
  try {
    //initializing s3 bucket.
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET_KEY,
    });

    //declaring parameters and uploading report file to s3 bucket.
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fName,
      Body: data,
      ACL: "public-read", //Access control level-making our file accessable by all.
    };

    //to make s3bucket.uploas async we have to make use of promises.
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, response) => {
        if (err) {
          console.log("Something Went Wrong", err);
          reject(err);
        } else {
          console.log("success", response);
          resolve(response.Location); //returning the file path.
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

exports.downloadReport = async (req, res, next) => {
  try {
    //getting expenses of requesting user.
    const expenses = await req.user.getExpenses();

    const fileData = JSON.stringify(expenses);

    //we should give unique filename otherwise the same named file get overridden by new files.
    const filename = `ExpenseReport_${req.user.name}_ ${new Date()}.txt`;

    //calling function that upload file to s3.( take filedata and file name and upload it to s3 and return the file link)
    const fileURL = await uploadToS3(fileData, filename);
    console.log("URLL->", fileURL);

    //saving file to reporturl table
    await Reporturl.create({ url: fileURL, userId: req.user.id });

    res.status(200).json({ fileURL: fileURL, success: true }); //sending URL link to frontend.
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, err: error });
  }
};

exports.getOldLinks = async (req, res, next) => {
  try {
    const reporturl = await Reporturl.findAll({
      where: { userId: req.user.id },
    });
    // console.log(reporturl);
    res.json(reporturl);
  } catch (error) {
    console.log(error);
  }
};
