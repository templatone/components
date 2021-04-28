import { html } from "../../node_modules/lit-html/lit-html.js";
import { Input } from "./Input.js";
const regex = {
    spaces: /\s+/g,
    validChars: /[^0-9,.+\- ]/g,
    decimalSeparator: /\.|\,/
};
const style = html `
<style>
    :host {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
        box-sizing: border-box;
    }

    #container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        overflow: hidden;
        border: 2px solid;
        border-radius: 6px;

        color: var(--system-color-label);
        background-color: var(--system-color-base);
        border-color: var(--system-color-gray2);
    }

    #container:focus-within {
        border-color: var(--system-color-gray1);
    }

    #container[disabled] {
        color: var(--system-color-gray3);
        background-color: var(--system-color-gray6);
        border-color: var(--system-color-gray4);
    }

    input {
        display: block;
        flex-shrink: 1;
        flex-grow: 1;
        width: auto;
        height: 100%;
        max-width: 100%;
        min-width: 0%;
        max-height: 100%;
        min-height: 32px;
        box-sizing: border-box;
        border: none;
        outline: 0;
        outline: none;
        padding: 0;
        margin: 0;
        padding: 4px 6px;
        font-family: inherit;
        font-size: 18px;
        line-height: 24px;
        color: inherit;
        background-color: inherit;
        text-align: right;
    }

    
    input::placeholder {
        color: var(--system-color-gray3);
    }

    #container[disabled] input::placeholder {
        color: transparent;
    }

    .clear-button {
        outline: 0;
        cursor: pointer;
        margin: 4px;
        flex-shrink: 0;
        color: var(--system-color-gray2);
    }

    .clear-button:hover,
    .clear-button:focus {
        color: var(--system-color-gray1);
    }

    #container[disabled] .clear-button,
    #container:not([filled]) .clear-button {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>`;
export class InputNumber extends Input {
    constructor() {
        super();
        // Properties
        this.defaultValue = 0;
        this._min = null;
        this._max = null;
        this._step = null;
        this._value = 0;
        this._placeholder = null;
        this._disabled = false;
        this._readOnly = false;
        this._autocomplete = false;
        this._computedInputMode = "decimal" /* Decimal */;
        this._inputMode = "decimal" /* Decimal */;
        this._inputEl = this.shadowRoot.getElementById('input');
    }
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
    get step() { return this._step; }
    set step(v) {
        this._step = v;
        if (Number.isInteger(this._step))
            this._computedInputMode = "decimal" /* Decimal */;
        else
            this._computedInputMode = "numeric" /* Numeric */;
        this.invalidate();
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        this.invalidate();
    }
    get placeholder() { return this._placeholder; }
    set placeholder(v) {
        this._placeholder = v;
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
    get autocomplete() { return this._autocomplete; }
    set autocomplete(v) {
        this._autocomplete = v;
        this.invalidate();
    }
    get inputMode() { return this._inputMode; }
    set inputMode(v) {
        this._inputMode = v;
        this.invalidate();
    }
    _onInput() {
        const rawValue = this._inputEl.value;
        const rawParts = rawValue.split(regex.decimalSeparator);
        if (rawParts.length == 1) {
            rawParts.push('');
        }
        else if (rawParts.length >= 3) {
            rawParts[1] = rawParts.slice(1).join('');
        }
        rawParts.splice(2);
        const parts = rawParts.map(v => {
            return v.replace(regex.validChars, '')
                .replace(regex.spaces, '')
                .replace(regex.decimalSeparator, '')
                .replace('+', '');
        });
        const value = [
            parts[0].length != 0 ? parts[0] : 0,
            parts[1].length != 0 ? parts[1] : 0,
        ].join('.');
        const n = parseFloat(value);
        this._updateValue(!isNaN(n) ? n : null);
    }
    _onBlur() {
        this._inputEl.value = this._formatValue(this.value);
    }
    _onKeyDown(e) {
        const increment = (direction) => {
            e.preventDefault();
            const v = this.step ?? 1;
            this._updateValue((this.value ?? 0) + (v * (e.shiftKey ? 10 : 1) * direction));
        };
        switch (e.key) {
            case 'ArrowUp':
                increment(1);
                break;
            case 'ArrowDown':
                increment(-1);
                break;
        }
    }
    _onClearValue() {
        this.clearValue();
        this.focus();
    }
    _updateValue(value) {
        if (value != null) {
            if (this.max != null)
                value = Math.min(value, this.max);
            if (this.min != null)
                value = Math.max(value, this.min);
        }
        this._value = InputNumber.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }
    _formatValue(n) {
        return n?.toString().replace('.', ',') ?? '';
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    hasSameValueAs(value) {
        return this.value === value;
    }
    focus() {
        this._inputEl.focus();
        this.fireFocusEvent();
    }
    blur() {
        this._inputEl.blur();
        this.fireBlurEvent();
    }
    // Attributes
    static get observedAttributes() {
        return ['autocomplete', 'readonly', 'disabled', 'placeholder', 'label', 'min', 'max', 'step', 'value'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'value':
                this.value = newValue ? parseFloat(newValue) : null;
                break;
            case 'min':
                this.min = newValue ? parseFloat(newValue) : null;
                break;
            case 'max':
                this.max = newValue ? parseFloat(newValue) : null;
                break;
            case 'step':
                this.step = newValue ? parseFloat(newValue) : null;
                break;
            case 'placeholder':
                this.placeholder = newValue;
                break;
            case 'disabled':
                this.disabled = newValue !== null;
                break;
            case 'readonly':
                this.readOnly = newValue !== null;
                break;
            case 'autocomplete':
                this.autocomplete = newValue !== null;
                break;
        }
    }
    getTemplate() {
        return html `
            ${style}

            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${() => this._onClearValue()}>
                    <!-- TODO: --> Clear
                </div>

                <input
                    id="input"
                    @input=${() => this._onInput()} 
                    @blur=${() => this._onBlur()}
                    @keydown=${(e) => this._onKeyDown(e)}
                    .value=${this._formatValue(this.value)}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .inputMode=${this.inputMode == "" /* Default */ ? this._computedInputMode : this.inputMode}
                    placeholder=${this.placeholder ? this.placeholder : ''}
                    type="text">
            </div>
        `;
    }
}
InputNumber.registerCustomElement('input-number');
