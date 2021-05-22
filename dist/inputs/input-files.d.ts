import { InputElement, IInputElement } from "./core/InputElement.js";
export declare type FilesValue = File[];
export declare class InputFilesElement extends InputElement<FilesValue> implements IInputElement<FilesValue> {
    readonly defaultValue: FilesValue;
    value: FilesValue;
    disabled: boolean;
    readOnly: boolean;
    accept: string;
    capture: boolean;
    multiple: boolean;
    private _input;
    private _onFileSelect;
    private _updateValue;
    hasSameValueAs(value: FilesValue): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    static styles: import("lit").CSSResultGroup;
    render(): import("lit-html").TemplateResult<1>;
}
