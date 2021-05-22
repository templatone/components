import { InputElement, ITextBasedInputElement } from "./core/InputElement.js";
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputModeType } from './core/InputModeType.js';
export declare type TextValue = string;
export declare class InputTextElement extends InputElement<TextValue> implements ITextBasedInputElement<TextValue> {
    readonly defaultValue: TextValue;
    value: TextValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    private _input;
    private _onInput;
    private _onClearValue;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: TextValue): boolean;
    focus(): void;
    blur(): void;
    static styles: import("lit").CSSResultGroup;
    render(): import("lit-html").TemplateResult<1>;
}
