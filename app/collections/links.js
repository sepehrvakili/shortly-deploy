// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var Link = require('../models/link');

// var linkSchema = new Schema({..}, { collection: 'data' });

var Links = new db.Collection();

Links.model = Link;

module.exports = Links;