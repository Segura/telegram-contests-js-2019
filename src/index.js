import { Chart } from './chart'
import { GraphControls } from './controls.js'
import { GraphSelector } from './selector.js'

export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((rawData) => {
        console.log(rawData);
        const normalizedData = normalizeChartData(container, rawData);
        console.log(normalizedData);
        new Chart(container, normalizedData, config);
        const graphSelector = new GraphSelector(container, normalizedData);
        subscribeToEvent(container, 'toggleSeria', graphSelector.toggle);
        graphSelector.draw();
        const graphControls = new GraphControls(container, {data: normalizedData.yAxis});
        graphControls.draw();
    })
};

const normalizeChartData = (container, rawData = {}) => {
    const names = Object.keys(rawData.names);
    return {
            xAxis: rawData.columns.find((column) => names.indexOf(column[0]) === -1),
            yAxis: names.map((name) => ({
                name,
                color: rawData.colors[name],
                title: rawData.names[name],
                data: rawData.columns.find((column) => column[0] === name)
            }))
    }
};

const subscribeToEvent = (el, eventName, callback) => {
    el.addEventListener(eventName, (e) => callback(e.detail.name, e.detail.value), false);
};
