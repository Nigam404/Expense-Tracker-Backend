const Sib = require("sib-api-v3-sdk"); //used for sending reset password mail.
const dotenv = require("dotenv").config();
const UUID = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/userM");
const Forgotpassword = require("../models/forgotPasswordM");
//...................................................................................................
exports.forgotPassword = async (req, res, next) => {
  try {
    //getting the user inputed mail id from req object.
    const userEmail = req.body.mail;
    console.log(userEmail);
    //checking the email exist in the DB or not.
    const user = await User.findAll({ where: { mail: userEmail } });
    console.log(user.length);
    //if user found.
    if (user.length > 0) {
      //creating uuid and saving in forgotpassword table with requesting user's id and marking status active.
      const uuid = UUID.v4();
      console.log(uuid);

      await Forgotpassword.create({
        id: uuid,
        active: true,
        userId: user[0].id,
      });

      //setting the SIB environment for sending mail...
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SIB_API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "nigamkalpataru@gmail.com",
        name: "Nigam",
      };

      const receiver = [
        {
          email: userEmail,
        },
      ];

      await tranEmailApi.sendTransacEmail({
        sender,
        to: receiver,
        subject: "Reset password for Expense Tracker app",
        htmlContent: `<p>Please click the button to reset your password of Expense Tracker App</p></br>
           <button> 
           <a href="http://localhost:3000/password/resetpassword/${uuid}">Reset Password</a> 
           </button>`,
        //sending a link along with uuid in mail which invoke the get method '/password/resetpassword/:uuid'
      });

      console.log("Mail sent successfully!!!");
      res.send("Mail sent successfully..please check your inbox!!!");
    } else {
      console.log("user not found");
    }
  } catch (error) {
    console.log(error);
  }
};

//................................................................................................
exports.resetPassword = async (req, res, next) => {
  //getting uuid from route
  const uuid = req.params.UUID;
  console.log("inside reset password fun", uuid);

  //checking if the uuid exist or not
  const forgotpw = await Forgotpassword.findOne({ where: { id: uuid } });
  console.log("pw ele->", forgotpw);

  //if uuid exist then marking its active status as false
  if (forgotpw) {
    forgotpw.update({ active: false });
  }

  //sending new password set page...
  res.status(200).send(`<html>
  <head>
    <title>Reset password</title>
  </head>
  <body>
  <form action="/password/update/${uuid}"  method="get">
      Enter New password:
      <input type="password" name="password" required></input>
      <button type="submit">reset password</button>
  </form>
  </body>
</html>`);
};

//................................................................................................
exports.updatePassword = async (req, res, next) => {
  console.log("update password called!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const uuid = req.params.UUID;
  const newPw = req.query.password;

  //getting the forgotpw table row with passed UUID
  const forgotpw = await Forgotpassword.findAll({ where: { id: uuid } });

  //finding user id associated with the uuid.
  const userId = forgotpw[0].userId;
  console.log(userId);

  //finding the user in user table.
  const user = await User.findByPk(userId);
  console.log(user);

  //setting the new password as hash in the found user.
  const saltRound = 12;
  bcrypt.hash(newPw, saltRound, async (err, hash) => {
    if (!err) {
      await user.update({
        password: hash,
      });
      res.status(200).send("Successfully updated password!!!");
    } else {
      console.log(err);
    }
  });
};
