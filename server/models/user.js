const utils = require('../lib/hashUtils');

const crypto = require('crypto');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'), { multiArgs: true });
const Model = require('./model');
const db = require('../db/index.js');



class User extends Model {
  constructor() {
    super();
  }



  createNewUser (username, password) {
    console.log('createUser ........................usern and pass: ', username, password);

    var timestamp = new Date();
    var salt = utils.createSalt(timestamp);
    password = password + 'n';//utils.createHash(password, salt);
    var query = `insert into users (username, password, salt) values
      ("${username}", "${password}", "${salt}")

    `;
    // console.log('about to query:, username: ', username, ' password: ', password);
    // console.log('prequery timestap: ', timestamp, 'salt: ', salt); //' salt: ', salt);
    return db.queryAsync(query).then(function(results) {
      console.log('usercreated: ', username);
      return {
        id: results[0].insertId,
        username: username
      };
    })
    .catch(function(err) {
      console.log('err: ', err);
    });
  }

  lookupUser(username) {
    // console.log('lookupUser username = ', username);
    var query = `SELECT * FROM users where username = "${username}"`;
    return db.queryAsync(query).then(function(results) {
      // console.log('hre is results in lookUpUser for username ', username, ' :', results);
      return results[0][0];
    });
  }
}

module.exports = new User();

///////////////////////////////////////////////////////
//////////////////

// var db = require('../db');
// var utils = require('../lib/utility');

// // Write you user database model methods here
// var findOne = function(username) {
//   var queryString = 'SELECT * FROM users WHERE username = ?';

//   return db.queryAsync(queryString, username).then(function(results) {
//     return results[0][0];
//   });
// };

// var createOne = function(user) {
  // var timestamp = Date.now();
  // var salt = utils.createSalt(timestamp);

  // var newUser = {
  //   username: username,
  //   password: utils.createHash(password, salt),
  //   salt: salt
  // };

  // var queryString = 'INSERT INTO users SET ?';
  // return db.queryAsync(queryString, newUser).then(function(results) {
  //   return {
  //     id: results[0].insertId,
  //     username: newUser.username
  //   };
  // });
// };

// module.exports = {
//   findOne: findOne,
//   createOne: createOne
// };




