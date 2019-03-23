import { LinesContainer } from '../graph/line/lines-container'

import { Scope } from './scope'

export class Selector extends LinesContainer {

    constructor(parent, data, config = {}) {
        super(parent, data, Object.assign(Selector.DEFAULT_CONFIG, config, { maxX: data.xAxis.length - 1 }))

        this.scope = new Scope(this.container, this.config)

        window.addEventListener('resize', this.onResize.bind(this))
        parent.addEventListener('seriaToggle', this.onToggleLine.bind(this), false)
    }

    static get DEFAULT_CONFIG() {
        return {
            hToWRatio: 0.05,
            lineWidth: 1,
            padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0
            }
        }
    }

    onResize() {
        this.scope.onResize()
        this.lines.onResize()
    }
}
