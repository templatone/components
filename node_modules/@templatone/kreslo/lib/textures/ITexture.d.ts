import type { IObject } from "../renderables/IObject.js";
import type { IRenderable } from "../renderables/IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IVisible } from "../renderables/IVisible.js";
export interface ITexture extends IObject, IRenderable, IVisible {
    generate(renderingLayer: IRenderingLayer): Promise<void>;
}
