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

  createNewUser (req, res) {
    console.log('username: ', req.body.username, ' password: ', req.body.password);
    var query = `INSERT INTO users (username, password) values ('${req.body.username}', '${req.body.password}')`;
    db.queryAsync(query, function(err, result) {
      if (err) {
        console.log('db error: ', err);
      } else {
        console.log('ok its in the db');
      }
    });  
  }

  chasm() {
    console.log('pgsfly');
  }
}

module.exports = new User();
