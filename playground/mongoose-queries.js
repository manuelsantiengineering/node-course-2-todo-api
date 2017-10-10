const {ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = "59d588dd877c063be11d5823";
var first_name = "Cebollin";

if(!ObjectID.isValid(id))
{
  console.log("Error: Id not valid!");
}
{
  User.find({first_name})
  .then( (users) => {
    if(users.length == 0){
      return console.log("Error: No documents match the input field!");
    }
    console.log("Users:", JSON.stringify(users, undefined,2));
  })
  . catch ( (err) => {
    // console.log(err);
  });

  User.findOne({first_name})
  .then( (user) => {
    if(!user){
      return console.log("Error: No documents match the input field!");
    }
    console.log("User:", JSON.stringify(user, undefined,2));
  })
  . catch ( (err) => {
    // console.log(err);
  });

  User.findById(id)
  .then( (user) => {
    if(!user){
      return console.log("Error: Unable to find user!");
    }
    console.log("User By Id: ", JSON.stringify(user, undefined,2));
  })
  . catch ( (err) => {
    // console.log(err);
  });




  // Todo.find({
  //   _id: id //We do not need to manually casts the object to Object Id
  // })
  // .then( (todos) => {
  //   if(todos.length == 0){
  //     return console.log("Error: No documents match the input field!");
  //   }
  //   console.log("Todos", JSON.stringify(todos, undefined,2));
  // })
  // . catch ( (err) => {
  //   //console.log(err);
  // });
  //
  // Todo.findOne({
  //   _id: id //We do not need to manually casts the object to Object Id
  // })
  // .then( (todo) => {
  //   if(!todo){
  //     return console.log("Error: No documents match the input field!");
  //   }
  //   console.log("Todo", JSON.stringify(todo, undefined,2));
  // })
  // . catch ( (err) => {
  //   //console.log(err);
  // });
  //
  // Todo.findById(id)
  // .then( (todo) => {
  //   if(!todo){
  //     return console.log("Error: Id not found!");
  //   }
  //   console.log("Todo By Id", JSON.stringify(todo, undefined,2));
  // })
  // . catch ( (err) => {
  //   //console.log(err);
  // });
}
