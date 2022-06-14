const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/events', async (req, res) => {
    console.log(req.body);
    switch (req.body.type) {
        case "PostCreated": {
            posts[req.body.data.id] = req.body.data
            posts[req.body.data.id].comments = []
            break;
        }
        case "CommentCreated": {
            posts[req.body.data.post].comments.push({
                id: req.body.data.id,
                content: req.body.data.content
            })
            break;
        }
        case "CommentUpdated": {
            posts[req.body.data.post].comments.find(comment => comment.id === req.body.data.id) = req.body.data
            break;
        }
    }
    res.status(201).send({status: "OK"});
})

app.listen(4002, () => {
    console.log("Listing on port 4002");
});