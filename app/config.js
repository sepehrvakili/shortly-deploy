var mongoose = require('mongoose');

var source = process.env.DB_ENV || '127.0.0.1:27017';
mongoose.connect('mongodb://' + source + '/myDb')

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection is open');
});

module.exports = db;
