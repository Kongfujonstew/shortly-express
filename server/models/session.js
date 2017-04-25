const utils = require('../lib/hashUtils');
const Model = require('./model');

// Write your session database model methods here

// class Session extends Model {
//   constructor () {
//     super();
//   }

//   checkSessionValid (sessionId, callback) {
//     query = `select * from sessions where session = "${sessionId}"`;
//     return db.query(query,)

//   }


//   createNewSession () {

//   }


//   beginSession () {

//   }


//   endSession () {

//   }

// }



var db = require('../db');


var assignSession = function(user, sessionHash) {
  console.log('2 place __________________');
  var queryString = 'UPDATE sessions SET user_id = ? WHERE hash = ?';
  return db.queryAsync(queryString, [user.id, sessionHash]).return(user);
};



module.exports = {

  assignSession: assignSession,
};