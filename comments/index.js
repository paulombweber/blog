const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]);
})

app.post('/posts/:id/comments', async (req, res) => {
    const comment = {
        id: randomBytes(4).toString('hex'),
        comment: req.body.comment
    };
    const comments = commentsByPostId[req.params.id] || [];
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: comment.id,
            comment: comment.comment,
            post: req.params.id
        }
    });

    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    console.log(req.body);
    res.status(201).send({status: "OK"});
})

app.listen(4001, () => {
    console.log("Listing on port 4001");
});