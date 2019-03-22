import { Drawable } from '../main/drawable'
import { EventAware } from '../common/event-aware'

export class Scope extends Drawable {

    constructor(container, config) {
        super(container, 'scope', config)

        this.maxX = config.maxX

        this.initCanvas()

        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)

        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)

        this.subscribeToEvents()
        this.draw()
    }

    initCanvas() {
        this.scopeOptions = {
            clickX: 0,
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
            this.dragStart(this.getMouseX(e))
        } else {
            this.dragStop()
        }
    }

    handleTouchStart(e) {
        const x = this.getTouchX(e)
        this.setRestrictions(x)
        this.dragStart(x)
    }

    handleMouseUp() {
        this.dragStop()
    }

    handleTouchEnd () {
        this.dragStop()
    }

    handleMouseMove(e) {
        e.preventDefault()
        e.stopPropagation()
        this.checkBound(this.getMouseX(e))
        this.changeCursor()
    }

    handleTouchMove(e) {
        e.stopPropagation()
        this.checkBound(this.getTouchX(e))
    }

    changeCursor() {
        this.canvas.style.cursor = 'auto'
        if (this.scopeOptions.canDrag) {
            this.canvas.style.cursor = 'move'
        }
        if (this.scopeOptions.canResize) {
            this.canvas.style.cursor = 'ew-resize'
        }
    }

    checkBound(x) {
        const { shouldDrag, shouldResize, scopeStart, scopeEnd } = this.scopeOptions
        if ((x < 0 && scopeStart === this.getLeft()) || (x >= this.canvas.width && scopeEnd === this.getRight())) {
            return
        }
        this.setRestrictions(x)
        if (shouldDrag) {
            this.drag(x)
        } else if (shouldResize) {
            this.resizeScope(x)
        }
    }

    dragStart(x) {
        this.scopeOptions.clickX = x - this.scopeOptions.scopeStart
        this.scopeOptions.shouldDrag = this.scopeOptions.canDrag
        this.scopeOptions.shouldResize = this.scopeOptions.canResize
        this.scopeOptions.isLeftSide = x < this.scopeOptions.scopeStart + this.scopeOptions.vStrokeWidth
    }

    dragStop() {
        this.scopeOptions.shouldDrag = false
        this.scopeOptions.shouldResize = false
    }

    drag(x) {
        const { clickX, scopeStart, scopeEnd } = this.scopeOptions
        const size = scopeEnd - scopeStart
        let newStart = x - clickX
        if (newStart < 0) {
            newStart = 0
        }
        if (newStart + size > this.canvas.width) {
            newStart = this.canvas.width - size
        }
        const newEnd = newStart + size
        if (newStart !== scopeStart && newEnd !== scopeEnd) {
            this.scopeOptions.scopeStart = newStart
            this.scopeOptions.scopeEnd = newEnd
            this.draw()
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

    setRestrictions(x) {
        this.scopeOptions.canResize = !this.scopeOptions.canDrag && this.shouldResize(x)
        this.scopeOptions.canDrag = this.shouldDrag(x)
    }

    resizeScope(x) {
        const { scopeStart, scopeEnd, isLeftSide, vStrokeWidth } = this.scopeOptions
        let newStart = scopeStart
        let newEnd = scopeEnd
        if (isLeftSide) {
            newStart = Math.max(x, 0)
        } else {
            newEnd = Math.min(x, this.canvas.width)
        }
        if ((newStart !== scopeStart || newEnd !== scopeEnd) && newEnd > newStart + vStrokeWidth * 2) {
            this.scopeOptions.scopeStart = newStart
            this.scopeOptions.scopeEnd = newEnd
            this.draw()
        }
    }

    getMouseX(e) {
        return this.getLocalX(e.pageX)
    }

    getTouchX(e) {
        return this.getLocalX(e.targetTouches['0'].pageX)
    }

    getLocalX(x) {
        return x - this.canvas.parentNode.offsetLeft;
    }

    notifyChanges(config) {
        const ratio = this.maxX / this.canvas.width
        this.notify('changeRange', {
            start: Math.round(1 + ratio * config.scopeStart),
            end: Math.floor(ratio * config.scopeEnd)
        })
    }

    subscribeToEvents() {
        this.subscribe('mousedown', this.handleMouseDown)
        this.subscribe('touchstart', this.handleTouchStart)
        EventAware.subscribeTo(document, 'mousemove', this.handleMouseMove)
        EventAware.subscribeTo(document, 'touchmove', this.handleTouchMove)
        EventAware.subscribeTo(document, 'mouseup', this.handleMouseUp)
        EventAware.subscribeTo(document, 'touchend', this.handleTouchEnd)
        EventAware.subscribeTo(document, 'touchcancel', this.handleTouchEnd)
    }

    onResize() {
        super.resize()
        this.initCanvas()
        this.draw()
    }
}
