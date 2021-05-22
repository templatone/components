import { InputElement, ITextBasedInputElement, AutocompleteType, InputModeType } from "./core/InputElement.js";
export declare type TextareaValue = string;
export declare class InputTextareaElement extends InputElement<TextareaValue> implements ITextBasedInputElement<TextareaValue> {
    readonly defaultValue: TextareaValue;
    value: TextareaValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    private _input;
    private _onInput;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: TextareaValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
