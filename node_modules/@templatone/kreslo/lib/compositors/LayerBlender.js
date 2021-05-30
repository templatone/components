import {RenderingLayer} from "../core/RenderingLayer.js";
export class LayerBlender {
  constructor(width, height, compositeOperation) {
    const matteCanvas = document.createElement("canvas");
    const sourceCanvas = document.createElement("canvas");
    const resultCanvas = document.createElement("canvas");
    this.upperLayer = new RenderingLayer(matteCanvas, width, height);
    this.lowerLayer = new RenderingLayer(sourceCanvas, width, height);
    this._resultLayer = new RenderingLayer(resultCanvas, width, height);
    this.compositeOperation = compositeOperation;
  }
  render(renderingLayer) {
    const matteCanvas = this.upperLayer.getCanvas();
    const sourceCanvas = this.lowerLayer.getCanvas();
    const resultCanvas = this._resultLayer.getCanvas();
    this._resultLayer.clear();
    const resultCtx = this._resultLayer.getRenderingContext();
    resultCtx.globalCompositeOperation = CompositeOperation.SourceOver;
    resultCtx.drawImage(matteCanvas, 0, 0);
    resultCtx.globalCompositeOperation = this.compositeOperation;
    resultCtx.drawImage(sourceCanvas, 0, 0);
    const ctx = renderingLayer.getRenderingContext();
    ctx.drawImage(resultCanvas, 0, 0);
  }
  clear() {
    this.lowerLayer.clear();
    this.upperLayer.clear();
  }
}
export var CompositeOperation;
(function(CompositeOperation2) {
  CompositeOperation2["Color"] = "color";
  CompositeOperation2["ColorBurn"] = "color-burn";
  CompositeOperation2["ColorDodge"] = "color-dodge";
  CompositeOperation2["Copy"] = "copy";
  CompositeOperation2["Darken"] = "darken";
  CompositeOperation2["DestinationAtop"] = "destination-atop";
  CompositeOperation2["DestinationIn"] = "destination-in";
  CompositeOperation2["DestinationOut"] = "destination-out";
  CompositeOperation2["DestinationOver"] = "destination-over";
  CompositeOperation2["Difference"] = "difference";
  CompositeOperation2["Exclusion"] = "exclusion";
  CompositeOperation2["HardLight"] = "hard-light";
  CompositeOperation2["Hue"] = "hue";
  CompositeOperation2["Lighten"] = "lighten";
  CompositeOperation2["Lighter"] = "lighter";
  CompositeOperation2["Luminosity"] = "luminosity";
  CompositeOperation2["Multiply"] = "multiply";
  CompositeOperation2["Overlay"] = "overlay";
  CompositeOperation2["Saturation"] = "saturation";
  CompositeOperation2["Screen"] = "screen";
  CompositeOperation2["SoftLight"] = "soft-light";
  CompositeOperation2["SourceAtop"] = "source-atop";
  CompositeOperation2["SourceIn"] = "source-in";
  CompositeOperation2["SourceOut"] = "source-out";
  CompositeOperation2["SourceOver"] = "source-over";
  CompositeOperation2["XOR"] = "xor";
})(CompositeOperation || (CompositeOperation = {}));
