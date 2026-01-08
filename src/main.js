import * as THREE from "three";
import Stats from "stats.js"
import Ball from "./components/ball";
import Court, { COURT_CONFIG } from "./components/court";
import Paddle, { PADDLE_CONFIG } from "./components/paddle";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Menu from "./components/menu"
import PauseMenu from "./components/pauseMenu"
import AudioManager from "./components/audioManager";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let gameMode = 'AI'; 
let isGameRunning = false;

function resetGameFull() {
    score.player = 0;
    score.opponent = 0;
    update3DScore();

    const playerY = -COURT_CONFIG.height / 2 + PADDLE_CONFIG.height / 2 + 0.2;
    const opponentY = COURT_CONFIG.height / 2 - PADDLE_CONFIG.height / 2 - 0.2;
    
    playerPaddle.mesh.position.set(0, playerY, PADDLE_CONFIG.depth / 2);
    opponentPaddle.mesh.position.set(0, opponentY, PADDLE_CONFIG.depth / 2);

    resetBall();
}

// --- Main Menu ---
const menu = new Menu((selectedMode) => {
    console.log("Hra startuje v režimu:", selectedMode);
    gameMode = selectedMode;
	resetGameFull();
    isGameRunning = true;
    resetBall();
	audioManager.playMusic();
});
// --- Pause Menu ---
const pauseMenu = new PauseMenu(
    () => {
        isGameRunning = true;
		audioManager.playMusic();
    },
    () => {
        isGameRunning = false;
        resetGameFull();
        menu.show();
		audioManager.stopMusic();
    }
);
const scene = new THREE.Scene();

// --- Camera ---
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(0, 12, 20);
camera.lookAt(0, 0, 0);
const audioManager = new AudioManager(camera);
// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x202020);
document.body.appendChild(renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// --- Objects ---
const court = new Court();

const lights_positions = [
	{ x: -COURT_CONFIG.width / 2, y: -COURT_CONFIG.height / 2 },
	{ x: COURT_CONFIG.width / 2, y: -COURT_CONFIG.height / 2 },
	{ x: -COURT_CONFIG.width / 2, y: COURT_CONFIG.height / 2 },
	{ x: COURT_CONFIG.width / 2, y: COURT_CONFIG.height / 2 },
	{ x: -COURT_CONFIG.width / 2, y: 0 },
	{ x: COURT_CONFIG.width / 2, y: 0 }
];

lights_positions.forEach(pos => {
	const light = new THREE.PointLight(0xffaa00, 100);
	light.position.set(pos.x, pos.y, 3);
	court.mesh.add(light);
});

court.mesh.rotation.x = -Math.PI / 2;

// --- Paddles ---
const playerPaddle = new Paddle(0x00ffff);
playerPaddle.mesh.position.y = -COURT_CONFIG.height / 2 + PADDLE_CONFIG.height / 2 + 0.2;
court.mesh.add(playerPaddle.mesh);

const opponentPaddle = new Paddle(0xff00ff);
opponentPaddle.mesh.position.y = COURT_CONFIG.height / 2 - PADDLE_CONFIG.height / 2 - 0.2;
court.mesh.add(opponentPaddle.mesh);


scene.add(court.mesh);

// --- Ball ---
const ball = new Ball(0x00ff00);
court.mesh.add(ball.mesh);
ball.mesh.position.set(0, 0, 0.3);


// --- Logic ---
const PADDLE_SPEED = 0.3;
const BALL_RADIUS = 0.3;
const INITIAL_SPEED = 0.15;

// --- Score ---
const score = {
    player: 0,
    opponent: 0
};
let font = null;
let playerScoreMesh = null;
let opponentScoreMesh = null;
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (loadedFont) {
    font = loadedFont;
    update3DScore();
});
function createScoreMesh(text, x, y) {
    if (!font) return null;

    const geometry = new TextGeometry(text.toString(), {
        font: font,
        size: 2.5,
        depth: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5
    });

    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 4,
        metalness: 0,
        roughness: 0,
        transmission: 0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 1);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}
function update3DScore() {
    if (!font) return;
	let playerRotY = 0;
    let opponentRotY = 0;
    if (playerScoreMesh) {
		playerRotY = playerScoreMesh.rotation.y;
        court.mesh.remove(playerScoreMesh);
        playerScoreMesh.geometry.dispose();
        playerScoreMesh.material.dispose();
    }
    if (opponentScoreMesh) {
		opponentRotY = opponentScoreMesh.rotation.y;
        court.mesh.remove(opponentScoreMesh);
        opponentScoreMesh.geometry.dispose();
        opponentScoreMesh.material.dispose();
    }
    const posX = COURT_CONFIG.width / 2 + 4;
    playerScoreMesh = createScoreMesh(score.player, posX, -COURT_CONFIG.height / 2 + 2);
    opponentScoreMesh = createScoreMesh(score.opponent, posX, COURT_CONFIG.height / 2 - 2);
	playerScoreMesh.rotation.y = playerRotY;
    opponentScoreMesh.rotation.y = opponentRotY;
    court.mesh.add(playerScoreMesh);
    court.mesh.add(opponentScoreMesh);
}
// --- Ball logic ---
let ballVelocity = {
	x: INITIAL_SPEED,
	y: INITIAL_SPEED
};

