class Net {
    userLogin = (game, ui) => {
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
}
export default Net