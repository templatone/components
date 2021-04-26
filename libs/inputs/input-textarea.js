import { html } from "../../node_modules/lit-html/lit-html.js";
import { Input } from "./Input.js";
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

    textarea {
        display: block;
        resize: vertical;
        width: 100%;
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
    }

    textarea::placeholder {
        color: var(--system-color-gray3);
    }

    #container[disabled] textarea::placeholder {
        color: transparent;
    }

    [hidden] {
        display: none;
    }
</style>
`;
export class InputTextarea extends Input {
    constructor() {
        super();
        // Properties
        this.defaultValue = '';
        this._value = '';
        this._placeholder = null;
        this._disabled = false;
        this._readOnly = false;
        this._autocomplete = false;
        this._input = this.shadowRoot.getElementById('input');
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
    _onInput() {
        const value = this._input.value;
        this._updateValue(value);
    }
    _updateValue(value) {
        this._value = InputTextarea.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    hasSameValueAs(value) {
        return this.value === value;
    }
    focus() {
        this._input.focus();
        this.fireFocusEvent();
    }
    blur() {
        this._input.blur();
        this.fireBlurEvent();
    }
    // Attributes
    static get observedAttributes() {
        return ['autocomplete', 'readonly', 'disabled', 'placeholder', 'value'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'value':
                this.value = newValue ?? "";
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

            <div id="container" ?disabled=${this.disabled}>
                <textarea
                    id="input"
                    @input=${(e) => this._onInput()} 
                    .value=${this.value}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    placeholder=${this.placeholder ? this.placeholder : ''}></textarea>
            </div>
        `;
    }
}
InputTextarea.registerCustomElement('input-textarea');
