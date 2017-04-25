
// var Promise = require('bluebird');
// var request = Promise.promisify(require('request'), { multiArgs: true });

const crypto = require('crypto');

/************************************************************/
// Add any hashing utility functions below
/************************************************************/


// exports.getUrlTitle = function(url) {
//   return request(url).then(function(response, html) {
//     var tag = /<title>(.*)<\/title>/;
//     var match = response[0].body.match(tag);
//     var title = match ? match[1] : url;
//     return title;
//   });
// };

// var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

// exports.isValidUrl = function(url) {
//   return url.match(rValidUrl);
// };

exports.createHash = function(password, salt) {
  console.log('createHash called, password: ', password, '   salt: ', salt);
  var shasum = crypto.createHash('sha1');
  shasum.update(password + salt);
  console.log('createHash return: ', shasum.digest('hex'));
  return shasum.digest('hex');
};

// exports.compareHash = function(attempted, stored, salt) {
//   var attempt = this.createHash(attempted, salt);
//   return stored === attempt;
// };



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