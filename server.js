const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static('static'))
app.use(express.json())

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

let usersTab = []
let moveObject
let Color = "white"
let queensTab = []
let readyPlayers = []
let whiteShips = []
let whiteShipsVal = []
let whiteShipsToScore = []
let blackShips = []
let blackShipsVal = []
let blackShipsToScore = []
let playersTab = []
let wynik = ""
let nowTurn = "white"
let xval = 0
let zval = 0
let whiteSend = false
let blackSend = false
let whiteWin = true
let blackWin = true

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
    playersTab = []
    Color = "white"
    queensTab = []
    whiteShips = []
    whiteShipsVal = []
    whiteShipsToScore = []
    blackShips = []
    blackShipsVal = []
    blackShipsToScore = []
    playersTab = []
    wynik = ""
    nowTurn = "white"
    xval = 0
    zval = 0
    whiteSend = false
    blackSend = false
    whiteWin = true
    blackWin = true
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(usersTab));
})

app.post(`/waitForStart`, function (req, res) {
    const color = req.body.color
    const board = req.body.board
    if (readyPlayers.length < 2) {
        if (!readyPlayers.includes(color)) {
            readyPlayers.push(color)
            playersTab.push(board)
        }
        if (readyPlayers.length == 1) {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(""))
        } else {
            const doc = {
                player1: {
                    name: usersTab[0],
                    board: playersTab[0]
                },
                player2: {
                    name: usersTab[1],
                    board: playersTab[1]
                }
            }
            coll1.insert(doc, function (err, newDoc) {
                console.log("dodano dokument (obiekt):")
                console.log(newDoc)
                console.log("losowe id dokumentu: " + newDoc._id)
            })
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(readyPlayers))
        }
    } else {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(readyPlayers))
    }
})

app.post("/getHistory", function (req, res) {
    coll1.find({}, function (err, docs) {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(docs))
    })
})

app.post(`/getPlayerShips`, function (req, res) {

    let fieldColor = req.body.color
    let playerField = req.body.field
    let playerFieldVal = req.body.fieldVal

    // console.log(fieldColor,playerField,playerFieldVal)

    if (fieldColor == "white") {
        playerField = JSON.parse(playerField)
        playerFieldVal = JSON.parse(playerFieldVal)
        whiteShips = playerField
        whiteShipsVal = playerFieldVal
        whiteShipsToScore = playerField
        whiteSend = true
        res.end("OK")
    }
    else if (fieldColor == "black") {
        playerField = JSON.parse(playerField)
        playerFieldVal = JSON.parse(playerFieldVal)
        blackShips = playerField
        blackShipsVal = playerFieldVal
        blackShipsToScore = playerField
        blackSend = true
        res.end("OK")
    }
    else {
        res.end("ERROR")
    }


})

