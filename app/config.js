var MongoClient = require('mongodb').MongoClient;
var db = require('mongoose');

var source = process.env.DB_ENV || '127.0.0.1:27017';

MongoClient.connect('mongodb://' + source + '/myDb', function(err, db) {
  if (err) {
    console.log(err);
    console.error('Not connected to database');
  } else {
    console.log('Connected to database');
  }
});

db.connect('mongodb://' + source + '/myDb');

module.exports = db;
