import {Geometry} from "./Geometry.js";
import {Numbers} from "../web-modules/pkg/@templatone/utils.js";
import {Vector} from "../units/Vector.js";
export class PieGeometry extends Geometry {
  constructor(width, height, startAngle, endAngle, innerRadius) {
    const d = (ctx, pxs, t) => {
      const width2 = this.width > 0 ? this.width : 0;
      const height2 = this.height > 0 ? this.height : 0;
      const x = -t.origin.x + width2 / 2;
      const y = -t.origin.y + height2 / 2;
      const radiusX = width2 / 2;
      const radiusY = height2 / 2;
      const innerRadius2 = Numbers.limit(this.innerRadius, 0, 1);
      const innerRadiusX = radiusX * innerRadius2;
      const innerRadiusY = radiusY * innerRadius2;
      let startAngle2 = this.startAngle.radians - Math.PI / 2;
      let endAngle2 = this.endAngle.radians - Math.PI / 2;
      if (endAngle2 - startAngle2 > Math.PI * 2) {
        endAngle2 = Math.PI * 2 + startAngle2;
      }
      ctx.beginPath();
      ctx.ellipse(x * pxs, y * pxs, radiusX * pxs, radiusY * pxs, 0, startAngle2, endAngle2);
      ctx.ellipse(x * pxs, y * pxs, innerRadiusX * pxs, innerRadiusY * pxs, 0, endAngle2, startAngle2, true);
      ctx.closePath();
    };
    const b = (t) => {
      return {
        origin: t.origin.clone(),
        size: new Vector(this.width, this.height)
      };
    };
    super(d, b);
    this.width = width;
    this.height = height;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.innerRadius = innerRadius;
  }
}
