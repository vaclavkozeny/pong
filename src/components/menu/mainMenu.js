import { createNeonButton, createMenuContainer, createNeonHeading } from "../helpers/uiHelper"

export default class Menu {
    constructor(onStart,onSettings) {
        this.onStart = onStart 

        this.container = createMenuContainer()
        this.container.style.display = 'flex'

        const title = createNeonHeading("NEON PONG 3D", "#00ffff")
        this.container.appendChild(title)

        this.container.appendChild(createNeonButton("1 PLAYER (vs AI)", () => {
            this.hide()
            onStart('AI')
        }))

        this.container.appendChild(createNeonButton("2 PLAYERS (PvP)", () => {
            this.hide()
            onStart('PVP')
        }, '#ff00ff'))

        this.container.appendChild(createNeonButton("SETTINGS", () => {
            this.hide()
            if (onSettings) onSettings()
        }, '#ffffff'))

        document.body.appendChild(this.container)
    }

    show() { this.container.style.display = 'flex' }
    hide() { this.container.style.display = 'none' }
}