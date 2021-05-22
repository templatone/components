import { InputElement, IInputElement } from "./core/InputElement.js";
export declare type RadioValue = boolean;
export declare class InputRadioElement extends InputElement<RadioValue> implements IInputElement<RadioValue> {
    readonly defaultValue: RadioValue;
    value: RadioValue;
    get checked(): boolean;
    set checked(v: boolean);
    disabled: boolean;
    readOnly: boolean;
    private _container;
    private _onPointer;
    private _onKeyboard;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: RadioValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
