import { drawControls } from './controls.js'

export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((rawData) => {
        console.log(rawData)
        const normalizedData = normalizeChartData(rawData);
        console.log(normalizedData);
        drawControls(container, normalizedData.yAxis);
    })
}

const normalizeChartData = (rawData = {}) => {
    const names = Object.keys(rawData.names);
    return {
            xAxis: rawData.columns.find((column) => names.indexOf(column[0]) === -1),
            yAxis: names.map((name) => ({
                name,
                color: rawData.colors[name],
                title: rawData.names[name],
                data: rawData.columns.find((column) => column[0] === name),
                onSeriaToggle: handleOnSeriaToggle(name)
            }))
    }
};

const handleOnSeriaToggle = (name) => (e) => {
    if (e) {
        console.log(`${name}=${e.target.checked}`);
    }
};
