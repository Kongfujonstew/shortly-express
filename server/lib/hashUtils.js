


const crypto = require('crypto');

/************************************************************/
// Add any hashing utility functions below
/************************************************************/




exports.createHash = function(password, salt) {
  console.log('createHash called, password: ', password, '   salt: ', salt);
  var shasum = crypto.createHash('sha1');
  shasum.update(password + salt);
  console.log('createHash return: ', shasum.digest('hex'));
  return shasum.digest('hex');
};




exports.createSalt = function(timestamp) {
  return crypto.randomBytes(20).toString('hex');
}


var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};