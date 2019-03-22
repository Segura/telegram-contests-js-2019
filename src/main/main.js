import { Lines } from './lines'
import { XAxis } from './x-axis'
import { YAxis } from './y-axis'
import { Details } from './details'
import { createContainer } from '../utils'

import './main.css'

export class Main {

    constructor(parent, data, config = {}) {
        this.container = createContainer(parent, 'main-chart')
        this.x = data.xAxis
        this.y = data.yAxis

        this.left = 1
        this.right = this.x.length - 1

        this.recalculateYBounds()

        this.config = Object.assign(Main.DEFAULT_CONFIG, config)

        this.xAxis = new XAxis(this.container, this.x, this.left, this.right, this.config)
        this.yAxis = new YAxis(this.container, this.min, this.max, this.config)

        this.lines = new Lines(this.container, this.y, this.config)
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)
        this.lines.subscribe('mousemove', this.lines.handleMouseMove)
        this.lines.subscribe('mouseleave', this.lines.handleMouseLeave)

        this.details = new Details(this.container, this.x, this.config)

        window.addEventListener('resize', this.onResize.bind(this))

        parent.addEventListener('seriaToggle', this.onToggleLine.bind(this), false)
        parent.addEventListener('changeRange', this.onChangeRange.bind(this), false)
    }

    static get DEFAULT_CONFIG() {
        return {
            linesCount: 4,
            hToWRatio: 0.25,
            lineWidth: 3,
            padding: {
                top: 40,
                bottom: 20,
                left: 0,
                right: 0
            },
            formatOptions: {
                locale: navigator.language,
                options: {
                    weekday: 'short', month: 'short', day: 'numeric'
                }
            },
            fontSizeRatio: 1.8,
            minFontSize: 12,
            maxFontSize: 22
        }
    }

    onResize() {
        this.xAxis.onResize()
        this.yAxis.onResize()
        this.lines.onResize()
        this.details.resize()
    }

    onChangeRange(e) {
        const { start, end } = e.detail
        this.left = start
        this.right = end
        this.recalculateYBounds()
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)
        this.xAxis.changeRange(this.left, this.right)
        this.yAxis.changeBounds(this.min, this.max)
    }

    recalculateYBounds() {
        let max = Number.MIN_SAFE_INTEGER
        let min = Number.MAX_SAFE_INTEGER

        this.y.filter((line) => line.isVisible).forEach((line) => {
            for (let i = this.left; i <= this.right; i++) {
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

    onToggleLine(e) {
        const { name, value } = e.detail
        this.changeVisible(name, value)
        this.recalculateYBounds()
        this.lines.setLineState(name, value)
        this.lines.changeBounds(this.min, this.max)
        this.yAxis.changeBounds(this.min, this.max)
    }

    changeVisible(id, isVisible) {
        for (let i = 0; i < this.y.length; i++) {
            if (this.y[i].name === id) {
                this.y[i].isVisible = isVisible
                break
            }
        }
    }
}
