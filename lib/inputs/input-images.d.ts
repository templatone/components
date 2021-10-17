import { TemplateResult, PropertyValues } from 'lit';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";
import { CaptureType } from './core/CaptureType.js';
export declare type InputImagesValue = HTMLImageElement[];
export declare class InputImagesElement extends InputElement<InputImagesValue> implements IInputElement<InputImagesValue> {
    readonly emptyValue: InputImagesValue;
    defaultValue: InputImagesValue;
    value: InputImagesValue;
    disabled: boolean;
    readOnly: boolean;
    autofocus: boolean;
    capture: CaptureType;
    multiple: boolean;
    private _input;
    private _onFileSelect;
    private _addImages;
    private _removeImageByIndex;
    private _updateValue;
    hasSameValueAs(value: InputImagesValue): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    private _renderThumbnails;
    update(changedProperties: PropertyValues): void;
    render(): TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
