export class Drawable {

    constructor (container) {
        this.container = container
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.container.appendChild(this.canvas)
        this.resize()
    }

    draw () {}

    resize () {
        this.canvas.width  = this.container.offsetWidth
        this.canvas.height = this.canvas.width / 2;
    }
}
