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
        --x-size: 24px;
        --x-border-color: var(--system-color-gray1);

        outline: 0;
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        border-radius: 6px;
    }

    #container:not(:focus-within) {
        --x-border-color: var(--system-color-gray2);
    }

    #track {
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        box-sizing: border-box;
        margin-bottom: calc(var(--x-size) * -1);
        border-radius: inherit;
        background-color: var(--system-color-base);
        border: 2px solid var(--x-border-color);
    }

    [disabled] #track {
        background-color: transparent;
        color: var(--system-color-gray3);
    }

    #fill {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: var(--x-size);
        height: var(--x-size);
        margin-bottom: calc(var(--x-size) * -1);
        border-radius: inherit;
        background-color: var(--system-accentColor);
    }

    #fill:hover {
        background-color: var(--system-accentColor-hover);
    }

    :not([checked]) #fill {
        display: none;
    }

    svg {
        display: block;
        width: 22px;
        height: 22px;
        fill: #fff;
    }

    [hidden] {
        display: none;
    }
</style>
`;
export class InputCheckbox extends Input {
    constructor() {
        super();
        // Properties
        this.defaultValue = false;
        this._value = false;
        this._disabled = false;
        this._readOnly = false;
        // Elements
        this._containerEl = this.shadowRoot.getElementById('container');
        // Event listeners
        const listenerOptions = { capture: false, passive: false };
        this._containerEl.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);
        this._containerEl.addEventListener('click', (e) => this._onPointer(e), listenerOptions);
        this._containerEl.addEventListener('touchend', (e) => this._onPointer(e), listenerOptions);
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        this.invalidate();
    }
    get checked() { return this.value === true; }
    set checked(v) { this.value = v; }
    get indeterminate() { return this.value === null; }
    set indeterminate(v) { this.value = v ? null : false; }
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
    _onPointer(e) {
        if (this.disabled || this.readOnly)
            return;
        if (!(e instanceof MouseEvent) && e.touches.length > 1)
            return;
        e.preventDefault();
        this._updateValue(!this.value);
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
            default: return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (this.value != value) {
            this._updateValue(value);
        }
    }
    _updateValue(value) {
        this._value = InputCheckbox.applyFilters(this.filters, value);
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
        return ['readonly', 'disabled', 'checked', 'indeterminate'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'checked':
                this.checked = newValue !== null;
                break;
            case 'indeterminate':
                this.indeterminate = newValue !== null;
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

            <div id="container" tabindex="0" ?checked=${this.value !== false} ?disabled=${this.disabled}>
                <div id="track"></div>
                <div id="fill">
                    <svg ?hidden=${this.value !== true} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                        <polygon points="16.1,5.1 8.5,12.7 4.9,9.1 3.5,10.5 8.5,15.5 17.5,6.5 "/>
                    </svg>

                    <svg ?hidden=${this.value !== null} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                        <path d="M16,11.5H5v-2h11V11.5z"/>
                    </svg>
                </div>
            </div>
        `;
    }
}
InputCheckbox.registerCustomElement('input-checkbox');
