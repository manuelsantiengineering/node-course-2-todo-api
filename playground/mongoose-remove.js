const {ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring


const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = new ObjectID("59dc1782fb0ad500126e2a21");
var first_name = "Cebollin";

// Todo.remove({})
// .then( (result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({
//   text:"This is from Postman2"
// })
// .then( (todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove({
  _id:id
})
.then( (todo) => {
  console.log(todo);
});
