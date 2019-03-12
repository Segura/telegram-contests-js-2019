import { drawControls } from './controls.js'

export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((rawData) => {
        console.log(rawData)
        const normalizedData = normalizeChartData(rawData);
        console.log(normalizedData);
        drawControls(container, normalizedData);
    })
}

const normalizeChartData = (rawData = {}) => {
    const names = Object.keys(rawData.names);
    return names.reduce((result, name) => {
        result.push({
            name,
            color: rawData.colors[name],
            title: rawData.names[name],
            data: rawData.columns
                            .find((column) => column.some((value) => value === name))
                            .filter((value) => value !== name),
            onSeriaToggle: handleOnSeriaToggle(name)
        });
        return result;
    }, []);
};

const handleOnSeriaToggle = (name) => (e) => {
    if (e) {
        console.log(`${name}=${e.target.checked}`);
    }
};
