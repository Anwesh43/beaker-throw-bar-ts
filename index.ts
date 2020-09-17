const w : number = window.innerWidth 
const h : number = window.innerHeight 
const lines : number = 3 
const parts : number = lines + 3 
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 3.9 
const colors : Array<string> = [
    "#2196F3",
    "#4CAF50",
    "#3F51B5",
    "#FF5722",
    "#FFEB3B"
]
const foreColor : string = "#bdbdbd"
const gapDeg : number = Math.PI / 2
const deg : number = Math.PI 
const delay : number = 20

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawThrowBar(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, lines, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, lines + 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, lines + 2, parts)
        const y : number = size / 2 * (1 - sf1)- (h / 2) * sf3
        context.save()
        context.translate(w / 2, h / 2)
        context.rotate(deg * sf2)
        for (var j = 0; j < lines; j++) {
            const sfj : number = ScaleUtil.divideScale(sf, j, parts)
            context.save()
            context.rotate(sfj * Math.PI / 2)
            context.translate(size / 2, -size / 2)
            DrawingUtil.drawLine(context, 0,  0, 0, size * sfj)
            context.restore()
        }
        context.fillRect(-size / 2, y, size, size / 2)
        context.restore()
    }

    static drawTBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawThrowBar(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = foreColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class BTBNode {

    state : State = new State()
    prev : BTBNode 
    next : BTBNode 

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new BTBNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawTBNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : BTBNode {
        var curr : BTBNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}