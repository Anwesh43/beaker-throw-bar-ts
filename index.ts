import { min } from "lodash"

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