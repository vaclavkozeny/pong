import { Mesh, MeshPhysicalMaterial, SphereGeometry, PointLight } from "three";

export default class Ball {
    constructor(color = 0xff0000) { 
        this.geometry = new SphereGeometry(0.3);
        this.material = new MeshPhysicalMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1, 
            roughness: 0,
            metalness: 0.2
        });
        this.mesh = new Mesh(this.geometry, this.material);
        const light = new PointLight(color, 100, 5);
        this.mesh.add(light);
    }
}