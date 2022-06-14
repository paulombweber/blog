const axios = require('axios');
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
    handleEvent(req.body.type, req.body.data);
    res.status(201).send({status: "OK"});
})

const handleEvent = async (type, data) => {
    switch (type) {
        case "PostCreated": {
            posts[data.id] = data
            posts[data.id].comments = []
            break;
        }
        case "CommentCreated": {
            posts[data.post].comments.push({
                id: data.id,
                content: data.content
            })
            break;
        }
        case "CommentUpdated": {
            posts[data.post].comments.find(comment => comment.id === data.id) = data
            break;
        }
    }
}

app.listen(4002, () => {
    console.log("Listing on port 4002");

    const res = await axios.get('http://localhost:4005/events')
    res.data.forEach(event => handleEvent(event.type, event.data))
});