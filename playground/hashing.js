
const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


var password = "password";

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = "$2a$10$3W4fNTbHh6Ds7HyRfU5MNeEjbvMpXPeoVBv/8/j35eN8t8cu0qqlW";

bcrypt.compare(password, hashedPassword, (err, res) =>{
  console.log(res);
});


// var data = {
//   id: 4
// };
//
// var token = jwt.sign(data, "123abc");
//
// console.log(token);
//
// var decoded = jwt.verify(token, "123abc");
//
// console.log("Decoded: ", decoded);

// var message = "Hola TOmatito 01";
//
// var hash = SHA256(message);
//
// console.log("Message: ", message);
// console.log("Hash: ", hash.toString());


// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();
//
// if (resultHash === token.hash){
//   console.log("Data was not changed");
// }
// else {
//   console.log("Data was changed, Don't trust");
// }
