import { formatValue } from '../utils'

import { Drawable } from './drawable'
import { Popup } from './popup'

export class Details extends Drawable {

    constructor(container, data, config = {}) {
        super(container, config)

        this.xAxis = data
        this.popup = new Popup(this.container, { ...this.config, header: '', lines: [], position: { x: 0, y: 0 } })

        this.drawPoint = this.drawPoint.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.toggle = this.toggle.bind(this)
        this.subscribe('toggleDetails', this.toggle)
    }

    show(e) {
        const { x, lines, index } = e.detail
        this.x = x
        this.lines = lines
        this.y = this.getMinY()
        this.index = index
        this.draw()
    }

    draw() {
        this.clear()
        this.drawLine()
        this.lines.forEach(this.drawPoint)
        this.popup.setConfig({
            ...this.config,
            header: formatValue(this.xAxis[this.index], this.config.formatOptions),
            lines: this.lines,
            ratio: this.x / this.canvas.drawableWidth,
            position: { x: this.x, y: this.y }
        })
        this.popup.show()
    }

    getMinY() {
        return this.lines.reduce((result, line) => {
            return Math.min(result, line.y)
        }, Number.MAX_SAFE_INTEGER)
    }

    hide() {
        this.clear()
        this.popup.hide()
    }

    toggle(e) {
        if (e.detail.show) {
            this.show(e)
        } else {
            this.hide()
        }
    }

    drawLine() {
        this.context.strokeStyle = 'rgba(200,200,200,0.25)'
        this.context.beginPath()
        this.context.moveTo(this.x, 0)
        this.context.lineTo(this.x, this.getBottom())
        this.context.stroke()
    }

    drawPoint(line) {
        const radius = 7

        this.drawCircle(line.color, this.x, line.y, radius)
        const bgColor = getComputedStyle(document.body).getPropertyValue('background-color')
        this.drawCircle(bgColor, this.x, line.y, radius - this.config.lineWidth)
    }

    drawCircle(color, x, y, radius) {
        this.context.fillStyle = color
        this.context.beginPath()
        this.context.arc(x, y, radius, 0, 2 * Math.PI)
        this.context.fill()
    }
}
