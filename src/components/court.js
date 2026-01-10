import { Mesh, BoxGeometry, MeshPhysicalMaterial, Group } from "three"

export const COURT_CONFIG = {
    width: 20,
    height: 25,
    depth: 0.2,
    wallHeight: 1,
    wallThickness: 0.5,
    floorColor: 0xaaccff,
    wallColor: 0xff0000
}

export default class Court {
    constructor() {
        this.mesh = new Group()

        // --- Floor ---
        const floorGeometry = new BoxGeometry(
            COURT_CONFIG.width, 
            COURT_CONFIG.height, 
            COURT_CONFIG.depth
        )
        const floorMaterial = new MeshPhysicalMaterial({
            color: COURT_CONFIG.floorColor,
            transmission: 0.95, opacity: 1, roughness: 0, metalness: 0, thickness: 0.5, transparent: true
        })
        const floor = new Mesh(floorGeometry, floorMaterial)
        this.mesh.add(floor)

        // --- Wall ---
        const wallGeometry = new BoxGeometry(
            COURT_CONFIG.wallThickness,
            COURT_CONFIG.height,
            COURT_CONFIG.wallHeight
        )

        const wallMaterial = new MeshPhysicalMaterial({
            color: COURT_CONFIG.wallColor,
            transmission: 0.90, opacity: 1, roughness: 0, metalness: 0, thickness: 0.5, transparent: true
        })

        // Left wall
        const leftWall = new Mesh(wallGeometry, wallMaterial)
        leftWall.position.x = -COURT_CONFIG.width / 2
        leftWall.position.z = COURT_CONFIG.wallHeight / 2
        this.mesh.add(leftWall)

        // Right wall
        const rightWall = new Mesh(wallGeometry, wallMaterial)
        rightWall.position.x = COURT_CONFIG.width / 2
        rightWall.position.z = COURT_CONFIG.wallHeight / 2
        this.mesh.add(rightWall)
        
        this.mesh.position.z = -0.5
    }
}