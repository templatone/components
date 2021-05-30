import { InputElement } from "./core/InputElement.js";
import { IInputElement } from "./core/IInputElement.js";
export declare type InputToggleValue = boolean;
export declare class InputToggleElement extends InputElement<InputToggleValue> implements IInputElement<InputToggleValue> {
    readonly defaultValue: InputToggleValue;
    value: InputToggleValue;
    get checked(): boolean;
    set checked(v: boolean);
    disabled: boolean;
    readOnly: boolean;
    private _container;
    private _pointerActive;
    private _pointerMovements;
    private _pointerLastX;
    private _skipClick;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _onPointerStart;
    private _onPointerEnd;
    private _onPointerMove;
    private _onKeyboard;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputToggleValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
