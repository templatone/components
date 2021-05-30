import {Gradient} from "./Gradient.js";
import {Numbers} from "../web-modules/pkg/@templatone/utils.js";
export class LinearGradient extends Gradient {
  computeStyle(renderingLayer, boundingBox) {
    const ctx = renderingLayer.getRenderingContext();
    const pxs = renderingLayer.pixelScale;
    const startPoint = this.start.clone().multiple(boundingBox.size).add(boundingBox.origin);
    const endPoint = this.end.clone().multiple(boundingBox.size).add(boundingBox.origin);
    const gradient = ctx.createLinearGradient(startPoint.x * pxs, startPoint.y * pxs, endPoint.x * pxs, endPoint.y * pxs);
    this.steps.forEach((step) => {
      const offset = Numbers.limit(step.offset, 0, 1);
      const color = `rgba(${step.color.red.toFixed(3)}, ${step.color.green.toFixed(3)}, ${step.color.blue.toFixed(3)}, ${step.color.alpha.toFixed(3)})`;
      gradient.addColorStop(offset, color);
    });
    return gradient;
  }
}
