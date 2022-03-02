import * as THREE from 'three'
import Bar from './Bar'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Scene {
    constructor() {
        this.canvas = document.querySelector('canvas.webgl')

        //SCENE
        this.scene = new THREE.Scene()
        // this.scene.background = new THREE.Color(0x000000)

        //SIZES
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        //RENDERER
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        })

        //CAMERA
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            1,
            1000
        )
        this.camera.position.set(150, 100, 100)
        this.camera.updateProjectionMatrix()
        this.camera.lookAt(30, 0, 30)

        //Controls

        this.move = 0

        //Lights
        this.addLights()

        //Elements
        this.populate()

        //Raycaster
        this.raycaster = new THREE.Raycaster()

        //Pointer
        this.pointer = new THREE.Vector2()

        //Object currently selected by the raycaster
        this.currentObject = null

        this.clock = new THREE.Clock()
        this.handleResize()
        this.addRenderer()
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target = new THREE.Vector3(30, 0, 30)
        window.addEventListener('pointermove', (e) => this.onPointerMove(e))
        // this.controls.enableDamping = true
        this.addTick()
    }

    populate() {
        const group = new THREE.Group()
        const data = require('./../../data.json')

        const colors = [
            "#ffffff", 
            "#aaaaaa",
            "#333333",
            "#555555",
            "#444444",
            "#333333", 
            "#303030",
            "#202020",
            "#111111",
            "#0f0f0f",
            "#020202" 

        ]
        data.forEach((d, i) => {
            let h = Math.log(d.production) * 4
            h < 1 ? h = .5 : h = h
            let x = (i % 15) * 5.5
            const y = h / 2
            const z = (i / 15) * 5.5
            this.bar = new Bar(this.scene, h, d)
            const _this = this.bar
            _this.bar.position.set(x, y, z)

            //Consumption
            let n = Math.round(d.consumption / (colors.length - 1))
            n > 10 ? n = 10 : n = n
            const color = colors[n]
            _this.bar.material.color = new THREE.Color(color)
        })

        this.scene.add(group)
    }

    addLights() {
        const ambiantLight = new THREE.AmbientLight(
            new THREE.Color(0xffffff),
            0.1
        )

        const hemisphereLight = new THREE.HemisphereLight(
            0xffffff,
            0x000000,
            1
        )
        this.scene.add(ambiantLight, hemisphereLight)
    }

    addRenderer() {
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    addTick() {
        const elapsedTime = this.clock.getElapsedTime()

        this.controls.update()

        this.rayCasterAction()

        // Render
        this.renderer.render(this.scene, this.camera)
        this.renderer.outputEncoding = THREE.sRGBEncoding

        // Call tick again on the next frame
        window.requestAnimationFrame(this.addTick.bind(this))
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1
        this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1
    }

    handleResize() {
        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            // Update camera
            this.camera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    rayCasterAction() {
        document.addEventListener('mousemove', ()=> {
            // update the picking ray with the camera and pointer position
        this.raycaster.setFromCamera(this.pointer, this.camera)

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        if (intersects.length) {
            const el = intersects
            // el.forEach((_e)=> {
            //     _e.object.material.color = new THREE.Color(0xffffff)
            // })
            // el[0].object.material.color = new THREE.Color(0xD3B82A)
            this.currentObject = el[0].object.userData.object

        } else {
            this.currentObject = null
        }
        })
    }
}
