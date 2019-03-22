import { Drawable } from '../main/drawable'
import { EventAware } from '../common/event-aware'

export class Scope extends Drawable {

    constructor(container, config) {
        super(container, 'scope', config)

        this.maxX = config.maxX

        this.initCanvas()

        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.releaseDrag = this.releaseDrag.bind(this)

        this.subscribeToEvents()
        this.draw()
    }

    initCanvas() {
        this.scopeOptions = {
            scopeStart: this.canvas.width / 3,
            scopeEnd: this.canvas.width / 2,
            vStrokeWidth: this.canvas.width / 150,
            canDrag: false,
            shouldDrag: false,
            canResize: false,
            shouldResize: false
        }
        this.scopeOptions.halfVStrokeWidth = this.scopeOptions.vStrokeWidth / 2
        this.scopeOptions.hStrokeWidth = this.scopeOptions.halfVStrokeWidth / 4
    }

    draw() {
        this.clear()
        const { scopeStart, scopeEnd, hStrokeWidth, halfVStrokeWidth, vStrokeWidth } = this.scopeOptions
        this.context.fillStyle = 'rgba(0,0,0,0.1)'
        this.context.fillRect(0, 0, scopeStart, this.canvas.height)

        this.context.strokeStyle = 'rgba(154,211,251,0.337)'
        this.context.beginPath()
        this.context.moveTo(scopeStart, 0)
        this.context.lineWidth = hStrokeWidth
        this.context.lineTo(scopeEnd - halfVStrokeWidth, 0)
        this.context.lineWidth = vStrokeWidth
        this.context.lineTo(scopeEnd - halfVStrokeWidth, this.canvas.height)
        this.context.lineWidth = hStrokeWidth
        this.context.lineTo(scopeStart + halfVStrokeWidth, this.canvas.height)
        this.context.lineWidth = vStrokeWidth
        this.context.lineTo(scopeStart + halfVStrokeWidth, 0)
        this.context.stroke()

        this.context.fillStyle = 'rgba(0,0,0,0.1)'
        this.context.fillRect(scopeEnd, 0, this.canvas.width, this.canvas.height)

        this.notifyChanges(this.scopeOptions)
    }

    handleMouseDown(e) {
        if (e.button === 0) {
            this.scopeOptions.shouldDrag = this.scopeOptions.canDrag
            this.scopeOptions.shouldResize = this.scopeOptions.canResize
            this.scopeOptions.isLeftSide = e.layerX < this.scopeOptions.scopeStart + this.scopeOptions.vStrokeWidth
            this.scopeOptions.resizeModifier = this.scopeOptions.isLeftSide ? -1 : 1
        } else {
            this.scopeOptions.shouldDrag = false
            this.scopeOptions.shouldResize = false
        }
    }

    shouldDrag(x) {
        const { scopeStart, scopeEnd, vStrokeWidth } = this.scopeOptions
        return (x > (scopeStart + vStrokeWidth)) && (x < (scopeEnd - vStrokeWidth))
    }

    shouldResize(x) {
        const { scopeStart, scopeEnd } = this.scopeOptions
        return x > scopeStart && x < scopeEnd
    }

    releaseDrag() {
        this.scopeOptions.shouldDrag = false
        this.scopeOptions.shouldResize = false
    }

    handleMouseMove(e) {
        const { shouldDrag, shouldResize, scopeStart, scopeEnd } = this.scopeOptions
        const mouseX = e.pageX - this.canvas.parentNode.offsetLeft
        e.preventDefault()
        e.stopPropagation()
        if ((mouseX < 0 && scopeStart === this.getLeft()) || (mouseX >= this.canvas.width && scopeEnd === this.getRight())) {
            return
        }
        this.scopeOptions.canDrag = this.shouldDrag(mouseX)
        this.scopeOptions.canResize = !this.scopeOptions.canDrag && this.shouldResize(mouseX)
        this.canvas.style.cursor = 'auto'
        if (this.scopeOptions.canDrag) {
            this.canvas.style.cursor = 'move'
        }
        if (this.scopeOptions.canResize) {
            this.canvas.style.cursor = 'ew-resize'
        }
        if (shouldDrag && e.movementX) {
            this.drag(e)
        }
        if (shouldResize && e.movementX) {
            this.resizeScope(e)
        }
    }

    drag(e) {
        const { scopeStart, scopeEnd } = this.scopeOptions
        let newStart = scopeStart + e.movementX
        let newEnd = scopeEnd + e.movementX
        if (newStart < 0) {
            newStart = 0
            newEnd = scopeEnd - scopeStart
        }
        if (newEnd > this.canvas.width) {
            newEnd = this.canvas.width
            newStart = newEnd - (scopeEnd - scopeStart)
        }
        if (newStart !== scopeStart && newEnd !== scopeEnd) {
            this.scopeOptions.scopeStart = newStart
            this.scopeOptions.scopeEnd = newEnd
            this.draw()
        }
    }

    resizeScope(e) {
        const { resizeModifier, scopeStart, scopeEnd, isLeftSide, vStrokeWidth } = this.scopeOptions
        let newStart = scopeStart
        let newEnd = scopeEnd
        if (isLeftSide) {
            newStart = scopeStart + e.movementX
            if (newStart < 0) {
                newStart = 0
            }
        } else {
            newEnd = scopeEnd + e.movementX * resizeModifier
            if (newEnd > this.canvas.width) {
                newEnd = this.canvas.width
            }
        }
        if ((newStart !== scopeStart || newEnd !== scopeEnd) && newEnd > newStart + vStrokeWidth * 2) {
            this.scopeOptions.scopeStart = newStart
            this.scopeOptions.scopeEnd = newEnd
            this.draw()
        }
    }

    notifyChanges(config) {
        const ratio = this.maxX / this.canvas.width
        this.notify('changeRange', {
            start: Math.round(1 + ratio * config.scopeStart),
            end: Math.round(ratio * config.scopeEnd)
        })
    }

    subscribeToEvents() {
        this.subscribe('mousedown', this.handleMouseDown)
        EventAware.subscribeTo(document, 'mousemove', this.handleMouseMove)
        EventAware.subscribeTo(document, 'mouseup', this.releaseDrag)
    }

    onResize() {
        super.resize()
        this.initCanvas()
        this.draw()
    }
}
