import { Drawable } from './drawable'

export class Lines extends Drawable {

    constructor(container, lines, config = {}) {
        super(container, config)

        this.drawLine = this.drawLine.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.lines = lines
        this.ratio = 0
        this.linesOpacity = {}

        this.animate(this.draw)
    }

    changeBounds(min, max) {
        if (!this.min) {
            this.min = min
        }
        if (!this.max) {
            this.max = max
        }
        const ratio = this.canvas.drawableHeight / (max - min)
        this.animateProperties(
            this.draw,
            { min, max, ratio },
            300
        )
    }

    changeRange(left, right) {
        this.left = left
        this.right = right
        this.step = this.canvas.drawableWidth / (this.right - this.left)
        this.animate(this.draw)
    }

    draw() {
        this.clear()
        this.lines.forEach(this.drawLine)
    }

    drawLine(line) {
        const lineOpacity = this.linesOpacity[line.name]
        this.context.globalAlpha = isFinite(lineOpacity) ? lineOpacity : 1
        this.context.strokeStyle = line.color
        this.context.beginPath()
        this.context.moveTo(this.getLeft(), this.getBottom() - this.ratio * (line.data[this.left] - this.min))
        for (let i = this.left; i <= this.right; i++) {
            this.context.lineTo((i - this.left) * this.step + this.getLeft(), this.getBottom() - this.ratio * (line.data[i] - this.min))
        }
        this.context.stroke()
        this.context.globalAlpha = 1
    }

    getVisibleLines() {
        return this.lines.filter(line => line.isVisible)
    }

    setLineState(id, state) {
        const targetOpacity = state ? 0 : 1
        this.animate((delta) => {
            this.linesOpacity[id] = Math.abs(delta - targetOpacity)
            this.draw()
        }, 300)
    }

    onResize() {
        super.resize()
        this.ratio = this.canvas.drawableHeight / (this.max - this.min)
        this.config.paddingBottom = this.min * this.ratio
        this.step = this.canvas.drawableWidth / (this.right - this.left)
        this.draw()
    }

    handleMouseMove(e) {
        if (e.buttons === 0) {
            const index = Math.round((e.pageX - this.canvas.parentNode.offsetLeft) / this.step + this.left)
            if (index > this.right) {
                return
            }
            const detail = this.getVisibleLines().reduce((result, line) => {
                result.lines.push({
                    y: this.getBottom() - Math.round((line.data[index] - this.min) * this.ratio),
                    value: line.data[index],
                    color: line.color,
                    title: line.title
                })
                return result
            }, { lines: [], x: (index - this.left) * this.step + this.getLeft(), index, show: true })
            this.notify('toggleDetails', detail)
        }
    }

    handleMouseLeave() {
        this.notify('toggleDetails', { show: false })
    }
}
