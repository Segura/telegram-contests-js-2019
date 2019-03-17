import { Drawable } from './drawable'

export class Lines extends Drawable {

    constructor(container, lines) {
        super(container)

        this.draw = this.draw.bind(this)

        this.lines = lines
        this.ratio = 0
        this.animate(this.draw, 0)
    }

    initCanvas () {
        this.context.lineWidth = 3
    }

    changeBounds (min, max) {
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

    changeRange (left, right) {
        this.left = left
        this.right = right
        this.step = this.canvas.width / (this.right - this.left)
        this.animate(this.draw, 300)
    }

    draw (delta = 1) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.lines.forEach((line) => {
            if (line.isVisible !== false) {
                this.context.strokeStyle = line.color
                this.context.beginPath();
                this.context.moveTo(0, this.canvas.height - this.ratio * (line.data[this.left] - this.min))
                for (let i = this.left + 1; i < this.right; i += 1) {
                    this.context.lineTo((i - this.left) * this.step, this.canvas.height - this.ratio * (line.data[i] - this.min))
                }
                this.context.stroke()
            }
        })
    }

    onResize() {
        super.resize()
        this.ratio = this.canvas.height / (this.max - this.min)
        this.step = this.canvas.width / (this.right - this.left)
        this.draw()
    }
}
