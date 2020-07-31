const express = require("express");
const morgan = require("morgan");
const db = require('./db');
const postBank = require("./postBank");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));

app.get("/", async(req, res, next) => {
  try {
    const response = await db.client.query(`
      SELECT posts.id, posts.title, posts.date, users.name FROM posts
      JOIN users
      ON posts.userId = users.id
    `); 
    res.send(postList(response.rows));
  }
  catch(ex){
    next(ex);
  }
});

app.get("/posts/:id", async(req, res, next) => {
  try {
    const response = await db.client.query(`
      SELECT posts.*, users.name FROM posts
      JOIN users
      ON posts.userId = users.id
      WHERE posts.id = $1
    `, [ req.params.id ]); 
    res.send(postDetails(response.rows[0]));
  }
  catch(ex){
    next(ex);
  }
  //const post = postBank.find(req.params.id);
  //res.send(postDetails(post));
});

const PORT = 1337;

db.setup();
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
