const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");


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
  email: {
    type: String,
    trim: true,
    required: [true, "Email name must be defined"],
    unique: true,
    validate : {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email!"
    }
  },
  password: {
    type: String,
    minlength: [6, "Password length must be greater than 6"],
    required: [true, "Password must be defined"],
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token : {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "first_name", "last_name", "email"]);
};

userSchema.methods.generateAuthToken = function () {
  var user = this; //Instance methods get called with the individual document
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, "abc123").toString();

  user.tokens.push({
    access,
    token
  });

  return user.save()
  .then( () => {
    return token;
  });
};

userSchema.statics.findByToken = function (token){
  var User = this; //Model methods get called with model as in here where I use User
  var decoded;

  try{
    decoded = jwt.verify(token, "abc123");
  }catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

var User = mongoose.model('User', userSchema);

module.exports = {
  User
};
