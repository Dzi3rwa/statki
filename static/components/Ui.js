class Ui {
    constructor(game, net) {
        this.game = game
        this.net = net
        this.resetButtonClick(this.net)
        this.shipMouseDown(this.game)
        this.saveButton(this.game)
        this.rotateButton(this.game)
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
        if (i == 1)
            topDiv.innerHTML = `Witaj ${nick}, grasz białymi <br/> Grasz przeciwko: ${secondPlayer}`
        else
            topDiv.innerHTML = `Witaj ${nick}, grasz czarnymi <br/> Grasz przeciwko: ${secondPlayer}`
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

    saveButton = (game) => {
        document.getElementById("save").addEventListener("click", () => {
            const loginDiv = document.getElementById("login")
            const saveButton = document.getElementById("save")
            const saveRotate = document.getElementById("rotate")
            loginDiv.innerHTML = ""
            saveButton.style.visibility = "hidden"
            saveRotate.style.visibility = "hidden"
            game.addBoards()
        })
    }

    rotateButton = (game) => {
        document.getElementById("rotate").addEventListener("click", () => {
            game.shipRotate()
        })
    }
}
export default Ui