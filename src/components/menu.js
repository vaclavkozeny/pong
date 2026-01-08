export default class Menu {
    constructor(onStart) {
        this.onStart = onStart; 

        this.container = document.createElement('div');
        this.container.id = 'game-menu';

        Object.assign(this.container.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '100',
            backdropFilter: 'blur(5px)'
        });

        const title = document.createElement('h1');
        title.innerText = "NEON PONG 3D";
        Object.assign(title.style, {
            color: '#00ffff',
            fontFamily: 'Impact, sans-serif',
            fontSize: '80px',
            textShadow: '0 0 20px #00ffff, 0 0 50px #00ffff',
            marginBottom: '40px',
            letterSpacing: '5px'
        });
        this.container.appendChild(title);

        this.createButton("1 PLAYER (vs AI)", 'AI');
        this.createButton("2 PLAYERS (PvP)", 'PVP');

        document.body.appendChild(this.container);
    }

    createButton(text, mode) {
        const btn = document.createElement('button');
        btn.innerText = text;
        
        Object.assign(btn.style, {
            padding: '20px 50px',
            fontSize: '25px',
            margin: '15px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: '#ff00ff',
            border: '3px solid #ff00ff',
            borderRadius: '10px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 0 15px #ff00ff',
            transition: 'all 0.3s',
            textTransform: 'uppercase'
        });

        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#ff00ff';
            btn.style.color = 'white';
            btn.style.boxShadow = '0 0 30px #ff00ff';
            btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#ff00ff';
            btn.style.boxShadow = '0 0 15px #ff00ff';
            btn.style.transform = 'scale(1)';
        };

        btn.onclick = () => {
            this.hide();
            if (this.onStart) {
                this.onStart(mode);
            }
        };

        this.container.appendChild(btn);
    }

    hide() {
        this.container.style.display = 'none';
    }

    show() {
        this.container.style.display = 'flex';
    }
}