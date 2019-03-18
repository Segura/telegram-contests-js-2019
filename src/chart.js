import { Main } from './main/main'
import { Selector } from './selector/selector'
import { GraphControls } from './controls/controls'

export class Chart {

    constructor(container, data, config = {}) {
        this.container = container
        this.data = data
        this.config = Object.assign(config)
        this.main = new Main(this.container, this.data, config)
        this.selector = new Selector(container, this.data, config)
        this.controls = new GraphControls(container, { data: data.yAxis })
    }
}
