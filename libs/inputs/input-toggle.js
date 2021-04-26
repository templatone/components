import { html } from "../../node_modules/lit-html/lit-html.js";
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
        --x-height: 28px;
        --x-border-color: var(--system-color-gray1);

        display: block;
        width: 54px;
        height: var(--x-height);
        border-radius: var(--x-height);
        outline: 0;
    }

    #container:not(:focus-within) {
        --x-border-color: var(--system-color-gray2);
    }


    #track {
        display: block;
        width: 100%;
        height: var(--x-height);
        box-sizing: border-box;
        margin-bottom: calc(var(--x-height) * -1);
        border: 2px solid var(--x-border-color);
        border-radius: var(--x-height);
        background-color: var(--system-color-base);
    }

    [checked] #track {
        background-color: var(--system-accentColor);
        border-color: var(--system-accentColor);
    }

    [checked]:active #track {
        background-color: var(--system-accentColor-hover);
        border-color: var(--system-accentColor-hover);
    }


    #bar {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: var(--x-height);
        height: var(--x-height);
        margin-bottom: calc(var(--x-height) * -1);
        border-radius: var(--x-height);
        transition: width .16s;
    }

    [checked] #bar {
        width: 100%;
    }

    [disabled] #bar {
        background-color: var(--system-color-gray3);
    }

    #handle {
        --x-outline: var(--system-color-gray1);
        --x-fill: var(--system-color-gray3);

        display: flex;
        width: var(--x-height);
        height: var(--x-height);
        justify-content: center;
        align-items: center;
    }

    #handle::before {
        content: '';
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 2px solid var(--x-outline);
        background-color: var(--x-fill);
    }

    [checked] #handle {
        --x-outline: #fff;
        --x-fill: transparent;
    }
    
    [disabled] #handle {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;
export class InputToggle extends Input {
    constructor() {
        super();
        // Properties
        this.defaultValue = false;
        this._value = false;
        this._disabled = false;
        this._readOnly = false;
        //
        this._pointerActive = false;
        this._pointerMovements = [];
        this._pointerLastX = NaN;
        this._skipClick = false;
        // Elements
        this._containerEl = this.shadowRoot.getElementById('container');
        // Event listeners
        const listenerOptions = { capture: false, passive: false };
        this._containerEl.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);
        this._containerEl.addEventListener('mousedown', (e) => this._onPointerStart(e), listenerOptions);
        this._containerEl.addEventListener('touchstart', (e) => this._onPointerStart(e), listenerOptions);
        this._containerEl.addEventListener('mouseup', (e) => this._onPointerEnd(e, true), listenerOptions);
        window.addEventListener('mouseup', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('mouseleave', (e) => this._onPointerEnd(e), listenerOptions);
        this._containerEl.addEventListener('touchend', (e) => this._onPointerEnd(e, true), listenerOptions);
        this._containerEl.addEventListener('touchend', (e) => this._onPointerEnd(e), listenerOptions);
        this._containerEl.addEventListener('touchcancel', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('mousemove', (e) => this._onPointerMove(e), listenerOptions);
        window.addEventListener('touchmove', (e) => this._onPointerMove(e), listenerOptions);
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        this.invalidate();
    }
    get checked() { return this.value === true; }
    set checked(checked) { this.value = checked; }
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
    // Actions
    _onPointerStart(e) {
        this._containerEl.focus();
        this._pointerActive = true;
        this._pointerMovements = [];
        this._pointerLastX = NaN;
        this._onPointerMove(e);
    }
    _onPointerEnd(e, mayClicked = false) {
        if (this.disabled || this.readOnly)
            return;
        if (this._skipClick == false && mayClicked) {
            this.value = !this.value;
            this.fireUpdateEvent();
        }
        this._pointerActive = false;
        this._pointerMovements = [];
        this._pointerLastX = 0;
        this._skipClick = false;
        e.preventDefault();
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
        if (isNaN(this._pointerLastX)) {
            this._pointerLastX = clientX;
        }
        else {
            this._pointerMovements.push(clientX - this._pointerLastX);
            this._pointerLastX = clientX;
        }
        if (this._pointerMovements.length > 8) {
            this._pointerMovements = this._pointerMovements.slice(this._pointerMovements.length - 32);
            const movement = this._pointerMovements.reduce((acc, n) => acc += n, 0);
            if (movement > 8 && this.value == false) {
                this._skipClick = true;
                this._updateValue(true);
            }
            else if (movement < -8 && this.value == true) {
                this._skipClick = true;
                this._updateValue(false);
            }
        }
    }
    _onKeyboard(e) {
        if (this.disabled || this.readOnly)
            return;
        let value = this.value;
        switch (e.code) {
            case 'Enter':
            case 'Space':
                value = !value;
                break;
            case 'ArrowLeft':
                value = false;
                break;
            case 'ArrowRight':
                value = true;
                break;
            default: return;
        }
        e.preventDefault();
        if (this.value != value) {
            this._updateValue(value);
        }
    }
    _updateValue(value) {
        this._value = InputToggle.applyFilters(this.filters, value);
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
        return ['readonly', 'disabled', 'checked'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'checked':
                this.checked = newValue !== null;
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

            <div id="container" tabindex="0" ?checked=${this.value} ?disabled=${this.disabled}>
                <div id="track"></div>
                <div id="bar">
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }
}
InputToggle.registerCustomElement('input-toggle');
