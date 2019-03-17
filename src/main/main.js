import { Lines } from './lines'
import { XAxis } from './x-axis'
import { YAxis } from './y-axis'
import { createContainer } from '../utils'

import './main.css'

export class Main {

    constructor (parent, data, config = {}) {
        this.container = createContainer(parent, 'main-chart')
        this.x = data.xAxis
        this.y = data.yAxis

        this.left = 0
        this.right = 100

        this.recalculateYBounds()

        this.config = Object.assign(Main.DEFAULT_CONFIG, config)

        this.yAxis = new YAxis(this.container, this.min, this.max, this.config.linesCount)
        this.lines = new Lines(this.container, this.y)
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)

        window.addEventListener('resize', this.onResize.bind(this))

        parent.addEventListener('seriaToggle', this.onToggleLine.bind(this), false);
        parent.addEventListener('changeRange', this.onChangeRange.bind(this), false);
    }

    static get DEFAULT_CONFIG() {
        return {
            linesCount: 6
        }
    }

    onResize () {
        this.yAxis.onResize()
        this.lines.onResize()
    }

    onChangeRange (e) {
        const { start, end } = e.detail
        this.left = start
        this.right = end
        this.recalculateYBounds()
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)
    }

    recalculateYBounds () {
        let max = Number.MIN_SAFE_INTEGER
        let min = Number.MAX_SAFE_INTEGER

        this.y.forEach((line) => {
            if (line.isVisible !== false) {
                for (let i = this.left; i < this.right; i++) {
                    const value = line.data[i]
                    if (value > max) {
                        max = value
                    } else if (value < min) {
                        min = value
                    }
                }
            }
        })

        this.max = max
        this.min = min
    }

    onToggleLine (e) {
        const { name, value } = e.detail
        this.changeVisible(name, value)
        this.recalculateYBounds()
        this.lines.changeBounds(this.min, this.max)
    }

    changeVisible (id, isVisible) {
        for (let i = 0; i < this.y.length; i++) {
            if (this.y[i].name === id) {
                this.y[i].isVisible = isVisible
                break
            }
        }
    }
}
