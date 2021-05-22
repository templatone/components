import { InputElement, ITextBasedInputElement, AutocompleteType, InputModeType } from "./core/InputElement.js";
export declare type NumberValue = number;
export declare class InputNumberElement extends InputElement<NumberValue> implements ITextBasedInputElement<NumberValue> {
    readonly defaultValue: NumberValue;
    min: number | null;
    max: number | null;
    step: number | null;
    value: NumberValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    private _computeInputMode;
    private _input;
    private _onInput;
    private _onBlur;
    private _onKeyDown;
    private _onClearValue;
    private _updateValue;
    private _formatValue;
    clearValue(): void;
    hasSameValueAs(value: NumberValue): boolean;
    focus(): void;
    blur(): void;
    static styles: import("lit").CSSResultGroup;
    render(): import("lit-html").TemplateResult<1>;
}
