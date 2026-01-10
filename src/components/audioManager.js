import * as THREE from 'three'

export default class AudioManager {
    constructor(camera) {
        this.listener = new THREE.AudioListener()
        camera.add(this.listener)

        this.audioLoader = new THREE.AudioLoader()

        this.backgroundMusic = new THREE.Audio(this.listener)
        this.hitSound = new THREE.Audio(this.listener)
        this.scoreSound = new THREE.Audio(this.listener)

        this.loadSounds()
    }

    loadSounds() {
        this.audioLoader.load('sounds/music.mp3', (buffer) => {
            this.backgroundMusic.setBuffer(buffer)
            this.backgroundMusic.setLoop(true)
            this.backgroundMusic.setVolume(0.4)
        })

        this.audioLoader.load('sounds/hit.mp3', (buffer) => {
            this.hitSound.setBuffer(buffer)
            this.hitSound.setVolume(0.6)
        })

        this.audioLoader.load('sounds/score.mp3', (buffer) => {
            this.scoreSound.setBuffer(buffer)
            this.scoreSound.setVolume(0.8)
        })
    }

    playMusic() {
        if (this.backgroundMusic.buffer && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play()
        }
    }
    pauseMusic() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause()
        }
    }
    stopMusic() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop()
        }
    }

    playHit() {
        if (this.hitSound.buffer) {
            if (this.hitSound.isPlaying) this.hitSound.stop()
            this.hitSound.play()
        }
    }

    playScore() {
        if (this.scoreSound.buffer) {
            if (this.scoreSound.isPlaying) this.scoreSound.stop()
            this.scoreSound.play()
        }
    }
}