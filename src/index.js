import { Chart } from './chart'
import { drawControls } from './controls.js'
import { GraphSelector } from './selector.js'

export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((rawData) => {
        console.log(rawData)
        const normalizedData = normalizeChartData(container, rawData);
        console.log(normalizedData);
        const canvas = createCanvas();
        container.appendChild(canvas);
        new Chart(container, normalizedData, config)
        drawControls(container, normalizedData.yAxis);
        const graphSelector = new GraphSelector(canvas, normalizedData);
        subscribeToEvent(container, 'toggleSeria', graphSelector.toggle);
        graphSelector.draw();
    })
}

const normalizeChartData = (container, rawData = {}) => {
    const names = Object.keys(rawData.names);
    return {
            xAxis: rawData.columns.find((column) => names.indexOf(column[0]) === -1),
            yAxis: names.map((name) => ({
                name,
                color: rawData.colors[name],
                title: rawData.names[name],
                data: rawData.columns.find((column) => column[0] === name),
                onSeriaToggle: handleOnSeriaToggle(container, name)
            }))
    }
};

const handleOnSeriaToggle = (container, name) => (e) => {
    if (e) {
        const event = new CustomEvent('toggleSeria', { 
            detail: {
                name,
                value: e.target.checked
            },
            bubbles: true,
            cancelable: true
        });

        container.dispatchEvent(event);

        console.log(`${name}=${e.target.checked}`);
    }
};

const createCanvas = () => {
    let canvas = document.createElement('canvas');
    canvas.className = 'control-canvas';
    return canvas;
};


const subscribeToEvent = (el, eventName, callback) => {
    el.addEventListener(eventName, (e) => callback(e.detail.name, e.detail.value), false);
};
