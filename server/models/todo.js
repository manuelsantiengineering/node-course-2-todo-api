
var mongoose  = require("mongoose");
var Schema = mongoose.Schema;

var TodoSchema = new Schema ({
  text: {
    type: String,
    required: [true, "Text must be defined"],
    minlength: [1, "Text must have a length greater than 1"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
  Todo
};
