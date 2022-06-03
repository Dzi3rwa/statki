class Ship {
    constructor(width) {
        this.container = new THREE.Object3D();
        this.width = width
        this.init()
    }

    init = () => {
        this.geometry = new THREE.BoxGeometry(4, 10, this.width);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/ship.jpg'),
            transparent: true,
            opacity: 1,
        });
        this.ship = new THREE.Mesh(this.geometry, this.material);
        this.container.add(this.ship);
    }

    getShip = () => {
        return this.container;
    }

    setPosition = (x, y, z) => {
        this.container.children[0].position.set(x, y, z)
    }

    setName = (name) => {
        this.container.children[0].name = name
    }

}

export default Ship