import './controls.css';

export class GraphControls {

    static createContainer() {
        let container = document.createElement('div');
        container.className = 'control-container';
        return container;
    }

    constructor(container, config = {data: []}) {
        this.container = container;
        this.config = config;
        this.draw = this.draw.bind(this);
        this.createControl = this.createControl.bind(this);
    }

    draw() {
        const container = GraphControls.createContainer();
        this.config.data.forEach((config) => {
            container.appendChild(this.createControl(config));
        });
        this.container.appendChild(container);
    }

    handleOnToggle(name) {
        return (e) => {
            if (e) {
                const event = new CustomEvent('toggleSeria', {
                    detail: {
                        name,
                        value: e.target.checked
                    },
                    bubbles: true,
                    cancelable: true
                });

                this.container.dispatchEvent(event);
            }
        }
    }

    createControl(config = {}) {
        let control = document.createElement('label');
        control.className = 'seria-toggler';
        control.innerHTML = `<input type="checkbox" checked name="${config.name}"/><span class="seria-toggler-checkmark" style="color: ${config.color}"></span>${config.title}`;
        control.onchange = this.handleOnToggle(config.name);
        return control;
    }
}
