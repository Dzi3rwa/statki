class Board {
    constructor() {
        this.container = new THREE.Object3D();
        this.init()
    }

    init = () => {
        this.geometry = new THREE.BoxGeometry(10, 1, 10);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water2.jpg'),
            transparent: true,
            opacity: 0.3,
        });
        this.item = new THREE.Mesh(this.geometry, this.material);
        this.container.add(this.item);
    }

    getBoard = () => {
        return this.container;
    }

    setColor = (color) => {
        this.container.children[0].material.color.setHex(color)
    }

    setPosition = (x, y, z) => {
        this.container.children[0].position.set(x, y, z)
    }

    setName = (name) => {
        this.container.children[0].name = name
    }
}

export default Board