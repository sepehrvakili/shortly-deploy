var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String
},
  {
    timestamps: { createdAt: 'created_at' }
  }
);

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set({ password: hash });
      next();
    });
});

var User = mongoose.model('User', userSchema);

module.exports = User;
