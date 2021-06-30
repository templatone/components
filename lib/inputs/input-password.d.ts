import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
export declare type InputPasswordValue = string;
export declare class InputPasswordElement extends InputElement<InputPasswordValue> implements ITextBasedInputElement<InputPasswordValue> {
    readonly defaultValue: InputPasswordValue;
    value: InputPasswordValue;
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    private _input;
    private _passwordVisibilityToggle;
    private _onInput;
    private _passwordVisibilityOn;
    private _passwordVisibilityOff;
    private _onPasswordVisibilityOn;
    private _onPasswordVisibilityOff;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputPasswordValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
