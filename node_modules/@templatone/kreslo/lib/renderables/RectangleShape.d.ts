import { RectangleGeometry } from "./RectangleGeometry.js";
import type { Fill } from "../properties/Fill.js";
import type { IClonable } from "../core/IClonable.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IShape } from "./IShape.js";
import type { Shadow } from "../properties/Shadow.js";
import type { Stroke } from "../properties/Stroke.js";
export declare class RectangleShape extends RectangleGeometry implements IRenderable, IShape, IClonable<RectangleShape> {
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(width: number, height: number);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    clone(): RectangleShape;
}
