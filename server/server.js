require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");
const _ = require("lodash");
//Local imports
const {mongoose, Schema} = require("./db/mongoose.js");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

var app = express();

//Takes the middleware
app.use(bodyParser.json());
app.post("/users", async (req, res) => {
  const body = _.pick(req.body, ["first_name", "last_name", "email", "password"]); // T0 make sure we only get text and completed options
  try{
    var newUserToPost = new User(body);
    await newUserToPost.save();
    const token = await newUserToPost.generateAuthToken();
    res.status(200).header('x-auth', token).send(newUserToPost);
  } catch(e){
    res.status(400).send("Error: User already exists.");
  }
});

app.get("/users/me", authenticate, (req, res) => {
  res.status(200).send(req.user);
});

app.post("/users/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  try{
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.status(200).header('x-auth', token).send(user);
  } catch(e){
    res.status(400).send(" Error: User not found");
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch (e){
    res.status(400).send();
  }
});

app.post("/todos", authenticate, async (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  try{
    const doc = await todo.save();
    res.status(200).send(doc);
  } catch(e){
    res.status(400).send(e);
  }
});

app.get("/todos", authenticate, async (req, res) => {
  try{
    const todos = await Todo.find({
      _creator: req.user._id
    });
    res.status(200).send({todos});
  } catch(e){
    res.status(400).send(e);
  }
});

app.get("/todos/:id", authenticate, async (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send("Error: Not a valid id.");
  }
  else {
    try{
      const todo = await Todo.findOne({
        _id: id,
        _creator: req.user._id
      });
      if(!todo){
        return res.status(404).send("Error: Unable to find id.");
      }
      res.status(200).send({todo});
    } catch(e){
      res.status(400).send();
    }
  }
});

app.delete("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    res.status(400).send("Error: Not a valid id.");
  }
  else {
    try{
      const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });
      if(!todo){
        return res.status(404).send("Error: Unable to find.");
      }
      res.status(200).send({todo});
    } catch(e){
      res.status(400).send();
    }
  }
});

app.patch("/todos/:id", authenticate, async (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]); // T0 make sure we only get text and completed options

  if(!ObjectID.isValid(id)){
    return res.status(400).send("Error: Not a valid id.");
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }
  try{
    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      }
      , {
      $set: body
    }, {
      new: true
    });
    if(!todo){
      return res.status(404).send("Error: Unable to find id.");
    }
    res.status(200).send({todo});
  } catch (e){
    res.status(400).send();
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {
  app
};
