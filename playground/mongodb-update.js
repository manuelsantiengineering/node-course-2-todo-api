

// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
    return console.log(" Error: Unable to connect to MongoDB server.");
  }
  console.log(" Connected to MongoDB server.");
  var collection_Todos = db.collection('Todos');
  var collection_Users = db.collection('Users');

  var todosToFind = {
    _id: new ObjectID("59cebfed3be47023a900f8d9")
  };

  var todosToChange= {
    $set: {
      text:"Hola Tomatero Vegetal",
    },
    $unset: {
      nuevo:"New field"
    }
  };
  var todosUpdateOperations = {
    returnOriginal: false
  };

  var personajesOfInterest = {
    name:"Cebollin",
    last_name:"vegetalito",
    location:"Tomato Land"
  };

  var usersInfoToUpdate = {
    $inc: {
      age:1
    },
    $set: {
      name:"Cebolleta"
    }
  };

  var usersUpdateOperations = {
    returnOriginal: false
  };

  collection_Todos.findOneAndUpdate(todosToFind, todosToChange, todosUpdateOperations)
  .then( (result) => {
      console.log(result);
      collection_Users.findOneAndUpdate(personajesOfInterest, usersInfoToUpdate, usersUpdateOperations)
      .then( (result) => {
          console.log(result);
          db.close();
      });
  });



  // db.close();
});
