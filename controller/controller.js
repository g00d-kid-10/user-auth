const jwt = require('jsonwebtoken')
const { User } = require("../models");

//Error Handler
const errorHandler = (err) => {
  let errResponse = { firstname: '', lastname: '', username: '', email: '', password: '' };
  if(err.message == "Log Credential null") {
    errResponse.email = "Please Enter an Email Address";
    errResponse.password = "Please Enter the Password";
  }
  if(err.message == "Email null") {
    errResponse.email = "Please Enter an Email Address";
  }
  if(err.message == "Password null") {
    errResponse.password = "Please Enter the Password";
  }
  if(err.message == "Not registered") {
    errResponse.email = "Email is not registered";
  }
  if(err.message == "Unauthorized") {
    errResponse.password = "Password is incorrect.";
  }
  if(err.message.includes('Validation error')) {
    Object.values(err.errors).forEach(errorItem => {
      errResponse[errorItem.path] = errorItem.message;
    })
  }
  return errResponse;
}

//JSON Web Token Creator
const createToken = (cred) => {
  return jwt.sign({cred}, 'secret', {expiresIn: maxAge});
}

//Homepage Service
exports.home = (req, res) => {
  res.render("index");
};

//Authenticated Content Service
exports.classified_page = (req, res) => {
  res.render("classified_page");
};

//Signup Page Service
exports.signup_page = (req, res) => {
  res.render("signup_page");
};

//Login Page Service
exports.login_page = (req, res) => {
  res.render("login_page");
};

// Number of Seconds in 1 Day
const maxAge = 1*24*60*60;

//Signup Call to Action
exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const token = createToken(user.id);
    res.cookie('user_token', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({id : user.id});
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({errors});
  }
};

//Login Call to Action
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.isAuthorised(email, password);
    console.log(user.id);
    const token = createToken(user);
    res.cookie('user_token', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.json({id : user.id})
  } catch (err) {
    const errors = errorHandler(err);
    res.json({errors});
  }
};  

//Logout call to Action
exports.logout = (req, res) => {
  res.cookie('user_token', '', {maxAge: 1});
  res.redirect('/');
}