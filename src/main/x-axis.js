import { Drawable } from './drawable'
import { formatValue } from '../utils'

export class XAxis extends Drawable {

    constructor (container, data, left, right, config = {}) {
        super(container, 'xaxis', config)
        this.data = data
        this.linesCount = config.linesCount

        this.draw = this.draw.bind(this)

        this.ratio = 0
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
        for (let i = -0.5; i <= this.linesCount; i++) {
            const index = Math.max(Math.floor(i * this.step + (Math.trunc(this.left / this.step) * this.step)), 1)
            const x = ((i * this.step - this.left % this.step) * this.ratio + this.getLeft())
            this.context.fillText(formatValue(this.data[index], this.config.formatOptions), x, this.getBottom());
        }
    }

    changeRange (left, right) {
        if (this.left === left && this.right === right) {
            return
        }
        this.left = left
        this.right = right
        this.step = (right - left) / this.linesCount
        this.ratio = this.canvas.drawableWidth / (this.right - this.left)

        this.draw()
    }
}
