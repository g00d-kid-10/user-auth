const jwt = require("jsonwebtoken");
const { User } = require('../models');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.user_token;
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

exports.checkUser = (req, res, next) => {
  const token = req.cookies.user_token;
  if(token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if(err) {
        res.locals.user = null;
        next()
      } else {
        const current = await User.findOne({where: {id: decodedToken.cred.id}})
        // console.log("@@", decodedToken);
        console.log("$", current.username);
        res.locals.user = current;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}

// module.exports = { requireAuth, checkUser };
