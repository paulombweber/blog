const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.log(req.body);

    if (req.body.type === "CommentCreated") {
        // setTimeout(10000, () => {
        const status = req.body.data.content.includes("orange") ? "rejected" : "approved"
        notify(req.body.data, status)
        // });
    }

    res.status(201).send({status: "OK"})
})

const notify = (data, status) => {
    await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
            id: data.id,
            post: data.post,
            status: status
        },
        })
}

app.listen(4003, () => {
    console.log('Listening on 4003')
})