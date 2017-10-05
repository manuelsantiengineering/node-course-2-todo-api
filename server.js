
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Here we configure mongoose.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var userSchema = new Schema ({
  first_name: {
    type: String,
    required: [true, "First name must be defined"],
    minlength: [1, "First name must have a length greater than 1"],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, "Last name must be defined"],
    minlength: [1, "First name must have a length greater than 1"],
    trim: true
  },
  age: {
    type: Number,
    required: [true, "Age must be defined"],
    min: [18,"Minimum age is 18"],
    max: [100, "You're too old for this, go have fun"]
  },
  email: {
    type: String,
    minlength: [4, "Email name must have a length greater than 5"],
    default: "none",
    trim: true
  }
});

var User = mongoose.model('User', userSchema);

var newUser1 = new User({
  first_name: "Tomatito",
  last_name: "del Huerto",
  age: 31,
  email: "tomatitodelhuerto@ketchup.com"
});

var newUser2 = new User({
  first_name: "Cebollin",
  last_name: "del Huerto",
  age: 24,
  email: "cebollindelhuerto@ketchup.com"
});

var newUser3 = new User({
  first_name: "Pimientin",
  last_name: "Verde",
  age: 64
});

newUser2.save()
.then( (doc) => {
  console.log(doc);
  newUser3.save()
  .then( (doc) => {
    console.log(doc);
  });
})
.catch( (err) => {
  console.log(" Error: Unable to save data ", err);
});

//
// var TodoSchema = new Schema ({
//   text: {
//     type: String,
//     required: [true, "Text must be defined"],
//     minlength: [1, "Text must have a length greater than 1"],
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   }
// });
//
// var Todo = mongoose.model('Todo', TodoSchema);
//
// var newTodo = new Todo({
//   text: true
// });
//
// newTodo.save()
// .then( (doc) => {
//   console.log(doc);
// })
// .catch( (err) => {
//   console.log(" Error: Unable to save data ", err);
// });
