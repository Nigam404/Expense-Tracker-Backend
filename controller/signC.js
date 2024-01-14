const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();
const User = require("../models/userM");

//Controller functions........................................................................................
exports.signUp = async (req, res, next) => {
  //checking if user is already registered.
  let existingUser = await User.findAll({ where: { mail: req.body.mail } });
  //if user already registered.
  if (existingUser.length > 0) {
    res.json({ remark: "User Already Exist" });
  }
  //if user not registered.
  else {
    let plainTextPassword = req.body.password;
    let saltRound = 12;
    //generating hash for password.
    bcrypt.hash(plainTextPassword, saltRound, async (err, hash) => {
      const response = await User.create({
        name: req.body.name,
        mail: req.body.mail,
        password: hash, //storing hash as password in db.
      });
      res.status(201).json(response.dataValues);
    });
  }
};

//Token generate function.........................................
function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name }, //property for which we want to generate token.
    process.env.JWT_SECRET_KEY //secret key
  );
}

//.....................................................................................
exports.login = async (req, res, next) => {
  //finding the user with entered mail.
  const response = await User.findAll({
    where: {
      mail: req.body.mail,
    },
  });

  //if user found with entered mail id.
  if (response.length > 0) {
    //checking password from db and entered password are same or not.
    //Note- bcrypt.compare take plaintext password as 1st parameter and hash as second parameter
    // and a callback as 3rd parameter.
    bcrypt.compare(req.body.password, response[0].password, (err, result) => {
      if (err) {
        res.status(500).send("Something Went Wrong");
      }
      if (result === true) {
        res.status(200).json({
          message: "Login Successful!!!",
          token: generateAccessToken(response[0].id, response[0].name), //sending token along with success msg.
        });
      } else {
        res.status(401).send("User Not Authorized!");
      }
    });
  }
  //if user not found.
  else {
    res.status(404).send("User Not Found!");
  }
};
