import { EventAware } from '../common/event-aware'

export class Drawable extends EventAware {

    constructor (container, config = { }) {
        super(container)
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.container.appendChild(this.canvas)
        this.config = config
        this.clear = this.clear.bind(this)
        this.draw = this.draw.bind(this)
        this.resize()
    }

    draw (delta) {}

    initCanvas () {
        this.context.lineWidth = this.config.lineWidth
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    animateProperties (draw, properties, duration) {
        const start = performance.now();

        const currentValues = Object.keys(properties).reduce((result, property) => ({...result, [property]: this[property]}), {})
        const self = this

        requestAnimationFrame(function animate(time) {
            const delta = Math.min(Math.max((time - start) / duration, 0), 1)
            Object.keys(properties).forEach((property) => {
                self[property] = currentValues[property] + (properties[property] - currentValues[property]) * delta
            })
            draw(delta)
            if (delta < 1) {
                requestAnimationFrame(animate)
            }
        })
    }

    animate (draw, duration) {
        const start = performance.now();

        requestAnimationFrame(function animate(time) {
            const delta = Math.min(Math.max((time - start) / duration, 0), 1)
            draw(delta)
            if (delta < 1) {
                requestAnimationFrame(animate);
            }
        })
    }

    resize () {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientWidth * this.config.hToWRatio;
        this.initCanvas()
    }
}
