class Plane {
    constructor() {
        this.container = new THREE.Object3D();
        this.init()
    }
    init = () => {
        this.geometryPlane = new THREE.PlaneGeometry(1000, 1000)
        this.materialPlane = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../textures/water.jpg'),
            transparent: true,
            opacity: 0.5,
        })
        this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane)
        this.plane.rotation.x = Math.PI / 2
        this.container.add(this.plane);
    }
    getPlane = () => {
        return this.container;
    }
}

export default Plane