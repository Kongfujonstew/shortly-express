const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/


module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports.createSession = (req, res, next) => {
  console.log('verfiy session called');

  let agent = req.get('User-Agent');

  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
      if (!models.Sessions.compare(agent, session.hash, session.salt)) {
        return models.Sessions.delete({ hash: session.hash }).throw(agent);
      }
    })
    .catch(() => {
      return models.Sessions.create({ agent })
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};




// var Sessions = require('../models/session');
// var Promise = require('bluebird');
// var util = require('../lib/utility');

// var createSession = function(req, res, next) {
//   var agent = req.get('User-Agent') || util.createSalt();

//   Promise.resolve(req.cookies.shortlyid)
//     .then(function(token) {
//       if (!token) {
//         throw token;
//       }
//       return Sessions.getSession(req.cookies.shortlyid);
//     })
//     .then(function(session) {
//       if (!session) {
//         throw session;
//       }
//       // verify token; if invalid, throw to re-initialize it
//       if (!util.compareHash(agent, session.hash, session.salt)) {
//         return Sessions.destroySession(session.hash)
//           .then(function() {
//             throw agent;
//           });
//       }
//       return session;
//     })
//     .catch(function() {
//       return Sessions.initialize(agent)
//         .then(function(session) {
//           res.cookie('shortlyid', session.hash);
//           return session;
//         });
//     })
//     .then(function(session) {
//       req.session = session;
//       next();
//     });
// };

// module.exports = createSession;