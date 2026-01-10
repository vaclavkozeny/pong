// src/components/SettingsMenu.js
import { createMenuContainer, createNeonHeading, createNeonButton } from "../helpers/uiHelper"

export default class SettingsMenu {
    constructor(settings, onBack) {
        this.settings = settings
        this.onBack = onBack

        this.container = createMenuContainer()
        this.container.style.zIndex = '102' 

        const title = createNeonHeading("SETTINGS", "#ffffff")
        this.container.appendChild(title)

        this.createLabel("AI DIFFICULTY")

        const difficultyContainer = document.createElement('div')
        Object.assign(difficultyContainer.style, {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px'
        })

        const slider = document.createElement('input')
        slider.type = 'range'
        slider.min = '1'
        slider.max = '10'
        slider.value = this.mapSpeedToVal(settings.aiSpeed)
        Object.assign(slider.style, {
            width: '300px',
            accentColor: '#ff00ff',
            cursor: 'pointer'
        })

        const diffValue = document.createElement('span')
        diffValue.innerText = this.getDiffText(slider.value)
        Object.assign(diffValue.style, {
            marginLeft: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            width: '150px',
            color: '#ff00ff',
            fontFamily: 'sans-serif'
        })

        slider.oninput = () => {
            const val = parseInt(slider.value)
            this.settings.aiSpeed = val * 0.02 + 0.01
            diffValue.innerText = this.getDiffText(val)
        }

        difficultyContainer.appendChild(slider)
        difficultyContainer.appendChild(diffValue)
        this.container.appendChild(difficultyContainer)


        this.createLabel("MAX SCORE (Goals to win)")

        const scoreInput = document.createElement('input')
        scoreInput.type = 'number'
        scoreInput.min = '1'
        scoreInput.max = '99'
        scoreInput.value = settings.maxScore
        Object.assign(scoreInput.style, {
            fontSize: '30px',
            padding: '10px',
            width: '100px',
            textAlign: 'center',
            backgroundColor: 'transparent',
            border: '2px solid #00ffff',
            color: 'white',
            marginBottom: '50px',
            borderRadius: '10px',
            fontFamily: 'sans-serif',
            outline: 'none'
        })

        scoreInput.onchange = () => {
            let val = parseInt(scoreInput.value)
            if (isNaN(val) || val < 1) val = 1
            if (val > 99) val = 99
            scoreInput.value = val
            this.settings.maxScore = val
        }
        this.container.appendChild(scoreInput)


        const backBtn = createNeonButton("BACK", () => {
            this.hide()
            if (this.onBack) this.onBack()
        }, '#ffffff')
        
        this.container.appendChild(backBtn)

        document.body.appendChild(this.container)
    }

    createLabel(text) {
        const label = document.createElement('div')
        label.innerText = text
        Object.assign(label.style, {
            fontSize: '18px',
            marginBottom: '10px',
            color: '#aaaaaa',
            fontFamily: 'sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '2px'
        })
        this.container.appendChild(label)
    }

    getDiffText(val) {
        val = parseInt(val)
        if (val <= 3) return "EASY"
        if (val <= 6) return "MEDIUM"
        if (val <= 8) return "HARD"
        return "IMPOSSIBLE"
    }

    mapSpeedToVal(speed) {
        return Math.round((speed - 0.01) / 0.02)
    }

    show() { this.container.style.display = 'flex' }
    hide() { this.container.style.display = 'none' }
}