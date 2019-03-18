import { Chart } from './chart'

export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((rawData) => {
        console.log(rawData);
        const normalizedData = normalizeChartData(container, rawData);
        console.log(normalizedData);
        new Chart(container, normalizedData, config);
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
                data: rawData.columns.find((column) => column[0] === name),
                isVisible: true
            }))
    }
};
