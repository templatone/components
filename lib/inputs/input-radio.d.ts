import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";
export declare type InputRadioValue = boolean;
export declare class InputRadioElement extends InputElement<InputRadioValue> implements IInputElement<InputRadioValue> {
    readonly defaultValue: InputRadioValue;
    value: InputRadioValue;
    get checked(): boolean;
    set checked(v: boolean);
    disabled: boolean;
    readOnly: boolean;
    private _container;
    private _onPointer;
    private _onKeyboard;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputRadioValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
