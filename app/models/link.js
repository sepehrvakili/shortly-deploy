var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
  // initialize: function() {
  //   this.on('creating', function(model, attrs, options) {
  //     var shasum = crypto.createHash('sha1');
  //     shasum.update(model.get('url'));
  //     model.set('code', shasum.digest('hex').slice(0, 5));
  //   });
  // }
// });


var linkSchema = new mongoose.Schema({
  id: Number,
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
},
  {
    timestamps: { createdAt: 'created_at' }
  }
);

linkSchema.post('save', function(link) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set({code: shasum.digest('hex').slice(0, 5)});
  this.set({title: 'TEST TITLE'});
});


var Link = mongoose.model('Link', linkSchema);

module.exports = Link;


