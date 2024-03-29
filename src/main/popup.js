export class Popup {

    constructor (container, config) {
        this.container = container
        this.config = config
        this.popup = this.createPopup()
        this.init()
    }

    createPopup () {
        const popup = document.createElement('div')
        popup.classList.add('popup')
        this.container.appendChild(popup)
        return popup
    }

    setConfig (config) {
        this.config = config
        this.init()
    }

    init () {
        this.popup.innerHTML = `<h2 class="date">${this.config.header}</h2>`
        let popupData = '<div class="popup-data">'
        this.config.lines.forEach((line) => {
            popupData += `<div style="color: ${line.color}"><h5 class="label">${line.value}</h5><span class="value">${line.title}</span></div>`
        })
        this.popup.innerHTML += `${popupData}</div>`
        this.popup.style.fontSize = `${this.config.fontSize}px`
        this.popup.classList.add('hidden')
        this.popup.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('background-color')
        const x = Math.round(this.config.position.x - this.popup.getBoundingClientRect().width * this.config.ratio)
        const y = this.config.position.y - this.popup.getBoundingClientRect().height
        this.popup.style.transform = `translate(${x}px, calc(${y}px - 1em))`
    }

    show () {
        this.popup.classList.add('visible')
    }

    hide () {
        this.popup.classList.remove('visible')
    }
}
