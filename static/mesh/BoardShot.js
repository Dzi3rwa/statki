class BoardShot extends THREE.Mesh {
    constructor(canClick, x, z, trafMat, pudloMat, endMat) {
        super()

        this.geometry = new THREE.BoxGeometry(10, 1, 10);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water2.jpg'),
            transparent: true,
            opacity: 0.3,
        });
        this.canClick = canClick
        this.x = x
        this.z = z
        this.pudlo = pudloMat
        this.traf = trafMat
        this.end = endMat
    }


    getBoard = () => {
        return this.container;
    }

    getClick = () => {
        return this.canClick
    }

    changeTraf() {
        this.material = this.traf
    }

    changePudlo() {
        this.material = this.pudlo
    }

    changeEnd() {
        this.material = this.end
    }

    setColor(color) {
        this.material.color.setHex(color)
    }
}

export default BoardShot