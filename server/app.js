const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');
const morgan = require('morgan');

const User = require('./models/user.js');
const Links = require('./models/link.js');
const Sessions = require('./models/session.js');
const Click = require('./models/click.js');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //rs
app.use(express.static(path.join(__dirname, '../public'))); 

app.use(morgan('dev'));




app.get('/', 
(req, res) => {
  res.render('index');
});

app.get('/create', 
(req, res) => {
  res.render('index');
});

app.get('/links', 
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', 
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/


app.get('/login', function(req, res) {
  res.render('login');
});




app.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.lookupUser(username)
    .then(function(user) {
      if (user === undefined) {
        // throw new Error('Error on create: ' + user.username + ' user has account');
        return User.createNewUser(username, password);
      }
    })
    .then(function(user) {
      console.log('about to call assignSession, user: ', user);//, ' hash: ', req.session.hash);

      return Sessions.assignSession(user, req.session.hash); //what are the inputos here?
    })
    .then(function() {
      res.redirect('/');
    })
    .error(function(error) {
      console.log('error on post to sign up');
    })
    .catch(function() {
      res.redirect('/signup');
    });
});



app.get('/testgetuser', (req, res, next) => {
  console.log('testgetuser get received');
  User.lookupUser(req, res, next);

});




/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});


// app.get('/*', function(req, res, next) {
//   var code = req.params[0];
//   var link;
//   return Links.getOne({ type: 'code', data: code })
//   .then(function(result) {
//     link = result;
//     if (!link) {
//       throw new Error('Link does not exist');
//     }
//     return Click.addClick(link.id);
//   })
//   .then(function() {
//     return Links.incrementVisit(link);
//   })
//   .then(function() {
//     res.redirect(link.url);
//   })
//   .error(function(error) {
//     next({ status: 500, error: error });
//   })
//   .catch(function(err) {
//     res.redirect('/');
//   });
// });


module.exports = app;
