import { Drawable } from './drawable'

export class YAxis extends Drawable {

    constructor (container, min, max, config = {}) {
        super(container, config)
        this.linesCount = config.linesCount

        this.draw = this.draw.bind(this)

        this.ratio = 0
        this.changeBounds(min, max)
    }

    getDefaultConfig () {
        return {
            textMargin: 16,
            chartPadding: 4
        }
    }

    initCanvas () {
        this.context.strokeStyle = 'rgba(200,200,200,0.8)'
        this.context.strokeWidth = 2
        this.context.fillStyle = 'rgba(150,162,170,0.7)'
        this.context.font = '24px Ubuntu'
    }

    onResize () {
        super.resize()
        this.calculateRatio()
        this.animate(this.draw)
    }

    calculateRatio () {
        this.ratio = this.canvas.drawableHeight / (this.max - this.min)
    }

    draw () {
        this.clear()
        this.context.globalAlpha = this.alpha
        for (let i = 0; i <= this.linesCount; i++) {
            const y = this.getBottom() - i * this.step * this.ratio
            this.drawLine(y, (Math.round(this.min + i * this.step)))
        }
        this.context.globalAlpha = 1 - this.alpha
        for (let i = 0; i <= this.linesCount; i++) {
            const y = this.getBottom() - i * this.oldStep * this.ratio
            this.drawLine(y, (Math.round(this.min + i * this.oldStep)))
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

        this.oldStep = this.step

        this.alpha = 0.5
        this.min = min
        this.max = max
        this.step = (max - min) / this.linesCount

        const newRatio = this.canvas.drawableHeight / (this.max - this.min)

        this.animateProperties(this.draw, {
            alpha: 1,
            ratio: newRatio
        }, 300)
    }
}
