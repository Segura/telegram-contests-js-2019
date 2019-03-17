import { Main } from './main/main'
import { GraphSelector } from './selector'
import { GraphControls } from './controls'

export class Chart {

    constructor(container, data, config = {}) {
        this.container = container
        this.data = data
        this.config = Object.assign(config, Chart.DEFAULT_CONFIG)
        this.main = new Main(this.container, this.data, this.config)
        this.selector = new GraphSelector(container, data)
        this.controls = new GraphControls(container, {data: data.yAxis});
    }

    static get DEFAULT_CONFIG() {
        return {

        }
    }
}
