const getLocalExtrema = ({ data }) => {
    const len = data.length - 1;
    let max = data[len];
    let min = max;
    for (let i = len - 1; i > 0; i--) { // fisrt element is name, so we don't wanna compare it with others
        const curr = data[i];
        max = Math.max(max, curr);
        min = Math.min(min, curr);
    }
    return {
        max,
        min
    };
}

const getGlobalExtrema = (arr) => {
    const len = arr.length - 1;
    if (len < 0) {
        return {
            max: 0,
            min: 0
        };
    }
    let { max, min } = arr[len];
    for (let i = len - 1; i >= 0; i--) {
        const curr = arr[i];
        max = Math.max(max, curr.max);
        min = Math.min(min, curr.min);
    }
    return {
        max,
        min
    };
}

export class GraphSelector {

    constructor(canvas, data) {
        const globalExtrema = getGlobalExtrema(data.yAxis.map(getLocalExtrema));

        this.canvas = canvas;
        this.canvas.height = canvas.clientHeight * 1.5;
        this.canvas.width = canvas.clientWidth * 1.5;

        this.data = data;
        this.initialOptions = {
            height: canvas.height - 10, // for the borders!
            width: canvas.width, // we don't need borders here
            minX: data.xAxis[1], // fisrt element is name, so we take second as minimum
            maxX: data.xAxis[data.xAxis.length - 1],
            maxY: globalExtrema.max,
            minY: globalExtrema.min
        };
        this.initialOptions.xKoeff = (this.initialOptions.maxX - this.initialOptions.minX) / this.initialOptions.width;
        this.initialOptions.yKoeff = (this.initialOptions.maxY - this.initialOptions.minY) / this.initialOptions.height;        

        this.options = {
            maxY: this.initialOptions.maxY,
            minY: this.initialOptions.minY,
            yKoeff: this.initialOptions.yKoeff,
            data: this.data.yAxis
        };

        this.visibleCharts = data.yAxis.reduce((result, axis) => {
            result[axis.name] = true;
            return result;
        }, {});

        this.draw = this.draw.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.getX = this.getX.bind(this);
        this.getY = this.getY.bind(this);
        this.isVisible = this.isVisible.bind(this);
        this.recalcOptions = this.recalcOptions.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    draw () {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.initialOptions.width, this.initialOptions.height);
        this.options.data.forEach(this.drawLine.bind(this, ctx));
    }

    drawLine (ctx, axis) {
        ctx.strokeStyle = axis.color;
        ctx.lineWidth = 1;
        const len = axis.data.length - 1;
        ctx.moveTo(this.initialOptions.width, this.getY(this.data.xAxis[len]));
        ctx.beginPath();
        for (var i = len - 1; i > 0; i--) {
            ctx.lineTo(this.getX(this.data.xAxis[i]), this.getY(axis.data[i]));
        }
        ctx.stroke();
    }

    getX (value) { 
        return Math.round((this.initialOptions.maxX - value) / this.initialOptions.xKoeff);
    }

    getY (value) {
        return Math.round((this.options.maxY - value) / this.options.yKoeff);
    }

    isVisible ({ name }) {
        return this.visibleCharts[name];
    }

    recalcOptions () {
        const data = this.data.yAxis.filter(this.isVisible);
        const globalExtrema = getGlobalExtrema(data.map(getLocalExtrema));
        this.options = {
            maxY: globalExtrema.max,
            minY: globalExtrema.min,
            data
        };
        this.options.yKoeff = (this.options.maxY - this.options.minY) / this.initialOptions.height;        
    }

    toggle (name, value) {
        this.visibleCharts[name] = value;
        this.recalcOptions();
        this.draw();
    }
};
