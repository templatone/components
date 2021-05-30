import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
export declare type InputTextareaValue = string;
export declare class InputTextareaElement extends InputElement<InputTextareaValue> implements ITextBasedInputElement<InputTextareaValue> {
    readonly defaultValue: InputTextareaValue;
    value: InputTextareaValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    private _input;
    private _onInput;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputTextareaValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
