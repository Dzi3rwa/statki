import Plane from "../mesh/Plane.js"
import Board from "../mesh/Board.js"
import Ship from "../mesh/Ship.js"
import BoardShot from "../mesh/BoardShot.js"

class Game {
    constructor(net) {
        this.net = net
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.camera.position.set(0, 120, 250)
        this.camera.lookAt(this.scene.position)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x181818)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.color = "black" //jak w warcabach biały albo czarny
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
        this.Bool = false //czy mousedown
        this.clickBool = false //tez mousedown
        this.activeShip = "" //klikniety statek
        this.activeBoardTab = [] // tablica aktywnych pol (nie dziala jeszcze, wszystko sie podswietla)
        this.setShipBool = false //czy mozna ustawic statek
        this.shipLength = 0//długosc statku
        this.x
        this.y
        this.z
        this.lastRot = false
        this.rotation = true // rotatcja statku
        this.endSetsBool = false
        this.countBool = false
        this.enemyShootX = 0
        this.enemyShootZ = 0
        this.wynikStrzalu = ""
        this.bothReady = false //czy dwaj gracze są gotowi
        this.result = ""
        this.didWin = ""
        this.trafiony = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water2.jpg'),
            transparent: true,
            color: 0xFFFFFF,
            opacity: 0.3,
        });

        this.pudlo = this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water2.jpg'),
            transparent: true,
            color: 0x00FF00,
            opacity: 0.3,
        });

        this.end = this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water2.jpg'),
            transparent: true,
            color: 0x000000,
            opacity: 0.3,
        });

        this.boardTab = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ] //tablica pol planszy (przy tworzeniu zmienia sie an tablice obiektow)
        this.tab = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]//tablica glowna
        this.tab2 = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]//tablica glowna z podziałem na rodzaj statku
        document.getElementById("root").append(this.renderer.domElement)
        this.addWater()
        setInterval(this.sync.bind(this), 1000); //interwał do funckji sync
        this.render()
    }

    //funkcja w intervale do sprawdzania czyja tura i jej zmiana 
    sync = async () => {
        this.whosTurn(this.net)
        
        
        console.log(this.didWin)
        if (this.bothReady) {

            if (this.playerTurn != this.color && this.playerTurn != "") {
                document.getElementById("waitForTurn").style.visibility = "visible";
                
                this.camera.position.set(0, 120, 250)
            }
            else if (this.playerTurn == this.color && this.playerTurn != "") {
                document.getElementById("waitForTurn").style.visibility = "hidden";
                if(this.result == "BRAK TRAFIENIA"){
                   this.boardTab[this.enemyShootX][this.enemyShootZ].children[0].material.color.setHex(0x00ff00)
                }
                else if(this.result != "BRAK TRAFIENIA" && this.result != ""){
                    this.boardTab[this.enemyShootX][this.enemyShootZ].children[0].material.color.setHex(0x000000)
                }
                this.camera.position.set(0,120,120)
            }
        }

        if(this.didWin == this.color && this.didWin != ""){
            document.getElementById("waitForTurn").style.visibility = "visible";
            alert("WYGRAŁEŚ GRATULACJE!")
            this.playerTurn = ""
            //this.changeToLose(this.net)
        }
        else if(this.didWin != this.color && this.didWin != ""){
            document.getElementById("waitForTurn").style.visibility = "visible";
            alert("PRZEGRAŁEŚ!")
            this.playerTurn = ""
        }
        
    }

    whosTurn = async (net) => {
        let getData = JSON.parse(await net.getTurn())
        this.playerTurn = getData.nowTurn
        this.result = getData.result
        this.enemyShootX = getData.xshoot
        this.enemyShootZ = getData.zshoot
    }

    checkWin = async(net) =>{
        this.didWin = await net.checkWin()
    }

    changeToLose = async(net)=>{
        await net.changeTurn("LOSE")
    }

    // changeNotTurn = (ui) =>{
    //     ui.waitForTurn()
    // }

    // changeUrTurn = (ui) =>{
    //     ui.urTurn()
    // }

    //funkcja od strzelania 
    shotField = async (net) => {
        console.log(this.playerTurn, "+", this.color)
        if (this.playerTurn == this.color) {

            this.intersects = this.raycaster.intersectObjects(this.scene.children)

            let posShot = this.intersects

            if (posShot[0] !== undefined) {
                if (posShot[0].object.name != "statek" && posShot[0].object.name != "plansza") {
                    if (posShot[0].object.canClick == true) {
                        console.log(posShot[0].object.canClick)
                        console.log(posShot[0].object.x, posShot[0].object.z)
                        this.xShoot = posShot[0].object.x
                        this.zShoot = posShot[0].object.z
                        console.log(this.xShoot, this.zShoot, this.color)
                        await net.sendPlayerShoot(this.xShoot, this.zShoot, this.color)
                        this.wynikStrzalu = await net.getPlayerShoot()
                        console.log(this.wynikStrzalu)
                        posShot[0].object.canClick = false
                        if (this.wynikStrzalu != "") {
                            console.log(this.wynikStrzalu)
                            if (this.wynikStrzalu == "TRAFIENIE") {
                                //posShot[0].object.changeTraf()
                                posShot[0].object.setColor(0xff0000) //to nie działa kolory w matsach 
                                await net.changeTurn(this.color)
                                alert("TRAFIENIE " + this.xShoot + " " + this.zShoot)
                            } else if (this.wynikStrzalu == "ZESTRZELENIE1") {
                                //posShot[0].object.changeEnd()
                                posShot[0].object.setColor(0x990218)// to nie działa kolory w matsach 
                                await net.changeTurn(this.color)
                                alert("ZESTRZELENIE 1")
                            }
                            else if(this.wynikStrzalu == "ZESTRZELENIE2"){
                                posShot[0].object.setColor(0x990218)// to nie działa kolory w matsach 
                                await net.changeTurn(this.color)
                                alert("ZESTRZELENIE 2")
                            }
                            else if(this.wynikStrzalu == "ZESTRZELENIE3"){
                                posShot[0].object.setColor(0x990218)// to nie działa kolory w matsach 
                                await net.changeTurn(this.color)
                                alert("ZESTRZELENIE 3")
                            }
                            else if(this.wynikStrzalu == "ZESTRZELENIE4"){
                                posShot[0].object.setColor(0x990218)// to nie działa kolory w matsach 
                                await net.changeTurn(this.color)
                                alert("ZESTRZELENIE 4")
                            }
                            else {
                                posShot[0].object.changePudlo()
                                await net.changeTurn(this.color)
                                alert("PUDŁO " + this.xShoot + " " + this.zShoot)
                            }
                        }
                    }
                    //TU SPRAWDZAM WYGRANĄ
                    this.checkWin(this.net)
                    
                }
                //tu zmiana tury

            }
        }
        else if(this.playerTurn == "LOSE"){
            document.getElementById("waitForTurn").style.visibility = "visible";
            alert("PRZEGRAŁEŚ!")
            this.playerTurn = ""
        }
    }


    //render
    render = () => {
        TWEEN.update()
        if (this.Bool) {
            this.Bool = false
            if (!this.endSetsBool)
                this.setShipFunction()
            this.shotField(this.net)
        }
        if (this.setShipBool && !this.endSetsBool) {
            this.setShipFunction2()
        }
        this.allShipsSetCheck()
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }

    allShipsSetCheck = () => {
        let counter = 0
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.tab[i][j] == 1)
                    counter++
            }
        }
        if (counter != 20)
            this.countBool = false
        else
            this.countBool = true
    }

    //funkcja do ustawiania statkow
    setShipFunction = () => {
        this.intersects = this.raycaster.intersectObjects(this.scene.children)
        if (this.intersects.length > 0 && this.intersects[0].object.name == "statek") {
            if (this.activeShip != "") {
                this.activeShip.material.color.setHex(0xffffff)
                this.activeBoardTab.length = 0
                this.shipLength = 0
                this.rotation = true
            }
            this.activeShip = this.intersects[0].object
            if (this.activeShip.geometry.parameters.depth == 38)
                this.shipLength = 4
            else if (this.activeShip.geometry.parameters.depth == 28)
                this.shipLength = 3
            else if (this.activeShip.geometry.parameters.depth == 18)
                this.shipLength = 2
            else if (this.activeShip.geometry.parameters.depth == 8)
                this.shipLength = 1

            if (this.clickBool && this.activeShip != "") {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (this.tab[i][j] == 0) {
                            this.boardTab[i][j].children[0].material.color.setHex(0x00ff00)
                            this.activeBoardTab.push(this.boardTab[i][j].children[0])
                        }
                    }
                }
                this.intersects[0].object.material.color.setHex(0x92DFF3)
            }
        } else if (this.intersects.length > 0 && this.intersects[0].object.name == "plansza" && this.activeBoardTab.includes(this.intersects[0].object)) {
            this.y = this.intersects[0].object.position.y
            const rot = (this.activeShip.rotation.y / 1.57) % 2
            if (this.shipLength == 4 || this.shipLength == 2) {
                if (rot == 0) {
                    this.x = this.intersects[0].object.position.x
                    this.z = this.intersects[0].object.position.z - 5
                } else {
                    this.x = this.intersects[0].object.position.x + 5
                    this.z = this.intersects[0].object.position.z
                }
            } else {
                this.x = this.intersects[0].object.position.x
                this.z = this.intersects[0].object.position.z
            }

            if (this.shipLength == 2) {
                if (rot == 0 && this.z == 10)
                    this.z = 20
                if (rot == 1 && this.x == 50)
                    this.x = 40
            } else if (this.shipLength == 3) {
                if (rot == 0 && this.z == 15)
                    this.z = 25
                if (rot == 0 && this.z == 105)
                    this.z = 95
                if (rot == 1 && this.x == -45)
                    this.x = -35
                if (rot == 1 && this.x == 45)
                    this.x = 35
            } else if (this.shipLength == 4) {
                if (rot == 0 && this.z == 10)
                    this.z = 30
                if (rot == 0 && this.z == 100)
                    this.z = 90
                if (rot == 1 && this.x == -40)
                    this.x = -30
                if (rot == 1 && this.x == 50)
                    this.x = 30
            }

            this.setShipBool = true
        }
        this.clickBool = false
    }

    setShipFunction2 = () => {
        const z = this.activeShip.position.z
        const [X, Y, Z] = this.activeShip.position
        const tween = new TWEEN.Tween(this.activeShip.position)
            .to({ x: this.x, y: this.y, z: this.z }, 500)
            .onComplete(() => {
                //kod generujacy tablice
                const rot = (this.activeShip.rotation.y / 1.57) % 2
                this.i
                this.j
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (this.shipLength == 4 || this.shipLength == 2) {
                            if (rot == 0 && this.boardTab[i][j].children[0].position.x == this.x && this.boardTab[i][j].children[0].position.z == this.z + 5) {
                                this.i = i
                                this.j = j
                            } else if (rot == 1 && this.boardTab[i][j].children[0].position.x - 5 == this.x && this.boardTab[i][j].children[0].position.z == this.z) {
                                this.i = i
                                this.j = j
                            }
                        } else if (this.boardTab[i][j].children[0].position.x == this.x && this.boardTab[i][j].children[0].position.z == this.z) {
                            this.i = i
                            this.j = j
                        }
                    }
                }

                //zmiana pozycji juz ustawionego statku
                if (z != -30) {
                    this.lastI
                    this.lastJ
                    this.lastShipLength = this.shipLength

                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            if (this.lastShipLength == 4 || this.lastShipLength == 2) {
                                if (rot == 0 && this.boardTab[i][j].children[0].position.x == X && this.boardTab[i][j].children[0].position.z == Z + 5) {
                                    this.lastI = i
                                    this.lastJ = j
                                } else if (rot == 1 && this.boardTab[i][j].children[0].position.x == X + 5 && this.boardTab[i][j].children[0].position.z == Z) {
                                    this.lastI = i
                                    this.lastJ = j
                                } else if (rot == 0 && this.boardTab[i][j].children[0].position.x == X + 5 && this.boardTab[i][j].children[0].position.z == Z && this.lastRot == true) {
                                    this.lastI = i
                                    this.lastJ = j
                                } else if (rot == 1 && this.boardTab[i][j].children[0].position.x == X && this.boardTab[i][j].children[0].position.z == Z + 5 && this.lastRot == true) {
                                    this.lastI = i
                                    this.lastJ = j
                                }
                            } else if (this.boardTab[i][j].children[0].position.x == X && this.boardTab[i][j].children[0].position.z == Z) {
                                this.lastI = i
                                this.lastJ = j
                            }
                        }
                    }

                    if (this.lastI != undefined && this.lastJ != undefined) {
                        if (this.tab[this.lastI][this.lastJ] == 1) {
                            if (this.lastShipLength == 1) {
                                for (let i = -1; i < 2; i++) {
                                    for (let j = -1; j < 2; j++) {
                                        try {
                                            this.tab[this.lastI - i][this.lastJ - j] = 0
                                        } catch { }
                                    }
                                }
                                try {
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                } catch { }
                            } else if (this.lastShipLength == 2) {
                                if (rot == 0) {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 3; i++) {
                                            for (let j = -1; j < 2; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        try {
                                            this.tab[this.lastI][this.lastJ] = 0
                                            this.tab[this.lastI - 1][this.lastJ] = 0
                                            this.tab2[this.lastI][this.lastJ] = 0
                                            this.tab2[this.lastI - 1][this.lastJ] = 0
                                        } catch { }
                                    }
                                    for (let i = -1; i < 2; i++) {
                                        for (let j = -1; j < 3; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                    } catch { }

                                } else {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 2; i++) {
                                            for (let j = -1; j < 3; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                    }
                                    for (let i = -1; i < 3; i++) {
                                        for (let j = -1; j < 2; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                    } catch { }
                                }
                            } else if (this.lastShipLength == 3) {
                                if (rot == 0) {
                                    if (this.lastRot == true) {
                                        for (let i = -2; i < 3; i++) {
                                            for (let j = -1; j < 2; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        try {
                                            this.tab[this.lastI][this.lastJ] = 0
                                            this.tab[this.lastI - 1][this.lastJ] = 0
                                            this.tab[this.lastI + 1][this.lastJ] = 0
                                            this.tab2[this.lastI][this.lastJ] = 0
                                            this.tab2[this.lastI - 1][this.lastJ] = 0
                                            this.tab2[this.lastI + 1][this.lastJ] = 0
                                        } catch { }
                                    }
                                    for (let i = -1; i < 2; i++) {
                                        for (let j = -2; j < 3; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab[this.lastI][this.lastJ + 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ + 1] = 0
                                    } catch { }
                                } else {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 2; i++) {
                                            for (let j = -2; j < 3; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        try {
                                            this.tab[this.lastI][this.lastJ] = 0
                                            this.tab[this.lastI][this.lastJ - 1] = 0
                                            this.tab[this.lastI][this.lastJ + 1] = 0
                                            this.tab2[this.lastI][this.lastJ] = 0
                                            this.tab2[this.lastI][this.lastJ - 1] = 0
                                            this.tab2[this.lastI][this.lastJ + 1] = 0
                                        } catch { }
                                    }
                                    for (let i = -2; i < 3; i++) {
                                        for (let j = -1; j < 2; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab[this.lastI + 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI + 1][this.lastJ] = 0
                                    } catch { }
                                }
                            } else if (this.lastShipLength == 4) {
                                if (rot == 0) {
                                    if (this.lastRot == true) {
                                        for (let i = -2; i < 4; i++) {
                                            for (let j = -1; j < 2; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        try {
                                            this.tab[this.lastI][this.lastJ] = 0
                                            this.tab[this.lastI - 2][this.lastJ] = 0
                                            this.tab[this.lastI - 1][this.lastJ] = 0
                                            this.tab[this.lastI + 1][this.lastJ] = 0
                                            this.tab2[this.lastI][this.lastJ] = 0
                                            this.tab2[this.lastI - 2][this.lastJ] = 0
                                            this.tab2[this.lastI - 1][this.lastJ] = 0
                                            this.tab2[this.lastI + 1][this.lastJ] = 0
                                        } catch { }
                                    }
                                    for (let i = -1; i < 2; i++) {
                                        for (let j = -2; j < 4; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 2] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab[this.lastI][this.lastJ + 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 2] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ + 1] = 0
                                    } catch { }
                                } else {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 2; i++) {
                                            for (let j = -2; j < 4; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        try {
                                            this.tab[this.lastI][this.lastJ] = 0
                                            this.tab[this.lastI][this.lastJ - 2] = 0
                                            this.tab[this.lastI][this.lastJ - 1] = 0
                                            this.tab[this.lastI][this.lastJ + 1] = 0
                                            this.tab2[this.lastI][this.lastJ] = 0
                                            this.tab2[this.lastI][this.lastJ - 2] = 0
                                            this.tab2[this.lastI][this.lastJ - 1] = 0
                                            this.tab2[this.lastI][this.lastJ + 1] = 0
                                        } catch { }
                                    }
                                    for (let i = -2; i < 4; i++) {
                                        for (let j = -1; j < 2; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    try {
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 2][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab[this.lastI + 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 2][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI + 1][this.lastJ] = 0
                                    } catch { }
                                }
                            }
                        }
                    }
                }


                //generowanie tablicy w zaleznosci od dlugosci statku i rotacji
                if (this.shipLength == 1) {
                    //kratka odstępu między statkami oznaczona 2 w this.tab
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            try {
                                if (this.tab[this.i - i][this.j - j] != 1)
                                    this.tab[this.i - i][this.j - j] = 2
                            } catch { }
                        }
                    }

                    //w this.tab 1 oznacza statek
                    try {
                        this.tab[this.i][this.j] = 1
                        this.tab2[this.i][this.j] = 1
                    } catch { }
                } else if (this.shipLength == 2) {
                    if (rot == 0) {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 3; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i][this.j - 1] = 1
                            this.tab2[this.i][this.j] = 2
                            this.tab2[this.i][this.j - 1] = 2
                        } catch { }
                    } else {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -1; i < 3; i++) {
                            for (let j = -1; j < 2; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i - 1][this.j] = 1
                            this.tab2[this.i][this.j] = 2
                            this.tab2[this.i - 1][this.j] = 2
                        } catch { }
                    }
                } else if (this.shipLength == 3) {
                    if (rot == 0) {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -1; i < 2; i++) {
                            for (let j = -2; j < 3; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i][this.j - 1] = 1
                            this.tab[this.i][this.j + 1] = 1
                            this.tab2[this.i][this.j] = 3
                            this.tab2[this.i][this.j - 1] = 3
                            this.tab2[this.i][this.j + 1] = 3
                        } catch { }
                    } else {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -2; i < 3; i++) {
                            for (let j = -1; j < 2; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i - 1][this.j] = 1
                            this.tab[this.i + 1][this.j] = 1
                            this.tab2[this.i][this.j] = 3
                            this.tab2[this.i - 1][this.j] = 3
                            this.tab2[this.i + 1][this.j] = 3
                        } catch { }
                    }
                } else if (this.shipLength == 4) {
                    if (rot == 0) {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -1; i < 2; i++) {
                            for (let j = -2; j < 4; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i][this.j - 2] = 1
                            this.tab[this.i][this.j - 1] = 1
                            this.tab[this.i][this.j + 1] = 1
                            this.tab2[this.i][this.j] = 4
                            this.tab2[this.i][this.j - 2] = 4
                            this.tab2[this.i][this.j - 1] = 4
                            this.tab2[this.i][this.j + 1] = 4
                        } catch { }
                    } else {
                        //kratka odstępu między statkami oznaczona 2 w this.tab
                        for (let i = -2; i < 4; i++) {
                            for (let j = -1; j < 2; j++) {
                                try {
                                    if (this.tab[this.i - i][this.j - j] != 1)
                                        this.tab[this.i - i][this.j - j] = 2
                                } catch { }
                            }
                        }
                        //w this.tab 1 oznacza statek
                        try {
                            this.tab[this.i][this.j] = 1
                            this.tab[this.i - 2][this.j] = 1
                            this.tab[this.i - 1][this.j] = 1
                            this.tab[this.i + 1][this.j] = 1
                            this.tab2[this.i][this.j] = 4
                            this.tab2[this.i - 2][this.j] = 4
                            this.tab2[this.i - 1][this.j] = 4
                            this.tab2[this.i + 1][this.j] = 4
                        } catch { }
                    }
                }
                this.lastRot = false
                this.setShipBool = false
                this.activeShip.material.color.setHex(0xffffff)
                this.activeBoardTab.forEach(e => {
                    e.material.color.setHex(0xffffff)
                })
                this.activeBoardTab.length = 0
            })
        tween.start()
    }

    shipRotate = () => {
        if (this.activeShip != "") {
            if ((this.shipLength == 4 || this.shipLength == 2) && this.activeShip.position.z != -30)
                this.activeShip.material.color.setHex(0xff0000)
            this.activeShip.rotation.y += 1.57
            this.rotation = !this.rotation
            if (this.activeShip.position.z != -30) {
                this.setShipBool = true
                this.lastRot = true
                this.setShipFunction()
            }
        }
    }

    windowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    addWater = () => {
        this.plane = new Plane()
        this.scene.add(this.plane.getPlane())
    }

    endSets = () => {
        this.endSetsBool = true
        this.activeBoardTab.forEach(e => {
            e.material.color.setHex(0xffffff)
        })
        this.activeShip.material.color.setHex(0xffffff)
    }

    //tworzenie tablicy i statkow
    setShips = () => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.boardItem = new Board()
                this.boardItem.setPosition((i - 5) * 10 + 5, 0, (j + 1) * 10 + 5)
                this.boardItem.setName("plansza")
                this.boardItem.setColor("0xffffff")
                this.boardTab[i][j] = this.boardItem.getBoard()
                this.scene.add(this.boardItem.getBoard())
            }
        }
        for (let i = 0; i < 4; i++) {
            this.ship1 = new Ship(8)
            this.ship1.setPosition((i - 5) * 10 + 5, 0, -30)
            this.ship1.setName("statek")
            this.scene.add(this.ship1.getShip())
        }
        for (let i = 4; i < 7; i++) {
            this.ship2 = new Ship(18)
            this.ship2.setPosition((i - 5) * 10 + 5, 0, -30)
            this.ship2.setName("statek")
            this.scene.add(this.ship2.getShip())
        }
        for (let i = 7; i < 9; i++) {
            this.ship3 = new Ship(28)
            this.ship3.setPosition((i - 5) * 10 + 5, 0, -30)
            this.ship3.setName("statek")
            this.scene.add(this.ship3.getShip())
        }
        for (let i = 9; i < 10; i++) {
            this.ship4 = new Ship(38)
            this.ship4.setPosition((i - 5) * 10 + 5, 0, -30)
            this.ship4.setName("statek")
            this.scene.add(this.ship4.getShip())
        }
    }

    //tworzenie tablicy przeciwnika po ustawieniu statkow i kliknieciu save
    //po kliknieciu save trzeba usunac zawartosc sceny, wywolac addBoards i stworzyc statki
    //fajnie by wygladało jakby wyplywaly zza kamery 
    addBoards = () => {
        this.bothReady = true
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                window["field" + i + j] = new BoardShot(true, i, j, this.trafiony, this.pudlo)
                window["field" + i + j].position.set((i - 5) * 10 + 5, 0, (j - 11) * 10 + 5)
                this.scene.add(window["field" + i + j])
            }
        }
    }

    setColor = (color) => {
        this.color = color
    }

    //reycaster
    shipClick = (e) => {
        this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        this.clickBool = true
        this.Bool = true
    }
}
export default Game