const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/posts', (req, res) => {
    const post = {
        id: randomBytes(4).toString('hex'),
        title: req.body.title
    };
    posts[post.id] = post;
    res.status(201).send(post);
})

app.listen(4000, () => {
    console.log("Listing on port 4000");
});