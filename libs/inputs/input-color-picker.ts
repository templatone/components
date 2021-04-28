import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";

import { IInput } from "./Input.js";

import { Color } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { Input, InputEvent } from "./Input.js";
import { InputColorTint } from "./input-color-tint.js";
import { InputSlider } from "./input-slider.js";
import { InputSliderGradient, IGradientStep } from "./input-slider-gradient.js";
import { AssetDropdown } from "../assets/asset-dropdown.js";
import { InputButton } from "./input-button.js";


InputSlider;
InputSliderGradient;
InputColorTint;
AssetDropdown;
InputButton;


const style = html`
<style>
    :host {
        display: block;
        outline: 0;
    }

    .menu {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: repeat(3, auto);
        gap: 16px;
        padding: 16px;
    }

    .menu > * {
        padding: 0;
    }

    .swatch {
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        box-sizing: border-box;
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px;
        border-radius: 4px;
        margin-right: 8px;

        background-color: var(--x-color);
        background-image:
            linear-gradient(0deg, var(--x-color), var(--x-color)),
            linear-gradient(135deg, var(--system-pattern-transparency-color1) 50%, var(--system-pattern-transparency-color2) 50%);
        background-size: 100% 100%;
        background-position: center center;
    }
</style>
`;


export type ColorValue = Color;

export class InputColorPicker extends Input<ColorValue> implements IInput<ColorValue> {
    readonly defaultValue: ColorValue = Color.Black;

    private _hue: number = 0;
    private _saturation: number = 0;
    private _lightness: number = 0;
    private _alpha: number = 1;

    private _hueSlider: InputSliderGradient;
    private _alphaSlider: InputSliderGradient;

    private _tintSlider: InputColorTint;


    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        this._disabled = v;
        this.invalidate();
    }

    private _readOnly: boolean = false;
    get readOnly(): boolean { return this._readOnly; }
    set readOnly(v: boolean) {
        this._readOnly = v;
        this.invalidate();
    }

    public get value(): ColorValue {
        const c = Color.fromHSLA(this._hue, this._saturation, this._lightness, this._alpha);
        return c;
    }

    public set value(c: ColorValue) {
        const hsl = c.getHSLA();
        this._hue = hsl.hue;
        this._saturation = hsl.saturation;
        this._lightness = hsl.lightness;
        this._alpha = hsl.alpha;
    }


    constructor() {
        super();

        // Elements
        this._hueSlider = this.shadowRoot!.getElementById('hueSlider') as InputSliderGradient;
        this._alphaSlider = this.shadowRoot!.getElementById('alphaSlider') as InputSliderGradient;
        this._tintSlider = this.shadowRoot!.getElementById('tint') as InputColorTint;

        // Events
        this._hueSlider.addEventListener(InputEvent.UPDATE, () => this._onHueUpdate());
        this._alphaSlider.addEventListener(InputEvent.UPDATE, () => this._onAlphaUpdate());
        this._tintSlider.addEventListener(InputEvent.UPDATE, () => this._onTintUpdate());

        this.invalidate();
    }


    connectedCallback() {
        super.connectedCallback();
        this._updateUI();
    }


    private _updateUI() {
        const alphaGradient: IGradientStep[] = [{
            offset: 0,
            color: {
                red: this.value.red,
                green: this.value.green,
                blue: this.value.blue,
                alpha: 0,
            }
        },{
            offset: 1,
            color: {
                red: this.value.red,
                green: this.value.green,
                blue: this.value.blue,
                alpha: 1,
            }
        }];

        this._alphaSlider.colorSteps = alphaGradient;
    }


    // Listeners
    private _onHueUpdate() {
        const value = this._hueSlider.value;
        this._hue = value;
        this.invalidate();
        this._updateUI();
    }


    private _onAlphaUpdate() {
        const value = this._alphaSlider.value;
        this._alpha = value;
        this.invalidate();
        this._updateUI();
    }


    private _onTintUpdate() {
        const value = this._tintSlider.value;
        this._saturation = value.saturation;
        this._lightness = value.lightness;
        this.invalidate();
        this._updateUI();
    }


    private _updateValue(value: ColorValue): void {
        this.value = InputColorPicker.applyFilters(this.filters, value) as ColorValue;
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: ColorValue): boolean {
        if (value === undefined) return false;
        
        const current = this.value.getRGBA();
        const test = value.getRGBA();

        return current.red == test.red
            && current.green == test.green
            && current.blue == test.blue
            && current.alpha == test.alpha;
    }


    focus() {
        this._hueSlider.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._hueSlider.blur();
        this._tintSlider.blur();
        this._alphaSlider.blur();
        this.fireBlurEvent();
    }


    // Attributes
    static get observedAttributes() {
        return ['readonly', 'disabled', 'value'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
            case 'value':
                this.value = newValue ? Color.fromHex(newValue) : this.defaultValue;
                break;

            case 'disabled':
                this.disabled = newValue !== null;
                break;

            case 'readonly':
                this.readOnly = newValue !== null;
                break;
        }
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <ui-dropdown>
                <ui-button slot="button">
                    <div class="swatch" style="--x-color: ${this.value.getCSSValue()}">
                    </div>

                    Barva
                </ui-button>

                <div slot="menu" class="menu">
                    <input-slider-gradient id="hueSlider" min="0" max="360" value="0" color-steps="#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00"></input-slider-gradient>
                    <input-color-tint id="tint" hue="${this._hue}"></input-color-tint>
                    <input-slider-gradient id="alphaSlider" min="0" max="1" value="1"></input-slider-gradient>
                </div>
            </ui-dropdown>
        `;
    }
}

InputColorPicker.registerCustomElement('input-color-picker');