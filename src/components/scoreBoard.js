import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { COURT_CONFIG } from './court'

export default class ScoreBoard {
    constructor(sceneToAdd) {
        this.parent = sceneToAdd
        this.config = COURT_CONFIG
        
        this.font = null
        this.playerMesh = null
        this.opponentMesh = null

        const loader = new FontLoader()
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (loadedFont) => {
            this.font = loadedFont
            this.update(0, 0) 
        })
    }

    createMesh(text, x, y) {
        if (!this.font) return null

        const geometry = new TextGeometry(text.toString(), {
            font: this.font,
            size: 2.5,
            depth: 0.3,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 5
        })

        geometry.center()

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 4,
            metalness: 0,
            roughness: 0,
            transmission: 0
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 1)
        mesh.rotation.x = Math.PI / 2 

        return mesh
    }

    update(playerScore, opponentScore) {
        if (!this.font) return

        let playerRotY = 0
        let opponentRotY = 0
        let currentRotX = Math.PI / 2

        if (this.playerMesh) {
            playerRotY = this.playerMesh.rotation.y
            currentRotX = this.playerMesh.rotation.x
            
            this.parent.remove(this.playerMesh)
            this.playerMesh.geometry.dispose()
            this.playerMesh.material.dispose()
        }
        if (this.opponentMesh) {
            opponentRotY = this.opponentMesh.rotation.y
            this.parent.remove(this.opponentMesh)
            this.opponentMesh.geometry.dispose()
            this.opponentMesh.material.dispose()
        }

        const posX = this.config.width / 2 + 4
        const playerY = -this.config.height / 2 + 2
        const opponentY = this.config.height / 2 - 2

        this.playerMesh = this.createMesh(playerScore, posX, playerY)
        this.opponentMesh = this.createMesh(opponentScore, posX, opponentY)

        if (this.playerMesh) {
            this.playerMesh.rotation.y = playerRotY
            this.playerMesh.rotation.x = currentRotX
            this.parent.add(this.playerMesh)
        }
        if (this.opponentMesh) {
            this.opponentMesh.rotation.y = opponentRotY
            this.opponentMesh.rotation.x = currentRotX
            this.parent.add(this.opponentMesh)
        }
    }

    animate() {
        const rotationSpeed = 0.02

        if (this.playerMesh) {
            this.playerMesh.rotation.y += rotationSpeed
        }
        if (this.opponentMesh) {
            this.opponentMesh.rotation.y += rotationSpeed
        }
    }
    
    setRotationX(angle) {
        if (this.playerMesh) this.playerMesh.rotation.x = angle
        if (this.opponentMesh) this.opponentMesh.rotation.x = angle
    }
}