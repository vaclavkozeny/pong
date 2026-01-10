import { createNeonButton, createMenuContainer, createNeonHeading } from "../helpers/uiHelper"

export default class PauseMenu {
    constructor(onContinue, onReturn) {
        this.onContinue = onContinue
        this.onReturn = onReturn

        this.container = createMenuContainer()
        this.container.style.zIndex = '101'

        const title = createNeonHeading("PAUSED", "#ffffff")
        this.container.appendChild(title)

        this.container.appendChild(createNeonButton("CONTINUE", () => {
            this.hide()
            if (onContinue) onContinue()
        }, '#00ffff'))

        this.container.appendChild(createNeonButton("RETURN TO MENU", () => {
            this.hide()
            if (onReturn) onReturn()
        }, '#ff5555'))

        document.body.appendChild(this.container)
    }
    show() { this.container.style.display = 'flex' }
    hide() { this.container.style.display = 'none' }
    isVisible() { return this.container.style.display === 'flex' }
}