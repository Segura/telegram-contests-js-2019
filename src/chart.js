import { Main } from './main/main'

export class Chart {

    constructor(container, data, config = {}) {
        this.container = container
        this.data = data
        this.config = Object.assign(config, Chart.DEFAULT_CONFIG)
        this.draw()
    }

    static get DEFAULT_CONFIG() {
        return {

        }
    }

    draw () {
        new Main(this.container, this.data, this.config)
    }
}
