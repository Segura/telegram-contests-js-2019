export class Popup {

    constructor (container, config) {
        this.container = container
        this.config = config
        this.popup = this.createPopup()
        this.init()
    }

    createPopup () {
        const popup = document.createElement('div')
        this.container.appendChild(popup)
        return popup
    }

    setConfig (config) {
        this.config = config
        this.init()
    }

    init () {
        this.popup.innerHTML = `<span>${this.config.header}</span>`
        this.config.lines.forEach((line) => {
            this.popup.innerHTML += `<div style="color: ${line.color}"><h5>${line.value}</h5><span>${line.title}</span></div>`
        })
        this.popup.classList.add('hidden')
        this.popup.style.backgroundColor = this.config.bgColor
        this.popup.style.left = `${Math.round(this.config.position)}px`
    }

    show () {
        this.popup.classList.add('visible')
    }

    hide () {
        this.popup.classList.remove('visible')
    }
}
