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
    var timestamp = new Date();
    var salt = utils.createSalt(timestamp);
    password = password + 'n';//utils.createHash(password, salt);
    var query = `insert into users (username, password, salt) values
      ("${username}", "${password}", "${salt}")

    `;
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
    var query = `SELECT * FROM users where username = "${username}"`;
    return db.queryAsync(query).then(function(results) {
      // console.log('hre is results in lookUpUser for username ', username, ' :', results);
      return results[0][0];
    });
  }
}

module.exports = new User();


