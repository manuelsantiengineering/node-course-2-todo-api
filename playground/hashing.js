
const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");



var data = {
  id: 4
};

var token = jwt.sign(data, "123abc");

console.log(token);

var decoded = jwt.verify(token, "123abc");

console.log("Decoded: ", decoded);

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
