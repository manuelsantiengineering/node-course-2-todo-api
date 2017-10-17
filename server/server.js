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
app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["first_name", "last_name", "email", "password"]); // T0 make sure we only get text and completed options

  var newUserToPost = new User(body);

  newUserToPost.save()
  .then( () => {     // doc is the same as newUserToPost
    return newUserToPost.generateAuthToken();
  })
  .then( (token) => {
    res.status(200).header('x-auth', token).send(newUserToPost);
  })
  .catch( (err) => {
    res.status(400).send();
  });
});

app.get("/users/me", authenticate, (req, res) => {
  res.status(200).send(req.user);
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
  .then( (user) => {
    user.generateAuthToken()
    .then( (token) => {
      res.status(200).header('x-auth', token).send(user);
    })
  })
  .catch( (err) => {
    res.status(400).send(" Error: User not found");
  });
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token)
  .then( () => {
    res.status(200).send();
  })
  .catch( (err) => {
    res.status(400).send();
  });
});

app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save()
  .then( (doc) => {
    res.status(200).send(doc);
  })
  .catch( (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  })
  .then( (todos) => {
    res.status(200).send({todos});
  })
  .catch( (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send("Error: Not a valid id.");
  }
  else {
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    })
    .then( (todo) => {
      if(!todo){
        return res.status(404).send("Error: Unable to find id.");
      }
      res.status(200).send({todo});
    })
    .catch ( (err) => {
      res.status(400).send();
    });
  }
});

app.delete("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send("Error: Not a valid id.");
  }
  else {
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
    .then( (todo) => {
      if(!todo){
        return res.status(404).send("Error: Unable to find.");
      }
      res.status(200).send({todo});
    })
    .catch ( (err) => {
      res.status(400).send();
    });
  }
});

app.patch("/todos/:id", authenticate, (req, res) => {
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

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    }
    , {
    $set: body
  }, {
    new: true
  })
  .then( (todo) => {
    if(!todo){
      return res.status(404).send("Error: Unable to find id.");
    }
    res.status(200).send({todo});
  })
  .catch ( (err) => {
    res.status(400).send();
  });

});



app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {
  app
};