app.post('/playerShoot', function (req, res) {
    let xCord = req.body.xCord
    let zCord = req.body.zCord
    let color = req.body.color

    xval = xCord
    zval = zCord


    if (color == "black") {
        console.log(whiteShipsVal[xCord][zCord])
        if (whiteShips[xCord][zCord] == 1) {
            if (whiteShipsVal[xCord][zCord] == 1) {
                whiteShipsToScore[xCord][zCord] = 0
                wynik = "ZESTRZELENIE1"
                res.end("ZESTRZELENIE1")
            }

            else if(whiteShipsVal[xCord][zCord] == 2){
                whiteShipsToScore[xCord][zCord] = 0
                
                if(whiteShipsVal[xCord][zCord-1] == 2){
                    if(whiteShipsToScore[xCord][zCord-1] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(whiteShipsToScore[xCord][zCord-1] == 0 && whiteShipsVal[xCord][zCord-1] == 2 && whiteShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(whiteShipsVal[xCord][zCord+1] == 2){
                    if(whiteShipsToScore[xCord][zCord+1] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(whiteShipsToScore[xCord][zCord+1] == 0 && whiteShipsVal[xCord][zCord+1] == 2 && whiteShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(whiteShipsVal[xCord-1][zCord] == 2){
                    if(whiteShipsToScore[xCord-1][zCord] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(whiteShipsToScore[xCord-1][zCord] == 0 && whiteShipsVal[xCord-1][zCord] == 2 && whiteShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(whiteShipsVal[xCord+1][zCord] == 2){
                    if(whiteShipsToScore[xCord+1][zCord] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(whiteShipsToScore[xCord+1][zCord] == 0 && whiteShipsVal[xCord+1][zCord] == 2 && whiteShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }
            }

            else if(whiteShipsVal[xCord][zCord] == 3){
                whiteShipsToScore[xCord][zCord] = 0
                let zestrzelony = true
                
                for(let i = xCord - 2; i <= xCord + 2; i++){
                    console.log(i)
                    if(i >= 0 && i <=9){
                        if(whiteShipsVal[i][zCord] == 3 && whiteShipsToScore[i][zCord] != 0){
                            zestrzelony = false
                            
                           //console.log(whiteShipsVal[i][zCord], whiteShipsToScore[i][zCord] + " = " + zestrzelony)
                        }
                    }
                   
                }

                if(zestrzelony == false){
                    zestrzelony = true
                }

                for(let i = zCord - 2; i <= zCord + 2; i++){
                    console.log(i)
                    if(i >= 0 && i <= 9){
                        if(whiteShipsVal[xCord][i] == 3 && whiteShipsToScore[xCord][i] != 0){
                            zestrzelony = false
                            
                            //console.log(whiteShipsVal[xCord][i], whiteShipsToScore[xCord][i] + " = " + zestrzelony)
                        }
                    }
                    
                }
                if(zestrzelony){
                    wynik = "ZESTRZELENIE3"
                    res.end("ZESTRZELENIE3")
                }else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }
            }

            else if(whiteShipsVal[xCord][zCord] == 4){
                let zestrzelonyfour = true
                whiteShipsToScore[xCord][zCord] = 0

                for(let i=0; i<10;i++){
                    for(let j=0; j<10; j++){
                        if(whiteShipsVal[i][j] == 4 && whiteShipsToScore[i][j] != 0){
                            zestrzelonyfour = false
                        }
                    }
                }

                if(zestrzelonyfour){
                    wynik = "ZESTRZELENIE4"
                    res.end("ZESTRZELENIE4")
                }else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }

            }

            else {
                wynik = "TRAFIENIE"
                res.end("TRAFIENIE")
            }
        }
        else {
            wynik = "BRAK TRAFIENIA"
            res.end("BRAK TRAFIENIA")
        }




    } else if (color == "white") {
        if (blackShips[xCord][zCord] == 1) {
            if (blackShipsVal[xCord][zCord] == 1) {
                blackShipsToScore[xCord][zCord] = 0
                wynik = "ZESTRZELENIE1"
                res.end("ZESTRZELENIE1")
            } 

            else if(blackShipsVal[xCord][zCord] == 2){
                blackShipsToScore[xCord][zCord] = 0
                
                if(blackShipsVal[xCord][zCord-1] == 2){
                    if(blackShipsToScore[xCord][zCord-1] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(blackShipsToScore[xCord][zCord-1] == 0 && blackShipsVal[xCord][zCord-1] == 2 && blackShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(blackShipsVal[xCord][zCord+1] == 2){
                    if(blackShipsToScore[xCord][zCord+1] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(blackShipsToScore[xCord][zCord+1] == 0 && blackShipsVal[xCord][zCord+1] == 2 && blackShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(blackShipsVal[xCord-1][zCord] == 2){
                    if(blackShipsToScore[xCord-1][zCord] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(blackShipsToScore[xCord-1][zCord] == 0 && blackShipsVal[xCord-1][zCord] == 2 && blackShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else if(blackShipsVal[xCord+1][zCord] == 2){
                    if(blackShipsToScore[xCord+1][zCord] == 1){
                        wynik = "TRAFIENIE"
                        res.end("TRAFIENIE")
                    }else if(blackShipsToScore[xCord+1][zCord] == 0 && blackShipsVal[xCord+1][zCord] == 2 && blackShipsToScore[xCord][zCord] == 0){
                        wynik = "ZESTRZELENIE2"
                        res.end("ZESTRZELENIE2")
                    }
                }
                else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }
            }

            else if(blackShipsVal[xCord][zCord] == 3){
                blackShipsToScore[xCord][zCord] = 0
                let zestrzelony = true
                
                for(let i = xCord - 2; i <= xCord + 2; i++){
                    console.log(i)
                    if(i >= 0 && i <=9){
                        if(blackShipsVal[i][zCord] == 3 && blackShipsToScore[i][zCord] != 0){
                            zestrzelony = false
                           
                        }
                        //console.log(blackShipsVal[i][zCord], blackShipsToScore[i][zCord] + " = " + zestrzelony)
                    }
                   
                }

                if(zestrzelony == false){
                    zestrzelony = true
                }
                console.log("\n")
                for(let i = zCord - 2; i <= zCord + 2; i++){
                    console.log(i)
                    if(i >= 0 && i <= 9){
                        if(blackShipsVal[xCord][i] == 3 && blackShipsToScore[xCord][i] != 0){
                            zestrzelony = false
                            
                        }
                        //console.log(blackShipsVal[xCord][i], blackShipsToScore[xCord][i] + " = " + zestrzelony)
                    }
                    
                }

                if(zestrzelony){
                    wynik = "ZESTRZELENIE3"
                    res.end("ZESTRZELENIE3")
                }else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }
            }

            else if(blackShipsVal[xCord][zCord] == 4){
                let zestrzelonyfour = true

                blackShipsToScore[xCord][zCord] = 0

                for(let i=0; i<10;i++){
                    for(let j=0; j<10; j++){
                        if(blackShipsVal[i][j] == 4 && blackShipsToScore[i][j] != 0){
                            zestrzelonyfour = false
                        }
                    }
                }

                if(zestrzelonyfour){
                    wynik = "ZESTRZELENIE4"
                    res.end("ZESTRZELENIE4")
                }else{
                    wynik = "TRAFIENIE"
                    res.end("TRAFIENIE")
                }

            }

            else {
                wynik = "TRAFIENIE"
                res.end("TRAFIENIE")
            }
        }


        else {
            wynik = "BRAK TRAFIENIA"
            res.end("BRAK TRAFIENIA")
        }

    }
})

app.post('/checkShoot', function (req, res) {
    res.end(wynik)
})

app.post('/changeTurn', function (req, res) {
    let leftTurn = req.body.color
    
    if (leftTurn == "white") {
        nowTurn = "black"
    }
    else if (leftTurn == "black") {
        nowTurn = "white"
    }
    else if(leftTurn == "LOSE"){
        nowTurn = "LOSE"
    }
    res.end("OK TURN")
})

app.post('/checkTurn', function (req, res) {

    let result = wynik
    res.end(JSON.stringify({nowTurn:nowTurn,xshoot:xval,zshoot:zval, result: result}))
})

app.post('/checkWin', function(req,res){
    whiteWin = true
    blackWin = true
    
    if(usersTab.length == 2 && blackSend == true && whiteSend == true){
        
        console.log("TEST")
        console.log(whiteWin,blackWin)


        for(let i=0; i<10;i++){
            for(let j=0; j<10; j++){
                if(whiteShipsToScore[i][j] != 0 && whiteShipsToScore[i][j] != 2){
                    blackWin = false
                }
                if(blackShipsToScore[i][j] != 0 && blackShipsToScore[i][j] !=2){
                    whiteWin = false
                }
            }
        }

        console.log(whiteWin,blackWin)

        console.log(whiteShipsToScore)

        if(whiteWin){
            res.end("white")
        }
        else if(blackWin){
            res.end("black")
        }else{
            res.end("")
        }
        
    }
    else{
        res.end("")
    }

    
    
})

app.listen(PORT, () => console.log("app listening on 3000"));