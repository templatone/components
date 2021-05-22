import { InputElement, IInputElement } from "./core/InputElement.js";
declare const enum CheckboxValueOption {
    Unchecked = -1,
    Indeterminate = 0,
    Checked = 1
}
export declare type CheckboxValue = CheckboxValueOption;
export declare class InputCheckboxElement extends InputElement<CheckboxValue> implements IInputElement<CheckboxValue> {
    readonly defaultValue: CheckboxValue;
    value: CheckboxValue;
    set checked(v: boolean);
    get checked(): boolean;
    set indeterminate(v: boolean);
    get indeterminate(): boolean;
    disabled: boolean;
    readOnly: boolean;
    private _container;
    private _negateValue;
    private _onPointer;
    private _onKeyboard;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: CheckboxValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
export {};
