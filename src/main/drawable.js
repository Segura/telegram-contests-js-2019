export class Drawable {

    constructor (container) {
        this.container = container
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.container.appendChild(this.canvas)
        this.resize()
    }

    draw (delta) {}

    initCanvas () {}

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
        this.canvas.width  = this.container.offsetWidth
        this.canvas.height = this.canvas.width / 2
        this.initCanvas()
    }
}
