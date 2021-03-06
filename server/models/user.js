const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require('bcryptjs');

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
      validator: (value) => {
        return validator.isEmail(value);
      },
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
  }, process.env.JWT_SECRET).toString();

  user.tokens.push({
    access,
    token
  });

  return user.save()
  .then( () => {
    return token;
  });
};

userSchema.methods.removeToken = function (token){
  var user = this; //Model methods get called with model as in here where I use User

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });

};

userSchema.statics.findByToken = function (token){
  var User = this; //Model methods get called with model as in here where I use User
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

userSchema.statics.findByCredentials = function (email, password){
  var User = this;

  try{
    return User.findOne({email})
    .then( (user) => {
      if(!user){
        return Promise.reject();
      }
      return new Promise( (resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) =>{
          if(!res){
            reject();
          }else{

            resolve(user);
          }
        });
      });

    })
  }catch (e) {
    return Promise.reject();
  }

};

userSchema.pre("save", function(next){
  var user = this;

  if(user.isModified("password")){ //Verify if the password was modified
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User
};
