var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
  // hashPassword: function() {
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
// });

var userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String
},
  {
    timestamps: { createdAt: 'created_at' }
  }
);


// userSchema.post('save', function(attemptedPassword, callback) {
//   console.log('start user COMPARED');
//   console.log('PASSWERD', this.get('password'));
//   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//     callback(isMatch);
//   });
// });

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('start user COMPARED');
  console.log('PASSWERD', this.get('password'));
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

// post - save is giving us issues with saving items into our db
// setting models' properties after saving isn't storing in the db

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set({ password: hash });
      next();
    });
});

// userSchema.methods.hashPassword = function(password) {
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(password, null, null).bind(this)
//     .then(function(hash) {
//       return hash;
//     });
// };

var User = mongoose.model('User', userSchema);

module.exports = User;
