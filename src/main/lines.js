import { Drawable } from './drawable'

export class Lines extends Drawable {

    constructor(container, lines) {
        super(container)
        this.lines = lines
        this.setArea(1, 100)
        window.requestAnimationFrame(() => this.draw())
    }

    calculateBounds () {
        let max = Number.MIN_SAFE_INTEGER
        let min = Number.MAX_SAFE_INTEGER

        this.lines.forEach((line) => {
            for (let i = this.left; i < this.right; i++) {
                const value = line.data[i]
                if (value > max) {
                    max = value
                } else if (value < min) {
                    min = value
                }
            }
        })

        this.max = max
        this.min = min
        this.ratio = this.canvas.height / (max - min)

        this.step = this.canvas.width / (this.right - this.left)
    }

    draw () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.lines.forEach((line) => {
            this.context.strokeStyle = line.color
            this.context.lineWidth = 3
            this.context.beginPath();

            this.context.moveTo(this.left, this.canvas.height - this.ratio * (line.data[this.left] - this.min))
            for (let i = this.left + 1; i < this.right; i += 1) {
                this.context.lineTo(i * this.step, this.canvas.height - this.ratio * (line.data[i] - this.min))
            }
            this.context.stroke()
        })
        window.requestAnimationFrame(() => this.draw())
    }

    setArea (left, right) {
        this.left = left
        this.right = right
        this.calculateBounds()
    }

    onResize() {
        super.resize()
        this.calculateBounds()
    }
}
