import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";
export interface IGradientStep {
    offset: number;
    color: {
        red: number;
        green: number;
        blue: number;
        alpha: number;
    };
}
export declare type InputSliderGradientSliderValue = number;
export declare class InputGradientSliderElement extends InputElement<InputSliderGradientSliderValue> implements IInputElement<InputSliderGradientSliderValue> {
    get emptyValue(): InputSliderGradientSliderValue;
    private _customDefaultValue;
    get defaultValue(): InputSliderGradientSliderValue;
    set defaultValue(v: InputSliderGradientSliderValue);
    private _value;
    get value(): InputSliderGradientSliderValue;
    set value(v: InputSliderGradientSliderValue);
    min: number;
    max: number;
    step: number | null;
    disabled: boolean;
    readOnly: boolean;
    autofocus: boolean;
    readonly defaultColorSteps: IGradientStep[];
    private _colorSteps;
    get colorSteps(): IGradientStep[];
    set colorSteps(v: IGradientStep[]);
    private _container;
    private _track;
    private _bar;
    private _handle;
    private _pointerActive;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    private _onPointerStart;
    private _onPointerEnd;
    private _onPointerMove;
    private _onKeyboard;
    private _updateUI;
    private _updateTrackUI;
    private _updateGradientUI;
    private _updateValue;
    clearValue(): void;
    hasSameValueAs(value: InputSliderGradientSliderValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static style: import("lit").CSSResultGroup;
    static computeGradientSteps(...hexColors: string[]): IGradientStep[];
}
