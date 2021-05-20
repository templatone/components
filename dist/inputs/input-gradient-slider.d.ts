import { InputElement, IInputElement } from "./core/InputElement.js";
export interface IGradientStep {
    offset: number;
    color: {
        red: number;
        green: number;
        blue: number;
        alpha: number;
    };
}
export declare type SliderGradientValue = number;
export declare class InputGradientSliderElement extends InputElement<SliderGradientValue> implements IInputElement<SliderGradientValue> {
    get defaultValue(): SliderGradientValue;
    value: SliderGradientValue;
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
    hasSameValueAs(value: SliderGradientValue): boolean;
    focus(): void;
    blur(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    render(): import("lit-html").TemplateResult<1>;
    static style: import("lit").CSSResultGroup;
    static computeGradientSteps(...hexColors: string[]): IGradientStep[];
}
