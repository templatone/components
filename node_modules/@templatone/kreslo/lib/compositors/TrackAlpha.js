import {LayerBlender, CompositeOperation} from "./LayerBlender.js";
export class TrackAlpha {
  get matteLayer() {
    return this._layerBlender.upperLayer;
  }
  get sourceLayer() {
    return this._layerBlender.lowerLayer;
  }
  constructor(width, height, inverted = false) {
    this._layerBlender = new LayerBlender(width, height, inverted ? CompositeOperation.SourceOut : CompositeOperation.SourceIn);
  }
  render(renderingLayer) {
    this._layerBlender.render(renderingLayer);
  }
  clear() {
    this._layerBlender.clear();
  }
}
