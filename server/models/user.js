
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  first_name: {
    type: String,
    required: [true, "First name must be defined"],
    minlength: [1, "First name must have a length greater than 1"],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, "Last name must be defined"],
    minlength: [1, "First name must have a length greater than 1"],
    trim: true
  },
  age: {
    type: Number,
    required: [true, "Age must be defined"],
    min: [18,"Minimum age is 18"],
    max: [100, "You're too old for this, go have fun"]
  },
  email: {
    type: String,
    minlength: [4, "Email name must have a length greater than 5"],
    default: "none",
    trim: true
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User
};
