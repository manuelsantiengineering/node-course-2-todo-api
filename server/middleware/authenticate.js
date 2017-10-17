const {User} = require("./../models/user");


var authenticate = (req, res, next) =>{
  var token = req.header("x-auth");

  User.findByToken(token)
  .then( (user) => {
    if(!user){
      return Promise.reject(); // Both will be called as errors
    }
    req.user = user;
    req.token = token;
    next();
  })
  .catch( (err) => {
    res.status(401).send("Error: Unauthorized. Authentication is required.");
  });
};

// var doNotDuplicateUser = (req, res, next) =>{
//   User.findOne({email:req.body.email})
//   .then( (user) => {
//     if(user){
//       return Promise.reject(); // Both will be called as errors
//     }
//     next();
//   })
//   .catch( (err) => {
//     res.status(400).send(" Error: User email already exists.");
//   });
// };

module.exports = {
  authenticate
  // doNotDuplicateUser
};
