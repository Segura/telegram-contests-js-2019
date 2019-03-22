import { Drawable } from './drawable'
import { formatValue } from '../utils'

export class XAxis extends Drawable {

    constructor (container, data, left, right, config = {}) {
        super(container, config)
        this.data = data
        this.linesCount = config.linesCount

        this.draw = this.draw.bind(this)
        this.draw2 = this.draw2.bind(this)

        this.ratio = 0
        this.offset = 0
        this.changeRange(left, right)
    }

    getDefaultConfig () {
        return {
            textMargin: 16,
            chartPadding: 4
        }
    }

    initCanvas () {
        this.context.fillStyle = 'rgba(150,162,170,0.7)'
        this.context.font = `${this.getFontSize()}px Ubuntu`
        this.context.textAlign = 'center'
    }

    onResize () {
        super.resize()
        this.calculateRatio()
        this.animate(this.draw)
    }

    calculateRatio () {
        this.ratio = this.canvas.drawableWidth / (this.right - this.left)
    }

    draw () {
        this.clear()
        this.context.globalAlpha = this.alpha
        for (let i = 0; i < this.linesCount; i++) {
            const index = Math.max(Math.floor(this.left + i * this.step), 1)
            const x = i * this.step * this.ratio + this.getLeft()
            this.context.fillText(formatValue(this.data[index], this.config.formatOptions), x, this.getBottom());
        }
        this.context.globalAlpha = 1 - this.alpha
        for (let i = 0; i < this.linesCount; i++) {
            const index = Math.max(Math.floor(this.left + i * this.oldStep), 1)
            const x = i * this.oldStep * this.ratio + this.getLeft()
            this.context.fillText(formatValue(this.data[index], this.config.formatOptions), x, this.getBottom());
        }
    }

    draw2 () {
        this.clear()
        this.context.globalAlpha = 1
        for (let i = 0; i < this.linesCount + 1; i++) {
            const index = Math.max(Math.floor(i * this.step + (Math.trunc((this.left + this.offset) / this.step) * this.step)), 1)
            const x = ((i * this.step - (this.left + this.offset) % this.step) * this.ratio + this.getLeft())
            this.context.fillText(formatValue(this.data[index], this.config.formatOptions), x, this.getBottom());
        }
    }

    changeRange (left, right) {
        if (this.left === left && this.right === right) {
            return
        }
        if (right - left === this.right - this.left) {
            this.offset = this.offset - (left - this.left)
            this.left = left
            this.right = right
            this.animateProperties(this.draw2, {
                alpha: 1,
                offset: 0
            }, 300)
        } else {
            this.oldStep = this.step
            this.alpha = 0.5
            this.left = left
            this.right = right
            this.step = (right - left) / this.linesCount
            const newRatio = this.canvas.drawableWidth / (this.right - this.left)

            this.animateProperties(this.draw, {
                alpha: 1,
                ratio: newRatio
            }, 300)
        }
    }
}