function resetBall() {
	ball.mesh.position.set(0, 0, BALL_RADIUS);
	const directionY = Math.random() > 0.5 ? 1 : -1;
	const directionX = (Math.random() - 0.5) * 2;

	ballVelocity = {
		x: directionX * INITIAL_SPEED,
		y: directionY * INITIAL_SPEED
	};
}
function updateBall() {
	if (!isGameRunning) return;
	ball.mesh.position.x += ballVelocity.x;
	ball.mesh.position.y += ballVelocity.y;
	const wallLimit = (COURT_CONFIG.width / 2) - BALL_RADIUS;

	if (ball.mesh.position.x >= wallLimit) {
		ball.mesh.position.x = wallLimit;
		ballVelocity.x *= -1;
		audioManager.playHit();
	} else if (ball.mesh.position.x <= -wallLimit) {
		ball.mesh.position.x = -wallLimit;
		ballVelocity.x *= -1;
		audioManager.playHit();
	}

	// Pomocná funkce pro detekci kolize (AABB - Axis Aligned Bounding Box)
	const checkPaddleCollision = (paddle, signY) => {
		const dx = Math.abs(ball.mesh.position.x - paddle.mesh.position.x);
		const dy = Math.abs(ball.mesh.position.y - paddle.mesh.position.y);
		const hitX = (PADDLE_CONFIG.width / 2) + BALL_RADIUS;
		const hitY = (PADDLE_CONFIG.height / 2) + BALL_RADIUS;
		if (dx < hitX && dy < hitY) {
			if ((signY > 0 && ballVelocity.y > 0) || (signY < 0 && ballVelocity.y < 0)) {
				ballVelocity.y *= -1;
				ballVelocity.x *= 1.05;
				ballVelocity.y *= 1.05;
				audioManager.playHit();
			}
		}
	};
	checkPaddleCollision(opponentPaddle, 1);
	checkPaddleCollision(playerPaddle, -1);

	const goalLimit = COURT_CONFIG.height / 2 + 1;
	if (ball.mesh.position.y > goalLimit) {
        score.player++;
        update3DScore();
		audioManager.playScore();
        resetBall();
    } 
    else if (ball.mesh.position.y < -goalLimit) {
        score.opponent++;
        update3DScore();
		audioManager.playScore();
        resetBall();
    }
}

// --- Paddle logic ---
const keysPressed = {
	a: false, d: false,
	ArrowLeft: false, ArrowRight: false
};

window.addEventListener('keydown', (event) => {
	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = true;
	}
});

window.addEventListener('keyup', (event) => {
	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = false;
	}
});

function updatePaddles() {
	const limit = (COURT_CONFIG.width / 2) - (PADDLE_CONFIG.width / 2);
	if (keysPressed['a']) {
		playerPaddle.mesh.position.x -= PADDLE_SPEED;
	}
	if (keysPressed['d']) {
		playerPaddle.mesh.position.x += PADDLE_SPEED;
	}
	playerPaddle.mesh.position.x = Math.max(-limit, Math.min(limit, playerPaddle.mesh.position.x));
	if (gameMode === 'PVP') {
        if (keysPressed['ArrowLeft']) {
            opponentPaddle.mesh.position.x -= PADDLE_SPEED;
        }
        if (keysPressed['ArrowRight']) {
            opponentPaddle.mesh.position.x += PADDLE_SPEED;
        }
    } else {
        let targetX = ball.mesh.position.x;
        const aiSpeedFactor = 0.08; 
        
        opponentPaddle.mesh.position.x += (targetX - opponentPaddle.mesh.position.x) * aiSpeedFactor;
    }
	opponentPaddle.mesh.position.x = Math.max(-limit, Math.min(limit, opponentPaddle.mesh.position.x));
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (menu.container.style.display !== 'none') return;
        if (isGameRunning) {
            isGameRunning = false;
			audioManager.pauseMusic();
            pauseMenu.show();
        } 
        else if (pauseMenu.isVisible()) {
            pauseMenu.hideAndContinue();
        }
    }
});
const rotationSpeed = 0.01;
// --- Render loop ---
function animate() {
	stats.begin();
	requestAnimationFrame(animate);
	updatePaddles();
	updateBall();
	if (playerScoreMesh) {
        playerScoreMesh.rotation.y += rotationSpeed;
    }
    
    if (opponentScoreMesh) {
        opponentScoreMesh.rotation.y += rotationSpeed;
    }
	renderer.render(scene, camera);
	stats.end();
}

animate();


