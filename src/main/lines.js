import { Drawable } from './drawable'

export class Lines extends Drawable {

    constructor(container, lines, config = {}) {
        super(container, config)

        this.drawLine = this.drawLine.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)

        this.lines = lines
        this.ratio = 0

        this.animate(this.draw, 0)
    }

    changeBounds(min, max) {
        if (!this.min) {
            this.min = min
        }
        if (!this.max) {
            this.max = max
        }
        this.animateProperties(
            this.draw,
            { min, max, ratio: this.canvas.height / (max - min) },
            300
        )
    }

    changeRange(left, right) {
        this.left = left
        this.right = right
        this.step = this.canvas.width / (this.right - this.left)
        this.animate(this.draw, 300)
    }

    draw() {
        this.clear()
        this.getVisibleLines().forEach(this.drawLine)
    }

    drawLine(line) {
        this.context.strokeStyle = line.color
        this.context.beginPath()
        this.context.moveTo(0, this.canvas.height - this.ratio * (line.data[this.left] - this.min))
        for (let i = this.left; i <= this.right; i++) {
            this.context.lineTo((i - this.left) * this.step, this.canvas.height - this.ratio * (line.data[i] - this.min))
        }
        this.context.stroke()
    }

    getVisibleLines() {
        return this.lines.filter(line => line.isVisible)
    }

    onResize() {
        super.resize()
        this.ratio = this.canvas.height / (this.max - this.min)
        this.step = this.canvas.width / (this.right - this.left)
        this.draw()
    }

    handleMouseMove(e) {
        if (e) {
            const index = Math.round((e.pageX - this.canvas.parentNode.offsetLeft) / this.step + this.left)
            const detail = this.getVisibleLines().reduce((result, line) => {
                result.lines.push({
                    y: this.canvas.height - Math.round((line.data[index] - this.min) * this.ratio),
                    value: line.data[index],
                    color: line.color,
                    title: line.title
                })
                return result
            }, { lines: [], x: (index - this.left) * this.step, index })
            this.notify('showDetails', detail)
        }
    }
}
