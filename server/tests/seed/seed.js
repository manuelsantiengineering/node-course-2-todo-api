const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");


const user1Id = new ObjectID();
const user2Id = new ObjectID();

const usersNew = [
  {
    _id: user1Id,
    first_name: "Tomatito",
    last_name: "Verde",
    email: "tomatito@tomates.com",
    password: "password1",
    tokens: [
      {
        access: "auth",
        token: jwt.sign(
          {
            _id: user1Id,
            access: "auth"
          }, "abc123").toString()
      }
    ]
  },
  {
    _id: user2Id,
    first_name: "Cebollin",
    last_name: "Violeta",
    email: "cebollin@tomates.com",
    password: "password2",
    tokens: [
      {
        access: "auth",
        token: jwt.sign(
          {
            _id: user2Id,
            access: "auth"
          }, "abc123").toString()
      }
    ]
  }
];

const todosNew = [
  {
    _id: new ObjectID(),
    text: "First Test todo",
    completed: false,
    _creator: user1Id
  },
  {
    _id: new ObjectID(),
    text: "Second Test todo",
    completed: true,
    completedAt: 2,
    _creator: user2Id
  }
];

const populateTodos  = (done) => {
  Todo.remove({})
  .then( () => {
    return Todo.insertMany(todosNew);
  })
  .then( () => {
    done();
  });
};

const populateUsers = (done) => {
  User.remove({})
  .then( () => {
    var user1 = new User(usersNew[0]).save();
    var user2 = new User(usersNew[1]).save();

    return Promise.all([user1, user2]);
  })
  .then( () => {
    done();
  });
};

module.exports = {
  todosNew,
  populateTodos,
  usersNew,
  populateUsers
};
