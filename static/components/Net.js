class Net {
    constructor() {
        this.ui
        this.wynik = ""
    }

    userLogin = (game, ui) => {
        this.ui = ui
        let userName = document.getElementById("inputLogin").value
        let body = JSON.stringify({ userName: userName })
        let i = 0
        const headers = { "Content-Type": "application/json" }
        const int = setInterval(intervalFunction, 500)
        function intervalFunction() {
            fetch("/addUser", { method: "post", body, headers })
                .then(response => response.json())
                .then(
                    data => {
                        if (data == "") {
                            ui.sameLogin()
                        } else {
                            if (data.length == 1 || data.length == 2) {
                                if (data.length == 1) {
                                    userName = true
                                    body = JSON.stringify({ userName: userName })
                                    game.setColor("white")
                                    if (i == 0)
                                        ui.waitForSecondPlayer()
                                    i++
                                } else {
                                    game.setShips()
                                    ui.setShips()
                                    if (game.color != "white") {
                                        ui.topText(data[1], 2, data[0])
                                        //game.changeCamera()
                                        //ui.setFirstClock()
                                    } else {
                                        ui.topText(data[0], 1, data[1])
                                    }
                                    clearInterval(int)
                                }
                            } else {
                                ui.toMuchUsers()
                            }
                        }
                    }
                )
        }
    }

    resetFunction = () => {
        const headers = { "Content-Type": "application/json" }
        fetch(`/clearUserTab`, { method: "post", headers })
    }

    readyToBattle = (game) => {
        const ui = this.ui
        let i = 0
        const interval = setInterval(waitForSecondPlayer, 300)
        const body = JSON.stringify({ color: game.color, board: game.tab })
        const headers = { "Content-Type": "application/json" }
        function waitForSecondPlayer() {
            fetch(`/waitForStart`, { method: "post", body, headers })
                .then(response => response.json())
                .then(data => {
                    if (data != "") {
                        game.addBoards()
                        ui.battleStart()
                        clearInterval(interval)
                    } else {
                        if (i < 1)
                            ui.waitForSecondPlayer2()
                    }
                    i++
                })
        }
    }

    sendPlayerShips = (game) => {
        const body = JSON.stringify({ field: JSON.stringify(game.tab), fieldVal: JSON.stringify(game.tab2), color: game.color })
        const headers = { "Content-Type": "application/json" }
        fetch('/getPlayerShips', { method: "post", body, headers })
            .then(response => response.text())
            .then(data => {
                console.log(data)

            })
    }

    getWynik() {
        if (this.wynik != "") {
            return this.wynik
        }

    }

    //wysłanie strzału na serwer
    async sendPlayerShoot(xShoot, zShoot, color) {
        const body = JSON.stringify({ xCord: xShoot, zCord: zShoot, color: color })
        const headers = { "Content-Type": "application/json" }
        await fetch('/playerShoot', { method: "post", body, headers })
        // .then(response => response.text())
        // .then(data =>{
        //     console.log(data)
        //     this.wynik = data
        // })
    }
    //sprawdzenie strzału
    async getPlayerShoot() {
        const body = ""
        const response = await fetch("/checkShoot", { method: "post", body }) // fetch
        return await response.text()
    }
    //zmiana ruchu
    async changeTurn(color) {
        console.log(color)
        const body = JSON.stringify({ color: color })
        const headers = { "Content-Type": "application/json" }
        await fetch('/changeTurn', { method: "post", body, headers })
    }
    //sprawdzenie czyj ruch 
    async getTurn() {
        const body = ""
        const response = await fetch("/checkTurn", { method: "post", body }) // fetch
        return await response.text()
    }

    async checkWin(){
        const body = ""
        const response = await fetch('/checkWin', {method:'post', body})
        return await response.text()
    }

    getHistory = (ui) => {
        const headers = { "Content-Type": "application/json" }
        fetch(`/getHistory`, { method: "post", headers })
            .then(response => response.json())
            .then(data => {
                ui.createHistory(data)
            })
    }
}
export default Net