const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todosNew, populateTodos, usersNew, populateUsers} = require("./seed/seed");


beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("Should create a new todo", (done) => {
    var jsonToSend = {
      text:"Test todo test",
      completed: false
    };

    request(app)
      .post("/todos")
      .set("x-auth", usersNew[0].tokens[0].token)
      .send(jsonToSend)
      .expect(200)
      .expect( (res) => {
        expect(res.body.text).toBe(jsonToSend.text);
      })
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.find(jsonToSend)
        .then( (todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(jsonToSend.text);
          done();
        })
        .catch( (e) => {
          done(e);
        });

    });
  });

  it("Should not create todo with invalid body data", (done) => {

    request(app)
      .post("/todos")
      .set("x-auth", usersNew[0].tokens[0].token)
      .send({})
      .expect(400)
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.find()
        .then( (todos) => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch( (e) => {
          done(e);
        });

    });
  });
}); // end of describe(POST /todos)

describe("GET /todos", () => {
  it("Should get all todos", (done) => {
    request(app)
      .get("/todos")
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});


describe("GET /todos/:id", () => {
  it("Should get the doc with a specific id", (done) => {
    request(app)
      .get(`/todos/${todosNew[0]._id.toHexString()}`)
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        // expect(res.body.todo).toBe(todosNew[0]);
        expect(res.body.todo.text).toBe(todosNew[0].text);
      })
      .end(done);
  });

  it("Should not get the doc created by other user", (done) => {
    request(app)
      .get(`/todos/${todosNew[1]._id.toHexString()}`)
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return a 404 if id not found", (done) => {
    var newId = new ObjectID();
    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return a 400 for non-object ids", (done) => {
    request(app)
      .get(`/todos/123`)
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(400)
      .end(done);
  });

});

describe("DELETE /todos/:id", () => {
  it("Should remove a doc with a specific id", (done) => {
    var hexid = todosNew[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexid}`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo._id).toBe(hexid);
      })
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexid)
        .then( (todo) => {
          expect(todo).toBeFalsy();
          done();
        })
        .catch( (e) => {
          done(e);
        });

      });
  });

  it("Should not remove a doc created by other user", (done) => {
    var hexid = todosNew[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexid}`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .expect(404)
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexid)
        .then( (todo) => {
          expect(todo).toBeTruthy();
          done();
        })
        .catch( (e) => {
          done(e);
        });

      });
  });


  it("Should return a 404 if id not found", (done) => {
    var newId = new ObjectID();
    request(app)
      .delete(`/todos/${newId.toHexString()}`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return a 400 for non-object ids", (done) => {
    request(app)
      .delete(`/todos/123`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .expect(400)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {

  const tmpTodosNew = [
    {
      text: "Updated First Test todo",
      completed: false,
    },
    {
      text: "Updated Second Test todo",
      completed: false,
      completedAt: null
    }
  ];

  it("Should update a doc with a specific id", (done) => {
    var hexid = todosNew[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexid}`)
      .set("x-auth", usersNew[0].tokens[0].token)
      .send(tmpTodosNew[0])
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo._id).toBe(hexid);
        expect(res.body.todo.text).toBe(tmpTodosNew[0].text);
        expect(res.body.todo.completed).toBe(tmpTodosNew[0].completed);
      })
      .end(done);
  });

  it("Should not update a doc created by other user", (done) => {
    var hexid = todosNew[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexid}`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .send(tmpTodosNew[0])
      .expect(404)
      .end(done);
  });

  it("Should clear completedAt when todo is not completed", (done) => {
    var hexid = todosNew[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexid}`)
      .set("x-auth", usersNew[1].tokens[0].token)
      .send(tmpTodosNew[1])
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo._id).toBe(hexid);
        expect(res.body.todo.text).toBe(tmpTodosNew[1].text);
        expect(res.body.todo.completed).toBe(tmpTodosNew[1].completed);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe("GET users/me", () => {
  it("Should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        expect(res.body._id).toBe(usersNew[0]._id.toHexString());
        expect(res.body.first_name).toBe(usersNew[0].first_name);
        expect(res.body.last_name).toBe(usersNew[0].last_name);
        expect(res.body.email).toBe(usersNew[0].email);
      })
      .end(done);  });

  it("Should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", "")
      .expect(401)
      .expect( (res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST users/", () => {
  var tmpUser = {
      first_name: "Hulk",
      last_name: "Gato",
      email: "hulkis@gatos.com",
      password: "password"
    };
  it("Should create an user", (done) => {
    request(app)
      .post("/users")
      .send(tmpUser)
      .expect(200)
      .expect( (res) => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.first_name).toBe(tmpUser.first_name);
        expect(res.body.last_name).toBe(tmpUser.last_name);
        expect(res.body.email).toBe(tmpUser.email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email:tmpUser.email})
        .then( (user) => {
          expect(user).toBeTruthy();
          expect(user.first_name).toBe(tmpUser.first_name);
          expect(user.last_name).toBe(tmpUser.last_name);
          expect(user.email).toBe(tmpUser.email);
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
  });

  it("Should return validation error if request is invalid", (done) => {
    request(app)
      .post("/users")
      .send({
        first_name: "Hulk",
        last_name: "Gato",
        email:"notValidEmail",
        password: "password"
      })
      .expect(400)
      .end(done);
  });

  it("Should not create user if email is in use", (done) => {
    request(app)
      .post("/users")
      .send({
        first_name: "Hulk",
        last_name: "Gato",
        email: usersNew[0].email,
        password: "password"
      })
      .expect(400)
      .end(done);
  });
});

describe("POST users/login", () => {
  it("Should login user and return auth token", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: usersNew[1].email,
        password: usersNew[1].password
      })
      .expect(200)
      .expect( (res) => {
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findOne({email:res.body.email})
        .then( (user) => {
          expect(user).toBeTruthy();
          expect(user.first_name).toBe(usersNew[1].first_name);
          expect(user.last_name).toBe(usersNew[1].last_name);
          expect(user.email).toBe(usersNew[1].email);
          expect(user.toObject().tokens[1]).toMatchObject({
            access:"auth",
            token: res.headers["x-auth"]
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
      });

      it("Should reject invalid login", (done) => {
        var userLogin = {
          email: "perrito@tomates.com",
          password: "password1",
        };

        request(app)
          .post("/users/login")
          .send(userLogin)
          .expect(400)
          .expect( (res) => {
            expect(res.headers["x-auth"]).toBeFalsy();
          })
          .end((err, res) => {
            if(err){
              return done(err);
            }
            User.findOne({email:res.body.email})
            .then( (user) => {
              expect(user).toBeFalsy();
              done();
            })
            .catch((err) => {
              done(err);
            });
          });
      });
});

describe("DELETE users/me/token", () => {
  it("Should log out user and remove auth token", (done) => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", usersNew[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findOne({email: usersNew[0].email})
        .then( (user) => {
          expect(user.tokens.length).toBe(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
      });
});
