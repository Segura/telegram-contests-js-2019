import { Drawable } from './drawable'

export class YAxis extends Drawable {

    constructor (container, min, max, config = {}) {
        super(container, config)
        this.linesCount = config.linesCount

        this.draw = this.draw.bind(this)

        this.changeBounds(min, max)
    }

    getDefaultConfig () {
        return {
            textMargin: 16,
            chartPadding: 4
        }
    }

    initCanvas () {
        this.context.strokeStyle = '#F1F1F2'
        this.context.strokeWidth = 2
        this.context.fillStyle = '#96A2AA'
        this.context.font = '24px Ubuntu'
    }

    onResize () {
        super.resize()
        this.calculateRatio()
        this.animate(this.draw, 0)
    }

    calculateRatio () {
        this.ratio = this.canvas.height / (this.max - this.min)
    }

    draw () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.globalAlpha = this.alpha
        this.drawLine(this.canvas.height, '0')
        for (let i = 1; i < this.linesCount; i++) {
            const y = this.canvas.height - (i + this.direction) * this.step * this.ratio + this.offset
            this.drawLine(y, (Math.round(i * this.step)))
        }
        this.context.globalAlpha = 1 - this.alpha
        for (let i = 1; i < this.linesCount; i++) {
            const y = this.canvas.height - i * this.step * this.ratio - this.offset
            this.drawLine(y, (Math.round(i * this.oldStep)))
        }
    }

    drawLine (position, text) {
        this.context.beginPath();
        this.context.moveTo(0, position);
        this.context.lineTo(this.canvas.width, position);
        this.context.stroke();
        this.context.fillText(text.toString(), 0, position - this.config.textMargin);
    }

    changeBounds (min, max) {
        if (this.min === min && this.max === max) {
            return
        }
        this.direction = max > this.max ? 1 : -1
        this.offset = 0
        this.oldStep = this.step
        this.alpha = 0.5
        this.min = min
        this.max = max
        this.step = (max - min) / this.linesCount
        this.calculateRatio()
        this.animateProperties(this.draw, {
            'alpha': 1,
            'offset': this.direction * this.step * this.ratio
        }, 1000)
    }
}
