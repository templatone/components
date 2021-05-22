import { InputElement, IInputElement } from "./core/InputElement.js";
export declare type ToggleValue = boolean;
export declare class InputToggleElement extends InputElement<ToggleValue> implements IInputElement<ToggleValue> {
    readonly defaultValue: ToggleValue;
    value: ToggleValue;
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
    hasSameValueAs(value: ToggleValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
