import {Loop} from "../repeaters/Loop.js";
import {RenderingLayer} from "./RenderingLayer.js";
export class Engine extends RenderingLayer {
  constructor(canvas, width, height, pixelScale, updateStyleSizeCallback) {
    super(canvas, width, height, pixelScale, updateStyleSizeCallback);
    this.loop = new Loop();
  }
}
