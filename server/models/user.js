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



  createNewUser (req, res, hash, callback) {
    console.log('in create user, username: ', req.body.username, ' password: ', req.body.password);
    var query = `INSERT INTO users (username, password) values ('${req.body.username}', '${hash + req.body.password}')`;
    return db.queryAsync(query, function(err, result) {
      if (err) {
        console.log('db error: ', err);
      } else {
        console.log('ok its in the db');
        callback(result);
      }
    });  
  }

  lookupUser(req, res, callback) {
    var query = `SELECT * FROM users`;
    return db.queryAsync(query, function(err, result) {
      if (err) {
        console.log('db lookupUser err: ', err);
      } else {
        console.log('user retreive success');
        res.send(result[0]);
        // callback(result[0]);
      }
    });
    console.log('pgsfly');
  }
}

module.exports = new User();
