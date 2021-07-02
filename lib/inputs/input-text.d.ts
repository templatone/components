import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
export declare type InputTextValue = string;
export declare class InputTextElement extends InputElement<InputTextValue> implements ITextBasedInputElement<InputTextValue> {
    readonly defaultValue: InputTextValue;
    value: InputTextValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    name: string;
    private _input;
    private _onInput;
    private _onClearValue;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputTextValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
