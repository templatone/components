import { Angle } from "../units/Angle.js";
import { Fill } from "../properties/Fill.js";
import { IRenderable } from "./IRenderable.js";
import { IRenderingLayer } from "../core/RenderingLayer.js";
import { IShape } from "./IShape.js";
import { PieGeometry } from "./PieGeometry.js";
import { Shadow } from "../properties/Shadow.js";
import { Shape } from "./Shape.js";
import { Stroke } from "../properties/Stroke.js";


export class PieShape extends PieGeometry implements IRenderable, IShape {

    fill: Fill | null = null;
    stroke: Stroke | null = null;
    shadow: Shadow | null = null;

    opacity: number = 1;


    constructor(width: number, height: number, startAngle: Angle, endAngle: Angle, innerRadius: number) {
        super(width, height, startAngle, endAngle, innerRadius);
    }


    render(renderingLayer: IRenderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }


    renderGizmo(renderingLayer: IRenderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
}