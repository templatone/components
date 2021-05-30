import {Geometry} from "./Geometry.js";
import {Numbers} from "../web-modules/pkg/@templatone/utils.js";
import {Vector} from "../units/Vector.js";
export class TrimablePolygonGeometry extends Geometry {
  constructor(points, closed = true, trimStart = 0, trimEnd = 1, trimOffset = 0) {
    const d = (ctx, pxs, transform) => {
      this._draw(ctx, pxs, transform);
    };
    const b = (t) => {
      const width = Math.max(...this.points.map((p) => p.x));
      const height = Math.max(...this.points.map((p) => p.y));
      return {
        origin: this.transform.origin.clone(),
        size: new Vector(width, height)
      };
    };
    super(d, b);
    this.points = points;
    this.closed = closed;
    this.trimEnd = trimEnd;
    this.trimStart = trimStart;
    this.trimOffset = trimOffset;
  }
  _draw(ctx, pxs, transform) {
    const trimOffsetNormalized = this.trimOffset + this.trimStart;
    const trimStartNormalized = 0;
    const trimEndNormalized = this.trimEnd - this.trimStart;
    const trimOffsetRatio = ((v) => {
      while (v < 0)
        v += 1;
      while (v > 1)
        v -= 1;
      return v;
    })(trimOffsetNormalized);
    const trimStartRatio = Numbers.limit(trimStartNormalized, 0, 1) + trimOffsetRatio;
    const trimEndRatio = Numbers.limit(trimEndNormalized, 0, 1) + trimOffsetRatio;
    const sides = this.points.map((start, i, arr) => {
      const end = i + 1 < arr.length ? arr[i + 1] : arr[0];
      const line = Vector.Zero.add(end).subtract(start);
      return line;
    }).slice(0, this.closed ? this.points.length : this.points.length - 1);
    const circuit = sides.reduce((acc, side) => acc + side.length, 0);
    const trimStartLength = trimStartRatio * circuit;
    const trimEndLength = trimEndRatio * circuit;
    let alreadyDrawn = 0;
    ctx.translate(-transform.origin.x * pxs, -transform.origin.y * pxs);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    sides.forEach((side) => {
      alreadyDrawn = this._drawSide(ctx, pxs, side, alreadyDrawn, trimStartLength, trimEndLength);
    });
    if (1 < trimEndRatio) {
      if (!this.closed) {
        const resetMovement = sides.reduce((acc, side) => {
          return acc.subtract(side);
        }, Vector.Zero);
        ctx.moveTo(resetMovement.x * pxs, resetMovement.y * pxs);
        ctx.translate(resetMovement.x * pxs, resetMovement.y * pxs);
      }
      let overflowAlreadyDrawn = 0;
      for (let i = 0; i < sides.length; i++) {
        const side = sides[i];
        overflowAlreadyDrawn = this._drawSide(ctx, pxs, side, overflowAlreadyDrawn, 0, trimEndLength - circuit);
        if (overflowAlreadyDrawn > trimEndLength - circuit)
          break;
      }
    }
    if (this.closed && (trimStartRatio != trimEndRatio && trimStartRatio - trimEndRatio == 0)) {
      ctx.closePath();
    }
  }
  _drawSide(ctx, pxs, side, alreadyDrawn, trimStartLength, trimEndLength) {
    if (trimEndLength >= alreadyDrawn + side.length && trimStartLength <= alreadyDrawn) {
      ctx.lineTo(side.x * pxs, side.y * pxs);
    } else if (trimEndLength >= alreadyDrawn + side.length && trimStartLength < alreadyDrawn + side.length && trimStartLength >= alreadyDrawn) {
      const beforeGapModifier = (trimStartLength - alreadyDrawn) / side.length;
      if (beforeGapModifier > 0) {
        const v = side.clone().multiple(beforeGapModifier);
        ctx.moveTo(v.x * pxs, v.y * pxs);
      }
      ctx.lineTo(side.x * pxs, side.y * pxs);
    } else if (trimEndLength > alreadyDrawn && trimStartLength <= alreadyDrawn) {
      const afterLength = side.length - (trimEndLength - alreadyDrawn);
      const lineLength = side.length - afterLength;
      const lineModifier = lineLength / side.length;
      const v = side.clone().multiple(lineModifier);
      ctx.lineTo(v.x * pxs, v.y * pxs);
      if (afterLength > 0) {
        const afterGapModifier = afterLength / side.length;
        const v2 = side.clone().multiple(afterGapModifier);
        ctx.moveTo(v2.x * pxs, v2.y * pxs);
      }
    } else if (trimEndLength > alreadyDrawn && trimStartLength < alreadyDrawn + side.length && trimStartLength > alreadyDrawn) {
      const beforeLength = trimStartLength - alreadyDrawn;
      const afterLength = side.length - (trimEndLength - alreadyDrawn);
      const lineLength = side.length - (beforeLength + afterLength);
      if (beforeLength > 0) {
        const beforeGapModifier = beforeLength / side.length;
        const v2 = side.clone().multiple(beforeGapModifier);
        ctx.moveTo(v2.x * pxs, v2.y * pxs);
      }
      const lineModifier = (lineLength + beforeLength) / side.length;
      const v = side.clone().multiple(lineModifier);
      ctx.lineTo(v.x * pxs, v.y * pxs);
      if (afterLength > 0) {
        const afterGapModifier = afterLength / side.length;
        const v2 = side.clone().multiple(afterGapModifier);
        ctx.moveTo(v2.x * pxs, v2.y * pxs);
      }
    } else {
      ctx.moveTo(side.x * pxs, side.y * pxs);
    }
    ctx.translate(side.x * pxs, side.y * pxs);
    return alreadyDrawn += side.length;
  }
}
