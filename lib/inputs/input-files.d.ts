import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from './core/IInputElement.js';
export declare type InputFilesValue = File[];
export declare class InputFilesElement extends InputElement<InputFilesValue> implements IInputElement<InputFilesValue> {
    readonly defaultValue: InputFilesValue;
    value: InputFilesValue;
    disabled: boolean;
    readOnly: boolean;
    accept: string;
    capture: boolean;
    multiple: boolean;
    private _input;
    private _onFileSelect;
    private _updateValue;
    hasSameValueAs(value: InputFilesValue): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
