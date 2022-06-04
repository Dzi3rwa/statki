const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static('static'))
app.use(express.json())

let usersTab = []
let moveObject
let Color = "white"
let queensTab = []
let readyPlayers = []

app.post('/addUser', (req, res) => {
    const userName = req.body.userName
    if (usersTab.includes(userName) && usersTab.length < 2) {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(""));
    } else {
        if (userName == true) {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(usersTab));
        } else {
            usersTab.push(userName)
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(usersTab));
        }
    }
})

app.post(`/clearUserTab`, function (req, res) {
    usersTab.length = 0
    readyPlayers.length = 0
    moveObject = undefined
    Color = "white"
    queensTab = []
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(usersTab));
})

app.post(`/waitForStart`, function (req, res) {
    const color = req.body.color
    if (readyPlayers.length < 2) {
        if (!readyPlayers.includes(color))
            readyPlayers.push(color)
        if (readyPlayers.length == 1) {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(""))
        } else {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(readyPlayers))
        }
    } else {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(readyPlayers))
    }
})

app.listen(PORT, () => console.log("app listening on 3000"));