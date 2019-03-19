import { Main } from './main/main'
import { Selector } from './selector/selector'
import { GraphControls } from './controls/controls'

export class Chart {

    constructor (container, data, config = {}) {
        this.container = container
        this.data = data
        this.config = config
        this.container.appendChild(this.createTitle())
        this.main = new Main(this.container, this.data, config)
        this.selector = new Selector(this.container, this.data, config)
        this.controls = new GraphControls(this.container, { data: data.yAxis })
    }

    createTitle () {
        let title = document.createElement('h1')
        title.innerText = this.config.header
        title.classList.add('chart-title')
        return title
    }
}
