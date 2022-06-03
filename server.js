const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static('static'))
app.use(express.json())

let usersTab = []
let moveObject
let Color = "white"
let queensTab = []

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
    console.log(usersTab)
})

app.post(`/clearUserTab`, function (req, res) {
    usersTab.length = 0
    moveObject = undefined
    Color = "white"
    queensTab = []
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(usersTab));
})

app.listen(PORT, () => console.log("app listening on 3000"));