import { GraphContainer } from '../../main/container'

import { Lines } from './lines'

export class LinesContainer extends GraphContainer {

    constructor(parent, data, config = {}) {
        super(parent, data)
        this.config = config

        this.lines = new Lines(this.container, this.y, this.config)
        this.lines.changeBounds(this.min, this.max)
        this.lines.changeRange(this.left, this.right)
    }

    onToggleLine(e) {
        super.onToggleLine(e)
        this.lines.setLineState(e.detail.name, e.detail.value)
        this.lines.changeBounds(this.min, this.max)
    }
}
