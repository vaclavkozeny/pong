import { createNeonButton, createMenuContainer, createNeonHeading } from "../helpers/uiHelper"

export default class GameOverMenu {
    constructor(onRestart, onMainMenu) {
        this.container = createMenuContainer()
        this.container.style.zIndex = '103'

        this.title = createNeonHeading("", "#ffffff")
        this.container.appendChild(this.title)

        this.container.appendChild(createNeonButton("PLAY AGAIN", () => {
            this.hide()
            if (onRestart) onRestart()
        }, '#00ff00'))

        this.container.appendChild(createNeonButton("MAIN MENU", () => {
            this.hide()
            if (onMainMenu) onMainMenu()
        }, '#ffffff'))

        document.body.appendChild(this.container)
    }

    show(result, gameMode) {
        if (gameMode === 'AI') {
            if (result === 'PLAYER') {
                this.title.innerText = "VICTORY"
                this.title.style.color = '#00ff00'
                this.title.style.textShadow = '0 0 20px #00ff00'
            } else {
                this.title.innerText = "DEFEAT"
                this.title.style.color = '#ff0000'
                this.title.style.textShadow = '0 0 20px #ff0000'
            }
        } else {
            if (result === 'PLAYER') {
                this.title.innerText = "PLAYER 1 WINS"
                this.title.style.color = '#00ffff'
                this.title.style.textShadow = '0 0 20px #00ffff'
            } else {
                this.title.innerText = "PLAYER 2 WINS"
                this.title.style.color = '#ff00ff'
                this.title.style.textShadow = '0 0 20px #ff00ff'
            }
        }
        this.container.style.display = 'flex'
    }

    hide() { this.container.style.display = 'none' }
}