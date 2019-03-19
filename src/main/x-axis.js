import { Drawable } from './drawable'
import { formatValue } from '../utils'

export class XAxis extends Drawable {

    constructor (container, data, left, right, config = {}) {
        super(container, config)
        this.data = data
        this.linesCount = config.linesCount

        this.draw = this.draw.bind(this)

        this.changeRange(left, right)
    }

    getDefaultConfig () {
        return {
            textMargin: 16,
            chartPadding: 4
        }
    }

    initCanvas () {
        this.context.fillStyle = '#96A2AA'
        this.context.font = '24px Ubuntu'
        this.context.textAlign = 'center'
    }

    onResize () {
        super.resize()
        this.calculateRatio()
        this.animate(this.draw, 0)
    }

    calculateRatio () {
        this.ratio = this.canvas.width / (this.right - this.left)
    }

    draw () {
        this.clear()
        for (let i = 0; i < this.linesCount; i++) {
            const index = Math.round(this.left + i * this.step)
            const x = (i + 0.5) * this.step * this.ratio
            this.context.fillText(formatValue(this.data[index], this.config.formatOptions), x, this.getBottom());
        }
    }

    changeRange (left, right) {
        this.left = left
        this.right = right
        this.step = (right - left) / this.linesCount
        this.calculateRatio()
        this.animate(this.draw, 0)
    }
}
