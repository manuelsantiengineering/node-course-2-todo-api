var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Here we configure mongoose.
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp");
// mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports = {
  mongoose,
  Schema
};
