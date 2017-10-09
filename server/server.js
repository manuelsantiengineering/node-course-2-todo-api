//Library imports
var express = require("express");
var bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

//Local imports
var {mongoose, Schema} = require("./db/mongoose.js");
//var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");


var app = express();
// Here we configure our routes using CRUD (Create Read Update Delete)
// We are gonna focus on POST

//Takes the middleware
app.use(bodyParser.json());

// /todos is used for resource  creation
app.post("/todos", (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save()
  .then( (doc) => {
    res.send(doc);
    //console.log(doc);
  })
  .catch( (err) => {
    //console.log("Error", err);
    res.status(400).send(err);
  });
});

app.get("/todos", (req, res) => {
  Todo.find()
  .then( (todos) => {
    res.send({todos});
  })
  .catch( (err) => {
    // console.log("Error", err);
    res.status(400).send(err);
  });
});

//Fetch a variable that is passed through the URL. /todos/12345
app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id))
  {
    return res.status(400).send("Error: Not a valid id.");
  }
  else {
    Todo.findById(id)
    .then( (todo) => {
      if(!todo){
        return res.status(404).send("Error: Unable to find id.");
      }
      // console.log("Todo by ID", JSON.stringify(todo, undefined,2));
      res.status(200).send({todo});
      // res.send({todo});
    })
    .catch ( (err) => {
      res.status(400).send();
    });
  }
});






app.listen(3000, () => {
  console.log("Started on port 3000");
});


module.exports = {
  app
};



// var newUser1 = new User({
//   first_name: "Tomatito",
//   last_name: "del Huerto",
//   age: 31,
//   email: "tomatitodelhuerto@ketchup.com"
// });
//
// var newUser2 = new User({
//   first_name: "Cebollin",
//   last_name: "del Huerto",
//   age: 24,
//   email: "cebollindelhuerto@ketchup.com"
// });
//
// var newUser3 = new User({
//   first_name: "Pimientin",
//   last_name: "Verde",
//   age: 64
// });
//
// newUser2.save()
// .then( (doc) => {
//   console.log(doc);
//   newUser3.save()
//   .then( (doc) => {
//     console.log(doc);
//   });
// })
// .catch( (err) => {
//   console.log(" Error: Unable to save data ", err);
// });
