import { Lines } from './lines'
import { YAxis } from './y-axis'
import { createContainer } from '../utils'

import './main.css'

export class Main {

    constructor (parent, data, config = {}) {
        this.container = createContainer(parent, 'main-chart')
        this.x = data.xAxis
        this.y = data.yAxis
        this.config = Object.assign(Main.DEFAULT_CONFIG, config)
        this.create()

        window.addEventListener('resize', () => {
            this.yAxis.onResize()
            this.lines.onResize()
        })
    }

    static get DEFAULT_CONFIG() {
        return {

        }
    }

    create () {
        this.yAxis = new YAxis(this.container, 0, 100, 5)
        this.lines = new Lines(this.container, this.y)
    }
}