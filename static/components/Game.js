import Plane from "../mesh/Plane.js"
import Board from "../mesh/Board.js"
import Ship from "../mesh/Ship.js"

class Game {
    constructor() {
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
        this.render()
    }

    //render
    render = () => {
        TWEEN.update()
        if (this.Bool) {
            this.Bool = false
            this.setShipFunction()
        }
        if (this.setShipBool) {
            this.setShipFunction2()
        }
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
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
                                this.tab[this.lastI][this.lastJ] = 0
                                this.tab2[this.lastI][this.lastJ] = 0
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
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                    }
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
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab[this.lastI - 1][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI - 1][this.lastJ] = 0
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
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab[this.lastI + 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI + 1][this.lastJ] = 0
                                    }
                                    for (let i = -1; i < 2; i++) {
                                        for (let j = -2; j < 3; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab[this.lastI][this.lastJ - 1] = 0
                                    this.tab[this.lastI][this.lastJ + 1] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ - 1] = 0
                                    this.tab2[this.lastI][this.lastJ + 1] = 0
                                } else {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 2; i++) {
                                            for (let j = -2; j < 3; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab[this.lastI][this.lastJ + 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ + 1] = 0
                                    }
                                    for (let i = -2; i < 3; i++) {
                                        for (let j = -1; j < 2; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab[this.lastI - 1][this.lastJ] = 0
                                    this.tab[this.lastI + 1][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI - 1][this.lastJ] = 0
                                    this.tab2[this.lastI + 1][this.lastJ] = 0
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
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI - 2][this.lastJ] = 0
                                        this.tab[this.lastI - 1][this.lastJ] = 0
                                        this.tab[this.lastI + 1][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI - 2][this.lastJ] = 0
                                        this.tab2[this.lastI - 1][this.lastJ] = 0
                                        this.tab2[this.lastI + 1][this.lastJ] = 0
                                    }
                                    for (let i = -1; i < 2; i++) {
                                        for (let j = -2; j < 4; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab[this.lastI][this.lastJ - 2] = 0
                                    this.tab[this.lastI][this.lastJ - 1] = 0
                                    this.tab[this.lastI][this.lastJ + 1] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ - 2] = 0
                                    this.tab2[this.lastI][this.lastJ - 1] = 0
                                    this.tab2[this.lastI][this.lastJ + 1] = 0
                                } else {
                                    if (this.lastRot == true) {
                                        for (let i = -1; i < 2; i++) {
                                            for (let j = -2; j < 4; j++) {
                                                try {
                                                    this.tab[this.lastI - i][this.lastJ - j] = 0
                                                } catch { }
                                            }
                                        }
                                        this.tab[this.lastI][this.lastJ] = 0
                                        this.tab[this.lastI][this.lastJ - 2] = 0
                                        this.tab[this.lastI][this.lastJ - 1] = 0
                                        this.tab[this.lastI][this.lastJ + 1] = 0
                                        this.tab2[this.lastI][this.lastJ] = 0
                                        this.tab2[this.lastI][this.lastJ - 2] = 0
                                        this.tab2[this.lastI][this.lastJ - 1] = 0
                                        this.tab2[this.lastI][this.lastJ + 1] = 0
                                    }
                                    for (let i = -2; i < 4; i++) {
                                        for (let j = -1; j < 2; j++) {
                                            try {
                                                this.tab[this.lastI - i][this.lastJ - j] = 0
                                            } catch { }
                                        }
                                    }
                                    this.tab[this.lastI][this.lastJ] = 0
                                    this.tab[this.lastI - 2][this.lastJ] = 0
                                    this.tab[this.lastI - 1][this.lastJ] = 0
                                    this.tab[this.lastI + 1][this.lastJ] = 0
                                    this.tab2[this.lastI][this.lastJ] = 0
                                    this.tab2[this.lastI - 2][this.lastJ] = 0
                                    this.tab2[this.lastI - 1][this.lastJ] = 0
                                    this.tab2[this.lastI + 1][this.lastJ] = 0
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
                    this.tab[this.i][this.j] = 1
                    this.tab2[this.i][this.j] = 1
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i][this.j - 1] = 1
                        this.tab2[this.i][this.j] = 2
                        this.tab2[this.i][this.j - 1] = 2
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i - 1][this.j] = 1
                        this.tab2[this.i][this.j] = 2
                        this.tab2[this.i - 1][this.j] = 2
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i][this.j - 1] = 1
                        this.tab[this.i][this.j + 1] = 1
                        this.tab2[this.i][this.j] = 3
                        this.tab2[this.i][this.j - 1] = 3
                        this.tab2[this.i][this.j + 1] = 3
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i - 1][this.j] = 1
                        this.tab[this.i + 1][this.j] = 1
                        this.tab2[this.i][this.j] = 3
                        this.tab2[this.i - 1][this.j] = 3
                        this.tab2[this.i + 1][this.j] = 3
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i][this.j - 2] = 1
                        this.tab[this.i][this.j - 1] = 1
                        this.tab[this.i][this.j + 1] = 1
                        this.tab2[this.i][this.j] = 4
                        this.tab2[this.i][this.j - 2] = 4
                        this.tab2[this.i][this.j - 1] = 4
                        this.tab2[this.i][this.j + 1] = 4
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
                        this.tab[this.i][this.j] = 1
                        this.tab[this.i - 2][this.j] = 1
                        this.tab[this.i - 1][this.j] = 1
                        this.tab[this.i + 1][this.j] = 1
                        this.tab2[this.i][this.j] = 4
                        this.tab2[this.i - 2][this.j] = 4
                        this.tab2[this.i - 1][this.j] = 4
                        this.tab2[this.i + 1][this.j] = 4
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
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.boardItem = new Board()
                this.boardItem.setPosition((i - 5) * 10 + 5, 0, (j - 11) * 10 + 5)
                this.scene.add(this.boardItem.getBoard())
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