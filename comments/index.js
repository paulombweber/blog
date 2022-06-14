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
        content: req.body.comment,
        status: 'pending'
    };
    const comments = commentsByPostId[req.params.id] || [];
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;

    notify(comment, req.params.id, "CommentCreated");

    res.status(201).send(comments);
})

let notify = (comment, post, type) => {
    await axios.post("http://localhost:4005/events", {
        type,
        data: {
            ...comment,
            post
        }
    });
}

app.post('/events', async (req, res) => {
    console.log(req.body);

    if (req.body.type === "CommentModerated") {
        const comment = commentsByPostId[req.body.data.post].find(comment => comment.id === req.body.data.id);
        comment.status = req.body.data.status;
        notify(comment, req.body.data.post, "CommentUpdated");
    }

    res.status(201).send({status: "OK"});
})

app.listen(4001, () => {
    console.log("Listing on port 4001");
});