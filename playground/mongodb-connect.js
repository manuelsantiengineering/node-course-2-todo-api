

// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); //THis code does the same as the one over it but uses destructuring

// var obj = new ObjectID();
// console.log(obj);


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
    return console.log(" Error: Unable to connect to MongoDB server.");
  }
  console.log(" Connected to MongoDB server.");

  db.collection('Todos').insertOne(
    {
      text:"Hola Jalapnero",
      completed:false
    },
    (err, result) => {
      if(err){
        return console.log(" Error: Unable to insert todo");
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
    });

  // db.collection('Users').insertOne(
  //   {
  //     name:"Jalapeno",
  //     age:55,
  //     location:"Jalapeno Land"
  //   },
  //   (err, results) => {
  //     if(err){
  //       return console.log(" Error: Unable to insert user");
  //     }
  //     // console.log(JSON.stringify(results.ops, undefined, 2));
  //     console.log(results.ops[0]._id.getTimestamp());
  //   });


  db.close();
});
