import { BezierGeometry } from "./BezierGeometry.js";
import type { BezierPoint } from "../units/BezierPoint.js";
import type { Fill } from "../properties/Fill.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IShape } from "./IShape.js";
import type { Shadow } from "../properties/Shadow.js";
import type { Stroke } from "../properties/Stroke.js";
export declare class BezierShape extends BezierGeometry implements IRenderable, IShape {
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(...points: BezierPoint[]);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
}
