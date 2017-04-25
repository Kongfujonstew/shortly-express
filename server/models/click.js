const Model = require('./model');

module.exports = new Model('clicks');


// var db = require('../db');

// var addClick = function(linkId) {
//   var queryString = 'INSERT INTO clicks SET ?';
//   return db.queryAsync(queryString, { linkId: linkId, timestamp: new Date }).return(linkId);
// };

// module.exports = {
//   addClick: addClick
// };