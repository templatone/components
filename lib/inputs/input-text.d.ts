import { AutocapitalizeType } from './core/AutocapitalizeType.js';
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
export declare type InputTextValue = string;
export declare class InputTextElement extends InputElement<InputTextValue> implements ITextBasedInputElement<InputTextValue> {
    readonly emptyValue: InputTextValue;
    defaultValue: InputTextValue;
    private _value;
    get value(): InputTextValue;
    set value(v: InputTextValue);
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autofocus: boolean;
    autocomplete: AutocompleteType;
    autocapitalize: AutocapitalizeType;
    inputMode: InputModeType;
    name: string;
    private _input?;
    private _onInput;
    private _onClearValue;
    private _updateValue;
    private _reflectValueToView;
    clearValue(): void;
    hasSameValueAs(value: InputTextValue): boolean;
    focus(): void;
    blur(): void;
    connectedCallback(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
