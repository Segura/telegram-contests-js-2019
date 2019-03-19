import { createContainer } from '../utils'
import { Lines } from '../main/lines'
import { Scope } from './scope'

export class Selector {

    constructor(parent, data, config = {}) {
        this.container = createContainer(parent, 'main-chart')

        this.x = data.xAxis
        this.y = data.yAxis
        this.left = 1
        this.right = data.xAxis.length - 1

        this.recalculateYBounds()
        this.config = Object.assign(Selector.DEFAULT_CONFIG, config, { maxX: this.x.length - 1 })

        this.lines = new Lines(this.container, this.y, this.config)
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)

        this.scope = new Scope(this.container, this.config)

        window.addEventListener('resize', this.onResize.bind(this))
        parent.addEventListener('seriaToggle', this.onToggleLine.bind(this), false)
    }

    static get DEFAULT_CONFIG() {
        return {
            hToWRatio: 0.1,
            lineWidth: 1,
            hPadding: 10,
        }
    }

    onResize() {
        this.scope.onResize()
        this.lines.onResize()
    }

    recalculateYBounds() {
        let max = Number.MIN_SAFE_INTEGER
        let min = Number.MAX_SAFE_INTEGER

        this.y.filter((line) => line.isVisible).forEach((line) => {
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
    }

    changeVisible(id, isVisible) {
        for (let i = 0; i < this.y.length; i++) {
            if (this.y[i].name === id) {
                this.y[i].isVisible = isVisible
                break
            }
        }
    }

    onToggleLine(e) {
        const { name, value } = e.detail
        this.changeVisible(name, value)
        this.recalculateYBounds()
        this.lines.changeBounds(this.min, this.max)
    }
}
