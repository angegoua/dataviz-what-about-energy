import * as THREE from 'three'

export default class Bar {
    constructor(_scene, _height, _object) {
        this.geometry = new THREE.BoxGeometry(5, _height, 5)
        this.material = new THREE.MeshStandardMaterial(0xffffff)
        this.material.side = THREE.DoubleSide
        this.bar = new THREE.Mesh(this.geometry, this.material)
        this.bar.userData.object = _object

        _scene.add(this.bar)
    }

    populate() {}
}
