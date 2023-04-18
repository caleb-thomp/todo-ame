const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.MONGOD;

app.use(cors());

// connect to MongoDB using Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// define the todo schema
const todoSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
});

// create the todo model
const Todo = mongoose.model("Todo", todoSchema);

// set up routes
app.get("/api/todos", async function (req, res) {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/todos", async function (req, res) {
  const todo = new Todo({
    text: req.body.text,
    done: req.body.done,
  });

  try {
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.put("/api/todos/:id", async function (req, res) {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        done: req.body.done,
      },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.delete("/api/todos/:id", async function (req, res) {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(
      req.params.id
    );
    res.json(deletedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// start the server
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
