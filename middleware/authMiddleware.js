const jwt = require("jsonwebtoken");
const { User } = require('../models');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.user_token;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        res.redirect("/login");
      } else {
        console.log("decodedToken", decodedToken);
        console.log("decodedTokencred", decodedToken.cred);
        console.log("decodedTokencredid", decodedToken.cred.id);
        const current = await User.findOne({where : {id : decodedToken.cred}});
        res.locals.user = current;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.redirect("/login");
  }
};
