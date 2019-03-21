import { EventAware } from '../common/event-aware'

export class Drawable extends EventAware {

    constructor (container, config = {}) {
        super(container)
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add(this.constructor.name.toLowerCase())
        this.context = this.canvas.getContext('2d')
        this.container.appendChild(this.canvas)
        this.config = Object.assign(this.getDefaultConfig(), config)
        this.animationStart = false
        this.animation = {}
        this.clear = this.clear.bind(this)
        this.draw = this.draw.bind(this)
        this.animateTick = this.animateTick.bind(this)
        this.resize()
    }

    getDefaultConfig () {return {}}

    draw (delta) {}

    initCanvas () {
        this.context.lineWidth = this.config.lineWidth
    }

    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    animateProperties (draw, properties, duration) {
        this.animation = {
            draw,
            start: performance.now(),
            duration,
            fromValues: Object.keys(properties).reduce((result, property) => ({
                ...result,
                [property]: this[property]
            }), {}),
            toValues: properties
        }

        if (!this.animationStart) {
            requestAnimationFrame(this.animateTick)
            this.animationStart = true
        }
    }

    animateTick (time) {
        const delta = Math.min(Math.max((time - this.animation.start) / this.animation.duration, 0), 1)
        Object.keys(this.animation.toValues).forEach((property) => {
            this[property] = this.animation.fromValues[property] + (this.animation.toValues[property] - this.animation.fromValues[property]) * delta
        })
        this.animation.draw(delta)
        if (delta < 1) {
            requestAnimationFrame(this.animateTick)
        } else {
            this.animationStart = false
        }
    }

    animate (draw, duration = 0) {
        const start = performance.now()

        requestAnimationFrame(function animate (time) {
            const delta = Math.min(Math.max((time - start) / duration, 0), 1)
            draw(delta)
            if (delta < 1) {
                requestAnimationFrame(animate)
            }
        })
    }

    getTop () {
        return this.config.paddingTop
    }

    getBottom () {
        return this.canvas.height - this.config.paddingBottom
    }

    resize () {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.drawableHeight = this.canvas.clientWidth * this.config.hToWRatio
        this.canvas.height = this.canvas.drawableHeight + this.config.paddingTop + this.config.paddingBottom
        this.initCanvas()
    }
}
