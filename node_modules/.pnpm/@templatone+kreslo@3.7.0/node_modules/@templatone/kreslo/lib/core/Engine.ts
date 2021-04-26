import { Loop } from "../repeaters/Loop.js";
import { RenderingLayer, UpdateStyleSizeCallback } from "./RenderingLayer.js";


export class Engine extends RenderingLayer {

    readonly loop: Loop;


    constructor(canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number = 1, updateStyleSizeCallback?: UpdateStyleSizeCallback | null) {
        super(canvas, width, height, pixelScale, updateStyleSizeCallback);

        this.loop = new Loop();

        // this.debuggerBar = new DebuggerBar(this);
        // this.loop.addUpdateCallback((time: number, delta: number) => this.debuggerBar.update(time, delta));
    }

}