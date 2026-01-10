import * as THREE from "three"
import Stats from "stats.js"
import Ball from "./components/ball"
import Court, { COURT_CONFIG } from "./components/court"
import Paddle, { PADDLE_CONFIG } from "./components/paddle"
import Menu from "./components/menu/mainMenu"
import PauseMenu from "./components/menu/pauseMenu"
import AudioManager from "./components/audioManager"
import SettingsMenu from "./components/menu/settingsMenu"
import GameOverMenu from "./components/menu/gameOverMenu"
import ScoreBoard from "./components/scoreBoard"

/*
 * ==========================================================================
 * CONSTANTS & CONFIG
 * ==========================================================================
 */
const CAM_POS_AI = new THREE.Vector3(0, 12, 20)
const CAM_POS_PVP = new THREE.Vector3(0, 22, 0)

const PADDLE_SPEED = 0.3
const BALL_RADIUS = 0.3
const INITIAL_SPEED = 0.15

const SCORE_ROT_AI = Math.PI / 2
const SCORE_ROT_PVP = 0

/*
 * ==========================================================================
 * GLOBAL STATE
 * ==========================================================================
 */
let gameMode = 'AI' 
let isGameRunning = false
let cameraTarget = CAM_POS_AI.clone()
let scoreRotX = SCORE_ROT_AI
let targetScoreRotX = SCORE_ROT_AI

const gameSettings = {
    aiSpeed: 0.08,
    maxScore: 5
}
let ballVelocity = {
	x: INITIAL_SPEED,
	y: INITIAL_SPEED
}
const score = {
    player: 0,
    opponent: 0
}

/*
 * ==========================================================================
 * SCENE INITIALIZATION
 * ==========================================================================
 */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x202020)
document.body.appendChild(renderer.domElement)

/*
 * ==========================================================================
 * GAME OBJECTS
 * ==========================================================================
 */
const audioManager = new AudioManager(camera)
const court = new Court()
const scoreBoard = new ScoreBoard(court.mesh, COURT_CONFIG)

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


const lights_positions = [
	{ x: -COURT_CONFIG.width / 2, y: -COURT_CONFIG.height / 2 },
	{ x: COURT_CONFIG.width / 2, y: -COURT_CONFIG.height / 2 },
	{ x: -COURT_CONFIG.width / 2, y: COURT_CONFIG.height / 2 },
	{ x: COURT_CONFIG.width / 2, y: COURT_CONFIG.height / 2 },
	{ x: -COURT_CONFIG.width / 2, y: 0 },
	{ x: COURT_CONFIG.width / 2, y: 0 }
]

lights_positions.forEach(pos => {
	const light = new THREE.PointLight(0xffaa00, 100)
	light.position.set(pos.x, pos.y, 3)
	court.mesh.add(light)
})

court.mesh.rotation.x = -Math.PI / 2

// --- Paddles ---
const playerPaddle = new Paddle(0x00ffff)
playerPaddle.mesh.position.y = -COURT_CONFIG.height / 2 + PADDLE_CONFIG.height / 2 + 0.2
court.mesh.add(playerPaddle.mesh)

const opponentPaddle = new Paddle(0xff00ff)
opponentPaddle.mesh.position.y = COURT_CONFIG.height / 2 - PADDLE_CONFIG.height / 2 - 0.2
court.mesh.add(opponentPaddle.mesh)


scene.add(court.mesh)

// --- Ball ---
const ball = new Ball(0x00ff00)
court.mesh.add(ball.mesh)
ball.mesh.position.set(0, 0, 0.3)

/*
 * ==========================================================================
 * UI & MENUS
 * ==========================================================================
 */
const menu = new Menu(
    (selectedMode) => {
        gameMode = selectedMode
        if (gameMode === 'PVP') {
            cameraTarget.copy(CAM_POS_PVP)
            targetScoreRotX = SCORE_ROT_PVP
        } else {
            cameraTarget.copy(CAM_POS_AI)
            targetScoreRotX = SCORE_ROT_AI
        }

        resetGameFull()
        isGameRunning = true
        audioManager.playMusic()
    },
    () => {
        settingsMenu.show()
    }
)

const settingsMenu = new SettingsMenu(gameSettings, () => {
    menu.show()
})

const gameOverMenu = new GameOverMenu(
    () => {
        resetGameFull()
        isGameRunning = true
        audioManager.playMusic()
    },
    () => {
        resetGameFull()
        menu.show()
        audioManager.stopMusic()
        cameraTarget.copy(CAM_POS_AI) 
        targetScoreRotX = SCORE_ROT_AI
    }
)

const pauseMenu = new PauseMenu(
    () => {
        isGameRunning = true
		audioManager.playMusic()
    },
    () => {
        isGameRunning = false
        resetGameFull()
        menu.show()
		audioManager.stopMusic()
        cameraTarget.copy(CAM_POS_AI)
        targetScoreRotX = SCORE_ROT_AI
    }
)

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/*
 * ==========================================================================
 * GAME LOGIC
 * ==========================================================================
 */

