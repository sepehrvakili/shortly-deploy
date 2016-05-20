var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.status(200).redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({url: uri}).exec()
    .then(function(link) {
      if (link) {
        link.save();
        res.status(200).send(link); 
      } else {
        util.getUrlTitle(uri, function(title) {
          var newLink = new Link({
            url: uri,
            title: title,
            visits: 0,
            baseUrl: req.headers.origin
          });
          newLink.save(function(err) {
            res.status(200).send(newLink);
          });
        });
      }
    })
    .catch(function(err) {
      console.log('Error reading URL heading: ', err);
      return res.sendStatus(404); 
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username }).exec()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(err, match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    })
    .catch(function(err) {
      console.error(err);
      return;
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save();
        util.createSession(req, res, newUser);
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
    .catch(function(err) {
      console.error(err);
      return;
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec()
    .then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        link.set({ visits: link.get('visits') + 1} ).save();
        res.redirect(link.get('url'));
      }
    })
    .catch(function(err) {
      console.error(err);
      return;
    });
};