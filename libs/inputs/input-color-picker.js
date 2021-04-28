import { html } from "../../node_modules/lit-html/lit-html.js";
import { Color } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { Input, InputEvent } from "./Input.js";
import { InputColorTint } from "./input-color-tint.js";
import { InputSlider } from "./input-slider.js";
import { InputSliderGradient } from "./input-slider-gradient.js";
import { AssetDropdown } from "../assets/asset-dropdown.js";
import { InputButton } from "./input-button.js";
InputSlider;
InputSliderGradient;
InputColorTint;
AssetDropdown;
InputButton;
const style = html `
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
export class InputColorPicker extends Input {
    constructor() {
        super();
        this.defaultValue = Color.Black;
        this._hue = 0;
        this._saturation = 0;
        this._lightness = 0;
        this._alpha = 1;
        this._disabled = false;
        this._readOnly = false;
        // Elements
        this._hueSlider = this.shadowRoot.getElementById('hueSlider');
        this._alphaSlider = this.shadowRoot.getElementById('alphaSlider');
        this._tintSlider = this.shadowRoot.getElementById('tint');
        // Events
        this._hueSlider.addEventListener(InputEvent.UPDATE, () => this._onHueUpdate());
        this._alphaSlider.addEventListener(InputEvent.UPDATE, () => this._onAlphaUpdate());
        this._tintSlider.addEventListener(InputEvent.UPDATE, () => this._onTintUpdate());
        this.invalidate();
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        this.invalidate();
    }
    get readOnly() { return this._readOnly; }
    set readOnly(v) {
        this._readOnly = v;
        this.invalidate();
    }
    get value() {
        const c = Color.fromHSLA(this._hue, this._saturation, this._lightness, this._alpha);
        return c;
    }
    set value(c) {
        const hsl = c.getHSLA();
        this._hue = hsl.hue;
        this._saturation = hsl.saturation;
        this._lightness = hsl.lightness;
        this._alpha = hsl.alpha;
    }
    connectedCallback() {
        super.connectedCallback();
        this._updateUI();
    }
    _updateUI() {
        const alphaGradient = [{
                offset: 0,
                color: {
                    red: this.value.red,
                    green: this.value.green,
                    blue: this.value.blue,
                    alpha: 0,
                }
            }, {
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
    _onHueUpdate() {
        const value = this._hueSlider.value;
        this._hue = value;
        this.invalidate();
        this._updateUI();
    }
    _onAlphaUpdate() {
        const value = this._alphaSlider.value;
        this._alpha = value;
        this.invalidate();
        this._updateUI();
    }
    _onTintUpdate() {
        const value = this._tintSlider.value;
        this._saturation = value.saturation;
        this._lightness = value.lightness;
        this.invalidate();
        this._updateUI();
    }
    _updateValue(value) {
        this.value = InputColorPicker.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    hasSameValueAs(value) {
        if (value === undefined)
            return false;
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
    attributeChangedCallback(name, oldValue, newValue) {
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
    getTemplate() {
        return html `
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
