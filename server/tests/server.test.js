const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

 //Wipe out all of the documents in the Todo db
beforeEach( (done) => {
  Todo.remove({})
  .then( () => {
    done();
  });
});

describe("POST /todos", () => {
  it("Should create a new todo", (done) => {
    var jsonToSend = {
      text:"Test todo test",
      completed:true
    };

    request(app)
      .post("/todos")
      .send(jsonToSend)
      .expect(200)
      .expect( (res) => {
        expect(res.body.text).toBe(jsonToSend.text);
      })
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.find()
        .then( (todos) => {
          // console.log(JSON.stringify(todos, undefined, 2));
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(jsonToSend.text);
          done();
        })
        .catch( (e) => {
          done(e);
        });

    });
  });

  it("Should not create todo with invalid body status", (done) => {

    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.find()
        .then( (todos) => {
          expect(todos.length).toBe(0);
          done();
        })
        .catch( (e) => {
          done(e);
        });

    });



  });


});
