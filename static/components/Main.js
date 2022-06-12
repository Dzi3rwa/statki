import Game from "./Game.js"
import Net from "./Net.js"
import Ui from "./Ui.js"

let game
let net
let ui

window.onload = () => {
    net = new Net()
    game = new Game(net)
    ui = new Ui(game, net)
    ui.loginButtonClick(game, net, ui)
    ui.historyButton(net, ui)
    const snd = new Audio("../music/szanty.mp3");
    snd.loop = true
    snd.autoplay = true
}