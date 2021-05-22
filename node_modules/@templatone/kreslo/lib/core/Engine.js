import { Loop } from "../repeaters/Loop.js";
import { RenderingLayer } from "./RenderingLayer.js";
export class Engine extends RenderingLayer {
    constructor(canvas, width, height, pixelScale = 1, updateStyleSizeCallback) {
        super(canvas, width, height, pixelScale, updateStyleSizeCallback);
        this.loop = new Loop();
        // this.debuggerBar = new DebuggerBar(this);
        // this.loop.addUpdateCallback((time: number, delta: number) => this.debuggerBar.update(time, delta));
    }
}
