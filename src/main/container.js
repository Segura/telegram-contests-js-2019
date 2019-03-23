import { createContainer } from '../utils'

export class GraphContainer {

    constructor (parent, data) {
        this.container = createContainer(parent, 'main-chart')
        this.x = data.xAxis
        this.y = data.yAxis

        this.left = 1
        this.right = this.x.length - 1

        this.recalculateYBounds()
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

    changeVisible(id, isVisible) {
        for (let i = 0; i < this.y.length; i++) {
            if (this.y[i].name === id) {
                this.y[i].isVisible = isVisible
                break
            }
        }
    }

    onToggleLine(e) {
        const { name, value } = e.detail
        this.changeVisible(name, value)
        this.recalculateYBounds()
    }
}
