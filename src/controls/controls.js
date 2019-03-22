import { EventAware } from '../common/event-aware'

import './controls.css'

export class GraphControls extends EventAware {

    static createContainer() {
        let container = document.createElement('div')
        container.className = 'control-container'
        return container
    }

    constructor(container, config = { data: [] }) {
        super(container)
        this.config = config
        this.activeCount = 0
        this.createControl = this.createControl.bind(this)
        this.draw()
    }

    draw() {
        const container = GraphControls.createContainer()
        this.config.data.forEach((config) => {
            container.appendChild(this.createControl(config))
        })
        this.container.appendChild(container)
    }

    handleOnToggle(name) {
        return (e) => {
            if (this.activeCount === 1 && !e.target.checked) {
                e.preventDefault()
                e.stopPropagation()
                e.target.checked = true
                return
            }
            this.activeCount += e.target.checked ? 1 : -1
            if (this.activeCount === 1) {
                this.container.classList.add('control-container-disabled')
            } else {
                this.container.classList.remove('control-container-disabled')
            }
            this.notify('seriaToggle', { name, value: e.target.checked })
        }
    }

    createControl(config = {}) {
        let control = document.createElement('label')
        control.className = 'seria-toggler'
        control.innerHTML = `<input type="checkbox" checked name="${config.name}"/><span class="seria-toggler-checkmark" style="color: ${config.color}"></span><span>${config.title}</span>`
        control.onchange = this.handleOnToggle(config.name)
        this.activeCount++
        return control
    }
}
