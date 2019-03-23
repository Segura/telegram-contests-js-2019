import { LinesContainer } from '../graph/line/lines-container'

import { Details } from './details'
import { XAxis } from './x-axis'
import { YAxis } from './y-axis'
import './main.css'

export class Main extends LinesContainer {

    constructor(parent, data, config = {}) {
        super(parent, data, Object.assign(Main.DEFAULT_CONFIG, config))
        this.xAxis = new XAxis(this.container, this.x, this.left, this.right, this.config)
        this.yAxis = new YAxis(this.container, this.min, this.max, this.config)

        this.lines.subscribe('mousemove', this.lines.handleMouseMove)
        this.lines.subscribe('mouseleave', this.lines.handleMouseLeave)
        this.lines.subscribe('scroll', this.lines.handleMouseLeave)

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

    onToggleLine(e) {
        super.onToggleLine(e)
        this.yAxis.changeBounds(this.min, this.max)
    }
}
