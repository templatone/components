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
    get defaultValue(): InputSliderGradientSliderValue;
    value: InputSliderGradientSliderValue;
    min: number;
    max: number;
    step: number | null;
    disabled: boolean;
    readOnly: boolean;
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
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    render(): import("lit-html").TemplateResult<1>;
    static style: import("lit").CSSResultGroup;
    static computeGradientSteps(...hexColors: string[]): IGradientStep[];
}
