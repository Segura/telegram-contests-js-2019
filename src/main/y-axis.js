import { Drawable } from './drawable'

export class YAxis extends Drawable{

    constructor (container, min, max, linesCount) {
        super(container)
        this.min = min
        this.max = max
        this.linesCount = linesCount
        this.step = (max - min) / linesCount
        this.calculateRatio()

        this.context.strokeStyle = '#F2F4F5'
        this.context.strokeWidth = 1
        this.context.fillStyle = '#96A2AA'
        this.context.font = '30px Ubuntu'

        window.requestAnimationFrame(() => this.draw())
    }

    onResize () {
        super.resize()
        this.calculateRatio()
    }

    calculateRatio () {
        this.ratio = this.canvas.height / (this.max - this.min)
    }

    draw () {
        for (let i = 0; i < this.linesCount; i++) {
            const y = this.canvas.height - i * this.step * this.ratio
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
            this.context.stroke();

            this.context.fillText(i * this.step, 0, y - 10);
        }
        window.requestAnimationFrame(() => this.draw())
    }
}
