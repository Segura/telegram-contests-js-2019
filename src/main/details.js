import { Drawable } from './drawable'
import { Popup } from './popup'

export class Details extends Drawable {

    constructor (container, data, config = {}) {
        super(container, config)

        this.xAxis = data
        this.popup = new Popup(this.container, { ...this.config, header: 'Fri 20 Sep', lines: [], position: 0 })

        this.drawPoint = this.drawPoint.bind(this)
        this.hideDetails = this.hideDetails.bind(this)
        this.subscribe('showDetails', this.handleShowDetails.bind(this))
        this.subscribe('hideDetails', this.hideDetails)
        this.subscribe('mouseleave', this.hideDetails)
    }

    handleShowDetails (e) {
        const { x, lines } = e.detail
        this.x = x
        this.lines = lines
        this.draw()
    }

    draw () {
        this.clear()
        this.drawLine()
        this.lines.forEach(this.drawPoint)
        this.popup.setConfig({ ...this.config, header: 'Fri 20 Sep', lines: this.lines, position: this.x })
        this.popup.show()
    }

    hideDetails () {
        this.clear()
        this.popup.hide()
    }

    drawLine () {
        this.context.strokeStyle = 'rgba(200,200,200,0.25)'
        this.context.beginPath()
        this.context.moveTo(this.x, 0)
        this.context.lineTo(this.x, this.canvas.height)
        this.context.stroke()
    }

    drawPoint (line) {
        this.context.fillStyle = line.color
        this.context.beginPath()
        this.context.arc(this.x, line.value, 7, 0, 2 * Math.PI)
        this.context.fill()

        this.context.fillStyle = this.config.bgColor
        this.context.beginPath()
        this.context.arc(this.x, line.value, 5, 0, 2 * Math.PI)
        this.context.fill()
    }

    drawPopup () {
        this.context.strokeStyle = 'rgba(0,0,0,0.25)'
        this.context.shadowBlur = 5
        this.context.shadowColor = 'black'
        this.drawRect()
        this.context.stroke()

        this.context.shadowBlur = 0
        this.context.fillStyle = this.config.bgColor
        this.drawRect()
        this.context.fill()
    }

    drawRect () {
        let startX = Math.max(this.x - 25, 0)
        this.context.beginPath()
        this.context.moveTo(startX - 5, 0)
        this.context.lineTo(startX + 90, 0)
        this.context.arc(startX + 90, 5, 5, Math.PI * 1.5, 0)
        this.context.lineTo(startX + 95, 80)
        this.context.arc(startX + 90, 80, 5, 0, Math.PI / 2)
        this.context.lineTo(startX, 85)
        this.context.arc(startX - 5, 80, 5, Math.PI / 2, Math.PI)
        this.context.lineTo(startX - 10, 15)
        this.context.arc(startX - 5, 5, 5, Math.PI, Math.PI * 1.5)
    }
}
