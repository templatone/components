import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";
declare const enum CheckboxValueOption {
    Unchecked = -1,
    Indeterminate = 0,
    Checked = 1
}
export declare type InputCheckboxValue = CheckboxValueOption;
export declare class InputCheckboxElement extends InputElement<InputCheckboxValue> implements IInputElement<InputCheckboxValue> {
    readonly emptyValue: InputCheckboxValue;
    defaultValue: InputCheckboxValue;
    value: InputCheckboxValue;
    set checked(v: boolean);
    get checked(): boolean;
    set indeterminate(v: boolean);
    get indeterminate(): boolean;
    disabled: boolean;
    readOnly: boolean;
    autofocus: boolean;
    private _container;
    private _negateValue;
    private _onPointer;
    private _onKeyboard;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputCheckboxValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
export {};
