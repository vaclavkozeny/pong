// src/components/PauseMenu.js
export default class PauseMenu {
    constructor(onContinue, onReturn) {
        this.onContinue = onContinue;
        this.onReturn = onReturn;

        this.container = document.createElement('div');
        Object.assign(this.container.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '101',
            backdropFilter: 'blur(3px)'
        });

        const title = document.createElement('h1');
        title.innerText = "PAUSED";
        Object.assign(title.style, {
            color: '#ffffff',
            fontFamily: 'Impact, sans-serif',
            fontSize: '60px',
            marginBottom: '40px',
            letterSpacing: '10px',
            textShadow: '0 0 10px #ffffff'
        });
        this.container.appendChild(title);

        this.createButton("CONTINUE", () => this.hideAndContinue());
        this.createButton("RETURN TO MAIN MENU", () => this.hideAndReturn());

        document.body.appendChild(this.container);
    }

    createButton(text, callback) {
        const btn = document.createElement('button');
        btn.innerText = text;
        Object.assign(btn.style, {
            padding: '15px 40px',
            fontSize: '20px',
            margin: '10px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: '#00ffff',
            border: '2px solid #00ffff',
            borderRadius: '5px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            minWidth: '300px',
            transition: 'all 0.2s'
        });

        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#00ffff';
            btn.style.color = '#000000';
            btn.style.boxShadow = '0 0 20px #00ffff';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#00ffff';
            btn.style.boxShadow = 'none';
        };
        btn.onclick = callback;
        this.container.appendChild(btn);
    }
    hideAndContinue() {
        this.hide();
        if (this.onContinue) this.onContinue();
    }
    hideAndReturn() {
        this.hide();
        if (this.onReturn) this.onReturn();
    }
    show() {
        this.container.style.display = 'flex';
    }
    hide() {
        this.container.style.display = 'none';
    }
    isVisible() {
        return this.container.style.display === 'flex';
    }
}