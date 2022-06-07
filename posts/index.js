const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/posts', async (req, res) => {
    const post = {
        id: randomBytes(4).toString('hex'),
        title: req.body.title
    };
    posts[post.id] = post;
    
    await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id: post.id,
      title: post.title,
    },
  });

    res.status(201).send(post);    
})

app.post('/events', async (req, res) => {
    console.log(req.body);
    res.status(200).send({});
})

app.listen(4000, () => {
    console.log("Listing on port 4000");
});