const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

module.exports = {
  verifyJWT: function (req, res, next) {
    if (req.user) {
      // verifies secret and checks exp
      jwt.verify(req.user.token, 'secrethhhhh', function (err, decoded) {
        if (err) { //failed verification.
          res.redirect('/');
        }
        if(decoded){
          req.decoded = decoded;
          next(); //no error, proceed
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  },
  unVerifyJWT: function (req, res, next) {
    if (req.user) {
      // verifies secret and checks exp
      jwt.verify(req.user.token, 'secrethhhhh', function (err, decoded) {
        if (err) { //failed verification.
          next();
        }
        if(decoded){
          req.decoded = decoded;
          res.redirect('/dashboard');
        } else {
          next();
        }
      });
    } else {
      next();
    }
  }
}
// module.exports = {
//   ensureAuthenticated: function (req, res, next) {
//     if (exjwt({secret: 'secrethhhh'})){
//       return next();
//     } else {
//       res.redirect('/login');
//     }
//   },
//   ensureGuest: function (req, res, next) {
//     if (exjwt({secret: 'secrethhhh'})){
//       res.redirect('/dashboard');
//     } else {
//       return next();
//     }
//   }
// }