function resetGameFull() {
    score.player = 0
    score.opponent = 0
    scoreBoard.update(score.player, score.opponent)

    const playerY = -COURT_CONFIG.height / 2 + PADDLE_CONFIG.height / 2 + 0.2
    const opponentY = COURT_CONFIG.height / 2 - PADDLE_CONFIG.height / 2 - 0.2
    
    playerPaddle.mesh.position.set(0, playerY, PADDLE_CONFIG.depth / 2)
    opponentPaddle.mesh.position.set(0, opponentY, PADDLE_CONFIG.depth / 2)

    resetBall()
}

function resetBall() {
	ball.mesh.position.set(0, 0, BALL_RADIUS)
	const directionY = Math.random() > 0.5 ? 1 : -1
	const directionX = (Math.random() - 0.5) * 2

	ballVelocity = {
		x: directionX * INITIAL_SPEED,
		y: directionY * INITIAL_SPEED
	}
}

function updateBall() {
	if (!isGameRunning) return
	ball.mesh.position.x += ballVelocity.x
	ball.mesh.position.y += ballVelocity.y
	const wallLimit = (COURT_CONFIG.width / 2) - BALL_RADIUS

	if (ball.mesh.position.x >= wallLimit) {
		ball.mesh.position.x = wallLimit
		ballVelocity.x *= -1
		audioManager.playHit()
	} else if (ball.mesh.position.x <= -wallLimit) {
		ball.mesh.position.x = -wallLimit
		ballVelocity.x *= -1
		audioManager.playHit()
	}

	// Pomocná funkce pro detekci kolize (AABB - Axis Aligned Bounding Box)
	const checkPaddleCollision = (paddle, signY) => {
		const dx = Math.abs(ball.mesh.position.x - paddle.mesh.position.x)
		const dy = Math.abs(ball.mesh.position.y - paddle.mesh.position.y)
		const hitX = (PADDLE_CONFIG.width / 2) + BALL_RADIUS
		const hitY = (PADDLE_CONFIG.height / 2) + BALL_RADIUS
		if (dx < hitX && dy < hitY) {
			if ((signY > 0 && ballVelocity.y > 0) || (signY < 0 && ballVelocity.y < 0)) {
				ballVelocity.y *= -1
				ballVelocity.x *= 1.05
				ballVelocity.y *= 1.05
				audioManager.playHit()
			}
		}
	}
	checkPaddleCollision(opponentPaddle, 1)
	checkPaddleCollision(playerPaddle, -1)

	const goalLimit = COURT_CONFIG.height / 2 + 1
	if (ball.mesh.position.y > goalLimit) {
        score.player++
        scoreBoard.update(score.player, score.opponent)
		audioManager.playScore()
        if (score.player >= gameSettings.maxScore) {
            endGame('PLAYER')
        } else {
            resetBall()
        }
    } 
    else if (ball.mesh.position.y < -goalLimit) {
        score.opponent++
        scoreBoard.update(score.player, score.opponent)
		audioManager.playScore()
        if (score.opponent >= gameSettings.maxScore) {
            endGame('OPPONENT')
        } else {
            resetBall()
        }
    }
}

function endGame(winner) {
    isGameRunning = false
    gameOverMenu.show(winner, gameMode)
}

/*
 * ==========================================================================
 * INPUT & EVENTS
 * ==========================================================================
 */
const keysPressed = {
	a: false, d: false,
	ArrowLeft: false, ArrowRight: false
}

window.addEventListener('keydown', (event) => {
	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = true
	}
})

window.addEventListener('keyup', (event) => {
	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = false
	}
})

function updatePaddles() {
	const limit = (COURT_CONFIG.width / 2) - (PADDLE_CONFIG.width / 2)
	if (keysPressed['a']) {
		playerPaddle.mesh.position.x -= PADDLE_SPEED
	}
	if (keysPressed['d']) {
		playerPaddle.mesh.position.x += PADDLE_SPEED
	}
	playerPaddle.mesh.position.x = Math.max(-limit, Math.min(limit, playerPaddle.mesh.position.x))
	if (gameMode === 'PVP') {
        if (keysPressed['ArrowLeft']) {
            opponentPaddle.mesh.position.x -= PADDLE_SPEED
        }
        if (keysPressed['ArrowRight']) {
            opponentPaddle.mesh.position.x += PADDLE_SPEED
        }
    } else {
        let targetX = ball.mesh.position.x
        const aiSpeedFactor = gameSettings.aiSpeed
        
        opponentPaddle.mesh.position.x += (targetX - opponentPaddle.mesh.position.x) * aiSpeedFactor
    }
	opponentPaddle.mesh.position.x = Math.max(-limit, Math.min(limit, opponentPaddle.mesh.position.x))
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (menu.container.style.display !== 'none') return
        if (isGameRunning) {
            isGameRunning = false
			audioManager.pauseMusic()
            pauseMenu.show()
        } 
        else if (pauseMenu.isVisible()) {
            pauseMenu.hideAndContinue()
        }
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

/*
 * ==========================================================================
 * ANIMATION LOOP
 * ==========================================================================
 */

function animate() {
	stats.begin()
	requestAnimationFrame(animate)
    camera.position.lerp(cameraTarget, 0.03)
    camera.lookAt(0, 0, 0)

    scoreRotX += (targetScoreRotX - scoreRotX) * 0.03
    scoreBoard.setRotationX(scoreRotX)

	updatePaddles()
	updateBall()
	scoreBoard.animate()
	renderer.render(scene, camera)
	stats.end()
}

animate()


