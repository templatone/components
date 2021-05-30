import { Transform } from "../properties/Transform.js";
import { Vector } from "../units/Vector.js";
import type { IBoundingBox } from "../renderables/IBoundingBox.js";
import type { IClonable } from "../core/IClonable.js";
import type { IColorRGBA } from "../styles/Color.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { ITexture } from "./ITexture.js";
import type { Shadow } from "../properties/Shadow.js";
/**
 * @deprecated Texture is not ready.
 */
export declare class WorleyNoise implements ITexture, IClonable<WorleyNoise> {
    points: Vector[];
    limitMin: number;
    limitMax: number;
    contrast: number;
    readonly width: number;
    readonly height: number;
    transform: Transform;
    shadow: Shadow | null;
    opacity: number;
    private _shadowCanvas;
    private _pixelModifierCallback;
    constructor(width: number, height: number);
    setPixelModifierCallback(callback: IPixelModifierCallback): void;
    generate(renderingLayer: IRenderingLayer): Promise<void>;
    getBoundingBox(renderingLayer: IRenderingLayer): IBoundingBox;
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    clone(): WorleyNoise;
    static getRandomPoints(width: number, height: number, count: number): Vector[];
}
export interface IPixelModifierCallback {
    (red: number, green: number, blue: number, alpha: number, x: number, y: number, pixelIndex: number): IColorRGBA;
}
