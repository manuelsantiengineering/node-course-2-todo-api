

// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
    return console.log(" Error: Unable to connect to MongoDB server.");
  }
  console.log(" Connected to MongoDB server.");

  // db.collection('Todos').find({
  //   _id:new ObjectID('59d2d6b5af6b6f65d15fedeb')
  // }).toArray()
  // .then( (docs) => {
  //   console.log("Todos");
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log(" Error: Unable to fetch todos", err);
  // });

  var personajesDeInteres = {
    last_name:"vegetalito",
    location:"Tomato Land"
  };

  var collection_Users = db.collection('Users');

  collection_Users.find(personajesDeInteres).count()
  .then( (count) => {
    console.log(`Todos count ${count}`);
    if(count > 0)
    {
      collection_Users.find(personajesDeInteres).toArray().then( (docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
      })
    }
  })
  .catch( (err) => {
    console.log(" Error: Unable to fetch todos", err);
  });


  // db.close();
});
