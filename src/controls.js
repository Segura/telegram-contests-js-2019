import './controls.css';

export const drawControls = (element, controlConfig = []) => {
    const container = createContainer();
    controlConfig.forEach((config) => {
        container.appendChild(createControl(config));
    });
    element.appendChild(container);
};

const createContainer = () => {
    let container = document.createElement('div');
    container.className = 'control-container';
    return container;
};

const createControl = (config = {}) => {
    let control = document.createElement('label');
    control.className = 'seria-toggler';
    control.innerHTML = `<input type="checkbox" checked name="${config.name}"/><span class="seria-toggler-checkmark" style="color: ${config.color}"></span>${config.title}`;
    control.onchange = config.onSeriaToggle;
    return control;
};
