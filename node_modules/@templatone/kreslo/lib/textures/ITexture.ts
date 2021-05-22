import { IObject } from "../renderables/IObject.js";
import { IRenderable } from "../renderables/IRenderable.js";
import { IRenderingLayer } from "../core/RenderingLayer.js";
import { IVisible } from "../renderables/IVisible.js";


export interface ITexture extends IObject, IRenderable, IVisible {
    generate(renderingLayer: IRenderingLayer): Promise<void>,
}