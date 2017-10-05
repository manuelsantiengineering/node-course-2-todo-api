

// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
    return console.log(" Error: Unable to connect to MongoDB server.");
  }
  console.log(" Connected to MongoDB server.");
  var collection_Users = db.collection('Todos');

  //deleteMany
  // collection_Users.deleteMany({text:"Hola Tomate del Huerto"})
  // .then( (result) => {
  //   console.log(result);
        // db.close();
  // });

  //deleteOne
  // collection_Users.deleteOne({text:"Hola Pimienton"})
  // .then( (result) => {
  //   console.log(result);
        // db.close();
  // });
  //findOneAndDelete
  // collection_Users.findOneAndDelete({completed:false})
  // .then( (result) => {
  //   console.log(result);
  //   db.close();
  // });

  var collection_Users = db.collection('Users');
  var personajesDeInteres = {
    name:"Cebollin",
    last_name:"vegetalito",
    location:"Tomato Land"
  };
  var countUsers = () => {
    collection_Users.find(personajesDeInteres).count()
    .then( (count) => {
      console.log(`Todos count ${count}`);
      if(count > 1)
      {
        collection_Users.findOneAndDelete(personajesDeInteres)
        .then( (result) => {
          console.log(result);
          countUsers();
        });
      }
      else {
        db.close();
      }
    })
    .catch( (err) => {
      console.log(" Error: Unable to fetch todos", err);
    });
  };

  countUsers();

  // collection_Users.find(personajesDeInteres).count()
  // .then( (count) => {
  //   console.log(`Todos count ${count}`);
  //   if(count > 0)
  //   {
  //     collection_Users.find(personajesDeInteres).toArray().then( (docs) => {
  //       console.log(JSON.stringify(docs, undefined, 2));
  //
  //     })
  //   }
  // })
  // .catch( (err) => {
  //   console.log(" Error: Unable to fetch todos", err);
  // });







  // db.close();
});
