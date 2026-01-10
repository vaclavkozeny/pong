// src/components/UI.js

export function createNeonButton(text, callback, color = '#00ffff') {
    const btn = document.createElement('button')
    btn.innerText = text
    Object.assign(btn.style, {
        padding: '15px 40px',
        fontSize: '24px',
        margin: '15px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: color,
        border: `3px solid ${color}`,
        borderRadius: '10px',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        boxShadow: `0 0 10px ${color}`,
        transition: 'all 0.3s',
        textTransform: 'uppercase',
        minWidth: '280px',
        textAlign: 'center'
    })
    btn.onmouseenter = () => {
        btn.style.backgroundColor = color
        btn.style.color = 'black'
        btn.style.boxShadow = `0 0 30px ${color}`
        btn.style.transform = 'scale(1.05)'
    }
    btn.onmouseleave = () => {
        btn.style.backgroundColor = 'transparent'
        btn.style.color = color
        btn.style.boxShadow = `0 0 10px ${color}`
        btn.style.transform = 'scale(1)'
    }
    btn.onclick = callback
    return btn
}
export function createMenuContainer() {
    const container = document.createElement('div')
    Object.assign(container.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '100',
        backdropFilter: 'blur(5px)'
    })
    return container
}
export function createNeonHeading(text, color = '#ffffff') {
    const title = document.createElement('h1')
    title.innerText = text
    Object.assign(title.style, {
        fontFamily: 'Impact, sans-serif',
        fontSize: '70px',
        marginBottom: '40px',
        color: color,
        letterSpacing: '8px',
        textShadow: `0 0 20px ${color}`,
        textAlign: 'center',
        textTransform: 'uppercase',
        marginTop: '0'
    })
    return title
}