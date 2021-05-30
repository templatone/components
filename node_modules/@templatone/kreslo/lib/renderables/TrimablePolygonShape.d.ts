import { TrimablePolygonGeometry } from "./TrimablePolygonGeometry.js";
import type { Fill } from "../properties/Fill.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IShape } from "./IShape.js";
import type { IVector } from "../units/Vector.js";
import type { Shadow } from "../properties/Shadow.js";
import type { Stroke } from "../properties/Stroke.js";
export declare class TrimablePolygonShape extends TrimablePolygonGeometry implements IRenderable, IShape {
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(points: IVector[], closed?: boolean, trimStart?: number, trimEnd?: number, trimOffset?: number);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
}
