const getLocalExtrema = ({data}) => {
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
};

const getGlobalExtrema = (arr) => {
    const len = arr.length - 1;
    if (len < 0) {
        return {
            max: 0,
            min: 0
        };
    }
    let {max, min} = arr[len];
    for (let i = len - 1; i >= 0; i--) {
        const curr = arr[i];
        max = Math.max(max, curr.max);
        min = Math.min(min, curr.min);
    }
    return {
        max,
        min
    };
};

export class GraphSelector {

    static createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'control-canvas';
        return canvas;
    };

    static appendCanvas(container, canvas) {
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'control-canvas-container';
        canvasContainer.appendChild(canvas);
        container.appendChild(canvasContainer);
    };

    constructor(container, data) {
        this.container = container;
        const globalExtrema = getGlobalExtrema(data.yAxis.map(getLocalExtrema));
        this.canvas = GraphSelector.createCanvas();
        GraphSelector.appendCanvas(container, this.canvas);
        this.context = this.canvas.getContext("2d");
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;

        this.data = data;
        this.initialOptions = {
            height: this.canvas.height - 30, // for the borders!
            width: this.canvas.width, // we don't need borders here
            minX: data.xAxis[1], // first element is name, so we take second as minimum
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

        this.scopeOptions = {
            scopeStart: this.initialOptions.width / 3,
            scopeEnd: this.initialOptions.width / 1.5,
            vStrokeWidth: this.initialOptions.width / 80,
            canDrag: false,
            shouldDrag: false,
            canResize: false,
            shouldResize: false
        };

        this.scopeOptions.halfVStrokeWidth = this.scopeOptions.vStrokeWidth / 2;
        this.scopeOptions.hStrokeWidth = this.scopeOptions.halfVStrokeWidth / 4;

        this.draw = this.draw.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.getX = this.getX.bind(this);
        this.getY = this.getY.bind(this);
        this.isVisible = this.isVisible.bind(this);
        this.recalcOptions = this.recalcOptions.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.releaseDrag = this.releaseDrag.bind(this);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.releaseDrag);
    }

    draw() {
        this.context.clearRect(0, 0, this.initialOptions.width, this.canvas.height);
        this.options.data.forEach(this.drawLine);
        this.drawScope();
        this.notify(this.scopeOptions);
    }

    drawScope() {
        const {scopeStart, scopeEnd, hStrokeWidth, halfVStrokeWidth, vStrokeWidth} = this.scopeOptions;
        this.context.fillStyle = 'rgba(60,60,60,0.05)';
        this.context.fillRect(0, 0, scopeStart, this.canvas.height);

        this.context.strokeStyle = 'rgba(200,200,200,0.15)';
        this.context.beginPath();
        this.context.moveTo(scopeStart, 0);

        this.context.lineWidth = hStrokeWidth;
        this.context.lineTo(scopeEnd - halfVStrokeWidth, 0);
        this.context.lineWidth = vStrokeWidth;
        this.context.lineTo(scopeEnd - halfVStrokeWidth, this.canvas.height);
        this.context.lineWidth = hStrokeWidth;
        this.context.lineTo(scopeStart + halfVStrokeWidth, this.canvas.height);
        this.context.lineWidth = vStrokeWidth;
        this.context.lineTo(scopeStart + halfVStrokeWidth, 0);
        this.context.stroke();

        this.context.fillStyle = 'rgba(60,60,60,0.05)';
        this.context.fillRect(scopeEnd, 0, this.initialOptions.width, this.canvas.height);
    }

    drawLine(axis) {
        this.context.strokeStyle = axis.color;
        this.context.lineWidth = 1;
        const len = axis.data.length - 1;
        this.context.moveTo(this.initialOptions.width, this.getY(this.data.xAxis[len]));
        this.context.beginPath();
        for (let i = len - 1; i > 0; i--) {
            this.context.lineTo(this.getX(this.data.xAxis[i]), this.getY(axis.data[i]));
        }
        this.context.stroke();
    }

    getX(value) {
        return Math.round((value - this.initialOptions.minX) / this.initialOptions.xKoeff);
    }

    getY(value) {
        return Math.round((this.options.maxY - value) / this.options.yKoeff) + 15;
    }

    isVisible({name}) {
        return this.visibleCharts[name];
    }

    recalcOptions() {
        const data = this.data.yAxis.filter(this.isVisible);
        const globalExtrema = getGlobalExtrema(data.map(getLocalExtrema));
        this.options = {
            maxY: globalExtrema.max,
            minY: globalExtrema.min,
            data
        };
        this.options.yKoeff = (this.options.maxY - this.options.minY) / this.initialOptions.height;
    }

    toggle(name, value) {
        this.visibleCharts[name] = value;
        this.recalcOptions();
        this.draw();
    }

    handleMouseDown(e) {
        if (e && e.button === 0) {
            this.scopeOptions.shouldDrag = this.scopeOptions.canDrag;
            this.scopeOptions.shouldResize = this.scopeOptions.canResize;
            this.scopeOptions.isLeftSide = e.layerX < this.scopeOptions.scopeStart + this.scopeOptions.vStrokeWidth;
            this.scopeOptions.resizeModifier = this.scopeOptions.isLeftSide ? -1 : 1;
        } else {
            this.scopeOptions.shouldDrag = false;
            this.scopeOptions.shouldResize = false;
        }
    }

    shouldDrag(x) {
        const {scopeStart, scopeEnd, vStrokeWidth} = this.scopeOptions;
        return x > scopeStart + vStrokeWidth && x < scopeEnd - vStrokeWidth
    }

    shouldResize(x) {
        const {scopeStart, scopeEnd} = this.scopeOptions;
        return x >= scopeStart && x <= scopeEnd
    }

    releaseDrag() {
        this.scopeOptions.shouldDrag = false;
        this.scopeOptions.shouldResize = false;
    }

    handleMouseMove(e) {
        const {shouldDrag, shouldResize, resizeModifier, scopeStart, scopeEnd, isLeftSide, vStrokeWidth} = this.scopeOptions;
        if (e) {
            this.scopeOptions.canDrag = this.shouldDrag(e.layerX);
            this.scopeOptions.canResize = !this.scopeOptions.canDrag && this.shouldResize(e.layerX);
        }
        this.canvas.style.cursor = 'auto';
        if (this.scopeOptions.canDrag) {
            this.canvas.style.cursor = 'move';
        }
        if (this.scopeOptions.canResize) {
            this.canvas.style.cursor = 'ew-resize';
        }
        if (e && shouldDrag && e.movementX) {
            let newStart = scopeStart + e.movementX;
            let newEnd = scopeEnd + e.movementX;
            if (newStart < 0) {
                newStart = 0;
                newEnd = scopeEnd - scopeStart;
            }
            if (newEnd > this.initialOptions.width) {
                newEnd = this.initialOptions.width;
                newStart = newEnd - (scopeEnd - scopeStart);
            }
            if (newStart !== scopeStart && newEnd !== scopeEnd) {
                this.scopeOptions.scopeStart = newStart;
                this.scopeOptions.scopeEnd = newEnd;
                this.draw();
            }
        }
        if (e && shouldResize && e.movementX) {
            let newStart = scopeStart;
            let newEnd = scopeEnd;
            if (isLeftSide) {
                newStart = scopeStart + e.movementX;
                if (newStart < 0) {
                    newStart = 0;
                }
            } else {
                newEnd = scopeEnd + e.movementX * resizeModifier;
                if (newEnd > this.initialOptions.width) {
                    newEnd = this.initialOptions.width;
                }
            }
            if ((newStart !== scopeStart || newEnd !== scopeEnd) && newEnd > newStart + vStrokeWidth * 2) {
                this.scopeOptions.scopeStart = newStart;
                this.scopeOptions.scopeEnd = newEnd;
                this.draw();
            }
        }
    }

    notify(config) {
        const event = new CustomEvent('notify', {
            detail: config,
            bubbles: true,
            cancelable: true
        });

        this.container.dispatchEvent(event);
    }
}
