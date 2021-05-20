import { TemplateResult } from 'lit';
import { InputElement, IInputElement } from "./core/InputElement.js";
export declare type ImagesValue = HTMLImageElement[];
export declare class InputImagesElement extends InputElement<ImagesValue> implements IInputElement<ImagesValue> {
    readonly defaultValue: ImagesValue;
    value: ImagesValue;
    disabled: boolean;
    readOnly: boolean;
    capture: boolean;
    multiple: boolean;
    private _input;
    private _onFileSelect;
    private _addImages;
    private _removeImageByIndex;
    private _updateValue;
    hasSameValueAs(value: ImagesValue): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    private _renderThumbnails;
    render(): TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
