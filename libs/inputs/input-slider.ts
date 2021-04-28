import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Utils } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { Input, IInput } from "./Input.js";


const style = html`
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
        --x-track-size: 2px;
        --x-track-color: var(--x-border-color);
        --x-border-color: var(--system-color-gray1);

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
        background-position: center center;
        background-size: 100% 100%;
        background-image: linear-gradient(180deg,
            transparent 0%,
            transparent calc(50% - var(--x-track-size) / 2),
            var(--x-track-color) calc(50% - var(--x-track-size) / 2),
            var(--x-track-color) calc(50% + var(--x-track-size) / 2),
            transparent calc(50% + var(--x-track-size) / 2),
            transparent 100%);

        transition: background-image .3s;
    }


    #container[is-max] #track {
        --x-track-size: 4px;
        --x-track-color: var(--system-accentColor);
    }


    [disabled] #track {
        background-color: transparent;
        color: var(--system-color-gray3);
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
        /* background-color: var(--system-accentColor); */
        background-position: left center;
        background-repeat: no-repeat;
        background-size: calc(100% - var(--x-height) / 2) 100%;
        background-image: linear-gradient(180deg,
            transparent 0%,
            transparent calc(50% - 2px),
            var(--system-accentColor) calc(50% - 2px),
            var(--system-accentColor) calc(50% + 2px),
            transparent calc(50% + 2px),
            transparent 100%);
    }

    #container[is-min] #bar {
        background-image: none;
    }


    [disabled] #bar {
        background-color: var(--system-color-gray3);
    }

    #bar[stepping] {
        transition: width .16s;
    }

    #handle {
        --x-outline: var(--system-color-gray1);
        --x-fill: var(--system-color-gray3);

        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--x-height);
        height: var(--x-height);
    }

    #handle::before {
        content: '';
        box-sizing: border-box;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 20px;

        border: 2px solid var(--x-outline);
        background-color: var(--x-fill);
    }

    [disabled] #handle {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;


export type SliderValue = number;

export class InputSlider extends Input<SliderValue> implements IInput<SliderValue> {

    // Properties
    get defaultValue(): SliderValue { return this.min; }

    private _min: number = 0;
    get min(): number { return this._min; }
    set min(v: number) {
        this._min = v;
        this.invalidate();
    }

    private _max: number = 100;
    get max(): number { return this._max; }
    set max(v: number) {
        this._max = v;
        this.invalidate();
    }

    private _step: number | null = null;
    get step(): number | null { return this._step; }
    set step(v: number | null) {
        this._step = v;
        this.invalidate();
    }

    private _value: number = 0;
    get value(): number { return this._value; }
    set value(v: number) {
        this._value = v;
        this.invalidate();
    }


    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        this._disabled = v;
        this.invalidate();

        if (!v) this._containerEl.setAttribute('tabindex', '0');
        else this._containerEl.removeAttribute('tabindex');
    }


    private _readOnly: boolean = false;
    get readOnly(): boolean { return this._readOnly; }
    set readOnly(v: boolean) {
        this._readOnly = v;
        this.invalidate();
    }


    // Elements
    private _containerEl: HTMLElement;
    private _trackEl: HTMLElement;
    private _barEl: HTMLElement;
    private _handleEl: HTMLElement;


    // Toggles
    private _pointerActive: boolean = false;


    constructor() {
        super();

        // Elements
        this._containerEl = this.shadowRoot!.getElementById('container') as HTMLElement;
        this._trackEl = this.shadowRoot!.getElementById('track') as HTMLElement;
        this._barEl = this.shadowRoot!.getElementById('bar') as HTMLElement;
        this._handleEl = this.shadowRoot!.getElementById('handle') as HTMLElement;

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
        window.addEventListener('touchmove', (e: TouchEvent) => this._onPointerMove(e), listenerOptions);
    }


    connectedCallback() {
        super.connectedCallback();
        this._updateUI();
    }


    // Actions
    private _onPointerStart(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;

        this._containerEl.focus();
        this._pointerActive = true;

        this._onPointerMove(e);
    }


    private _onPointerEnd(e: MouseEvent | TouchEvent) {
        this._pointerActive = false;
    }


    private _onPointerMove(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;

        if (!this._pointerActive) return;

        let clientX: number;

        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        } else {
            if (e.touches.length >= 2) return;

            const touch = e.touches[0];
            clientX = touch.clientX;
        }

        e.preventDefault();

        const rect = this._containerEl.getBoundingClientRect();

        const left = rect.left;
        const width = rect.width;
        const height = rect.height;

        const realX = (clientX - left)
        const valueMaxWidth = width - height;  // width - radius
        const valueX = realX - height / 2

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


    private _onKeyboard(e: KeyboardEvent) {
        if (this.disabled || this.readOnly) return;

        const movement = this.step ?? (this.max - this.min) / 100;

        let value = this.value;

        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowLeft': value += -movement * (e.shiftKey ? 10 : 1); break;

            case 'ArrowDown':
            case 'ArrowRight': value += movement * (e.shiftKey ? 10 : 1); break;

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
    private _updateUI() {
        this._updateTrackUI();
    }


    private _updateTrackUI() {
        const value = (this.value - this.min) / (this.max - this.min)

        this._containerEl.style.setProperty('--x-value', value.toFixed(3));
    }


    private _updateValue(value: SliderValue): void {
        this._value = InputSlider.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: SliderValue): boolean {
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
        return ['value', 'min', 'max', 'step', 'disabled', 'readonly'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
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


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <div id="container" tabindex="0" ?disabled=${this.disabled} ?is-min=${this.value <= this.min} ?is-max=${this.value >= this.max}>
                <div id="track"></div>
                <div id="bar" ?stepping=${this.step}>
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }
}

InputSlider.registerCustomElement('input-slider');