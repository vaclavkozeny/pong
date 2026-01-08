import { Mesh, BoxGeometry, MeshPhysicalMaterial, PointLight } from "three";

export const PADDLE_CONFIG = {
    width: 4,
    height: 0.5,
    depth: 0.6,
    offset: 0.5,
    color: 0xffffff
};

export default class Paddle {
    constructor(color = PADDLE_CONFIG.color) {
        this.geometry = new BoxGeometry(
            PADDLE_CONFIG.width,
            PADDLE_CONFIG.height,
            PADDLE_CONFIG.depth
        );

        this.material = new MeshPhysicalMaterial({
            color: color,
            transmission: 0.5,
            opacity: 1,
            roughness: 0,
            metalness: 0.5,

            emissive: color,
            emissiveIntensity: 0.8
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.z = PADDLE_CONFIG.depth / 2;
    }
}