import { html } from "../../node_modules/lit-html/lit-html.js";
import { Color, Utils } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { Input } from "./Input.js";
const style = html `
<style>
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    #container {
        --x-value: 1;
        --x-height: 32px;
        --x-color: rgba(255, 0, 0, .5);

        outline: 0;
        display: block;
        width: 100%;
        height: var(--x-height);
        border-radius: 6px;
    }

    #track {
        display: block;
        width: calc(100%);
        height: var(--x-height);
        box-sizing: border-box;
        margin-bottom: calc(var(--x-height) * -1);
        border-radius: inherit;
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px inset;
        background-color: #fff;
        background-image:
            var(--x-gradient),
            var(--system-pattern-transparency);

        background-size:
            calc(200% - var(--x-height) * 2) 100%,
            auto calc(100% / 3 * 2);

        background-repeat:
            no-repeat,
            repeat;

        background-position:
            center center,
            left top;
    }

    #bar {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: calc((100% - var(--x-height)) * var(--x-value) + var(--x-height));
        height: var(--x-height);
        margin-bottom: calc(var(--x-height) * -1);
        border-radius: inherit;
    }

    #bar[stepping] {
        transition: width .16s;
    }

    #handle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--x-height);
        height: var(--x-height);
    }

    #handle::before {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 2px solid #fff;
        box-sizing: border-box;
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px, rgba(0, 0, 0, .16) 0 0 0 2px inset;
    }

    [disabled] #handle {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;
function printColor(red, green, blue, alpha) {
    const r = red.toFixed(3);
    const g = green.toFixed(3);
    const b = blue.toFixed(3);
    const a = alpha.toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
export class InputSliderGradient extends Input {
    constructor() {
        super();
        this._min = 0;
        this._max = 100;
        this._value = 0;
        this._step = null;
        this._disabled = false;
        this._readOnly = false;
        this.defaultColorSteps = InputSliderGradient.computeGradientSteps('#8880', '#888f');
        this._colorSteps = this.defaultColorSteps;
        // Toggles
        this._pointerActive = false;
        // Elements
        this._containerEl = this.shadowRoot.getElementById('container');
        this._trackEl = this.shadowRoot.getElementById('track');
        this._barEl = this.shadowRoot.getElementById('bar');
        this._handleEl = this.shadowRoot.getElementById('handle');
        // Event listeners
        const listenerOptions = { capture: false, passive: false };
        this._containerEl.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);
        this._containerEl.addEventListener('mousedown', (e) => this._onPointerStart(e), listenerOptions);
        this._containerEl.addEventListener('touchstart', (e) => this._onPointerStart(e), listenerOptions);
        window.addEventListener('mouseup', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('mouseleave', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('touchend', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('touchcancel', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('mousemove', (e) => this._onPointerMove(e), listenerOptions);
        window.addEventListener('touchmove', (e) => this._onPointerMove(e), listenerOptions);
    }
    // Properties
    get defaultValue() { return this.min; }
    get min() { return this._min; }
    set min(v) {
        this._min = v;
        this.invalidate();
    }
    get max() { return this._max; }
    set max(v) {
        this._max = v;
        this.invalidate();
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        this.invalidate();
    }
    get step() { return this._step; }
    set step(v) {
        this._step = v;
        this.invalidate();
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        this.invalidate();
        if (!v)
            this._containerEl.setAttribute('tabindex', '0');
        else
            this._containerEl.removeAttribute('tabindex');
    }
    get readOnly() { return this._readOnly; }
    set readOnly(v) {
        this._readOnly = v;
        this.invalidate();
    }
    get colorSteps() { return this._colorSteps; }
    set colorSteps(v) {
        this._colorSteps = v.sort((a, b) => a.offset - b.offset);
        this._updateUI();
    }
    connectedCallback() {
        super.connectedCallback();
        this._updateUI();
    }
    // Actions
    _onPointerStart(e) {
        if (this.disabled || this.readOnly)
            return;
        this._containerEl.focus();
        this._pointerActive = true;
        this._onPointerMove(e);
    }
    _onPointerEnd(e) {
        if (this.disabled || this.readOnly)
            return;
        this._pointerActive = false;
    }
    _onPointerMove(e) {
        if (this.disabled || this.readOnly)
            return;
        if (!this._pointerActive)
            return;
        let clientX;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        }
        else {
            if (e.touches.length >= 2)
                return;
            const touch = e.touches[0];
            clientX = touch.clientX;
        }
        e.preventDefault();
        const rect = this._containerEl.getBoundingClientRect();
        const left = rect.left;
        const width = rect.width;
        const height = rect.height;
        const realX = (clientX - left);
        const valueMaxWidth = width - height; // width - radius
        const valueX = realX - height / 2;
        const ratio = valueX / valueMaxWidth;
        let value = Utils.Numbers.remap(ratio, 0, 1, this.min, this.max);
        value = Utils.Numbers.limit(value, this.min, this.max);
        if (this.step) {
            value = Math.round(value / this.step) * this.step;
        }
        if (value != this.value) {
            this._updateValue(value);
            this._updateUI();
        }
    }
    _onKeyboard(e) {
        if (this.disabled || this.readOnly)
            return;
        const movement = this.step ?? (this.max - this.min) / 100;
        let value = this.value;
        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowLeft':
                value += -movement * (e.shiftKey ? 10 : 1);
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                value += movement * (e.shiftKey ? 10 : 1);
                break;
            default: return;
        }
        e.preventDefault();
        e.stopPropagation();
        value = Utils.Numbers.limit(value, this.min, this.max);
        if (value != this.value) {
            this._updateValue(value);
            this._updateUI();
        }
    }
    // UI
    _updateUI() {
        this._updateTrackUI();
        this._updateGradientUI();
    }
    _updateTrackUI() {
        const value = (this.value - this.min) / (this.max - this.min);
        this._containerEl.style.setProperty('--x-value', value.toFixed(3));
    }
    _updateGradientUI() {
        const steps = this.colorSteps.length > 0 ? this.colorSteps : [{
                offset: 0,
                color: { red: 0, green: 0, blue: 0, alpha: 0 }
            }];
        const parts = steps.map(s => {
            const offset = ((s.offset / 2 + 1 / 4) * 100).toFixed(3);
            return `${printColor(s.color.red, s.color.green, s.color.blue, s.color.alpha)} ${offset}%`;
        });
        const styleGradient = `linear-gradient(90deg, ${parts.join(', ')})`;
        this._containerEl.style.setProperty('--x-gradient', styleGradient);
    }
    _updateValue(value) {
        this._value = InputSliderGradient.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    hasSameValueAs(value) {
        return this.value === value;
    }
    focus() {
        this._containerEl.focus();
        this.fireFocusEvent();
    }
    blur() {
        this._containerEl.blur();
        this.fireBlurEvent();
    }
    // Attributes
    static get observedAttributes() {
        return ['color-steps', 'value', 'min', 'max', 'step', 'disabled', 'readonly'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'color-steps':
                this.colorSteps = newValue ? InputSliderGradient.computeGradientSteps(...newValue.split(',')) : this.defaultColorSteps;
                break;
            case 'value':
                this.value = newValue ? parseFloat(newValue) : NaN;
                break;
            case 'min':
                this.min = newValue ? parseFloat(newValue) : NaN;
                break;
            case 'max':
                this.max = newValue ? parseFloat(newValue) : NaN;
                break;
            case 'step':
                this.step = newValue ? parseFloat(newValue) : null;
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

            <div id="container" tabindex="0" ?disabled=${this.disabled}>
                <div id="track"></div>
                <div id="bar" ?stepping=${this.step}>
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }
    // Global & Static
    static computeGradientSteps(...hexColors) {
        const steps = hexColors.map((hex, i, arr) => {
            const color = Color.fromHex(hex).getRGBA();
            const offset = i / (arr.length - 1);
            return { color, offset };
        });
        return steps;
    }
}
InputSliderGradient.registerCustomElement('input-slider-gradient');
