import { PieGeometry } from "./PieGeometry.js";
import type { Angle } from "../units/Angle.js";
import type { Fill } from "../properties/Fill.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IShape } from "./IShape.js";
import type { Shadow } from "../properties/Shadow.js";
import type { Stroke } from "../properties/Stroke.js";
export declare class PieShape extends PieGeometry implements IRenderable, IShape {
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(width: number, height: number, startAngle: Angle, endAngle: Angle, innerRadius: number);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
}
