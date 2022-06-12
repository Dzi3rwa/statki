class Ui {
    constructor(game, net) {
        this.game = game
        this.net = net
        this.resetButtonClick(this.net)
        this.shipMouseDown(this.game)
        this.saveButton(this.game, this.net)
        this.rotateButton(this.game)
        this.backButton()
        this.windowResize()
    }

    windowResize = () => {
        window.addEventListener('resize', () => this.game.windowResize())
    }

    loginButtonClick = (game, net, ui) => {
        document.getElementById("buttonLogin").addEventListener("click", function () {
            net.userLogin(game, ui)
        })
    }

    resetButtonClick = (net) => {
        document.getElementById("buttonReset").addEventListener("click", function () {
            net.resetFunction()
        })
    }

    setShips = () => {
        const loginDiv = document.getElementById("login")
        const saveButton = document.getElementById("save")
        const saveRotate = document.getElementById("rotate")
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
        loginDiv.innerHTML = "Ustaw statki"
        saveButton.style.visibility = "visible"
        saveRotate.style.visibility = "visible"
    }

    toMuchUsers = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.innerHTML = "Brak możliwości zalogowania! Zbyt duża liczba graczy!"
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
    }

    topText = (nick, i, secondPlayer) => {
        const topDiv = document.getElementById("top")
        topDiv.innerHTML = `Witaj ${nick}<br/> Grasz przeciwko: ${secondPlayer}`
        topDiv.style.fontFamily = "Arial"
        topDiv.style.fontSize = "30px"
        topDiv.style.color = "white"
    }

    sameLogin = () => {
        const topDiv = document.getElementById("top")
        topDiv.innerHTML = `Taki login już istnieje`
        topDiv.style.fontFamily = "Arial"
        topDiv.style.fontSize = "30px"
        topDiv.style.color = "white"
    }

    waitForSecondPlayer = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.innerHTML = "Czekaj na drugiego gracza..."
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
        const load = document.createElement("div")
        load.classList.add("load")
        loginDiv.appendChild(load)
    }

    shipMouseDown = (game) => {
        window.addEventListener('mousedown', (e) => game.shipClick(e))
    }

    saveButton = (game, net) => {
        document.getElementById("save").addEventListener("click", () => {
            if (game.countBool) {
                const loginDiv = document.getElementById("login")
                const saveButton = document.getElementById("save")
                const saveRotate = document.getElementById("rotate")
                loginDiv.innerHTML = ""
                saveButton.style.visibility = "hidden"
                saveRotate.style.visibility = "hidden"
                net.readyToBattle(game)
                net.sendPlayerShips(game)
                game.endSets()
            }
        })
    }

    waitForSecondPlayer2 = () => {
        const loginDiv = document.getElementById("login")
        const waitDiv = document.getElementById("wait")
        waitDiv.style.visibility = "visible"
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
        loginDiv.innerHTML = "Czekaj na przeciwnika"
        const load = document.createElement("div")
        load.classList.add("load")
        loginDiv.appendChild(load)
    }

    battleStart = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.style.border = "none"
        loginDiv.innerHTML = ""
        const waitDiv = document.getElementById("wait")
        waitDiv.style.visibility = "hidden"
    }

    rotateButton = (game) => {
        document.getElementById("rotate").addEventListener("click", () => {
            game.shipRotate()
        })
    }

    historyButton = (net, ui) => {
        document.getElementById("buttonHistoria").addEventListener("click", () => {
            net.getHistory(ui)
            const loginDiv = document.getElementById("login")
            loginDiv.style.visibility = "hidden"
            const historyDiv = document.getElementById("history")
            historyDiv.style.visibility = "visible"
        })
    }

    backButton = () => {
        document.getElementById("buttonBack").addEventListener("click", () => {
            const loginDiv = document.getElementById("login")
            loginDiv.style.visibility = "visible"
            const historyDiv = document.getElementById("history")
            historyDiv.style.visibility = "hidden"
        })
    }

    createHistory = (data) => {

        const historyDiv = document.getElementById("smallHistory")
        let child = historyDiv.lastElementChild;
        while (child) {
            historyDiv.removeChild(child);
            child = historyDiv.lastElementChild;
        }

        for (let i = 0; i < data.length; i++) {
            const div = document.createElement("div")
            const div2 = document.createElement("div")
            const div3 = document.createElement("div")
            const div4 = document.createElement("div")
            const div5 = document.createElement("div")
            div.classList.add("smallDivHistory")
            div4.classList.add("div3")
            div3.classList.add("div3")
            const name1 = document.createElement("h3")
            const name2 = document.createElement("h3")
            div3.appendChild(name1)
            div3.appendChild(name2)
            name1.innerHTML = data[i].player1.name
            name2.innerHTML = data[i].player2.name
            historyDiv.appendChild(div)
            div.appendChild(div3)
            div.appendChild(div4)
            div4.appendChild(div2)
            div4.appendChild(div5)
            for (let j = 0; j < 10; j++) {
                const row = document.createElement("div")
                row.classList.add("row")
                for (let k = 0; k < 10; k++) {
                    const board = document.createElement("div")
                    if (data[i].player1.board[k][j] == 1)
                        board.classList.add("blue")
                    else
                        board.classList.add("white")
                    row.appendChild(board)
                }
                div2.appendChild(row)
            }
            for (let j = 0; j < 10; j++) {
                const row = document.createElement("div")
                row.classList.add("row")
                for (let k = 0; k < 10; k++) {
                    const board = document.createElement("div")
                    if (data[i].player2.board[k][j] == 1)
                        board.classList.add("blue")
                    else
                        board.classList.add("white")
                    row.appendChild(board)
                }
                div5.appendChild(row)
            }
        }
    }

    waitForTurn = () => {
        document.getElementById("waitForTurn").style.display = "block";
    }

    urTurn = () => {
        document.getElementById("waitForTurn").style.visibility = "none";
    }

}
export default Ui