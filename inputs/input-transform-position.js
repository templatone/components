import { html } from "../node_modules/lit-html/lit-html.js";
import { Input } from "./Input.js";
import { UIIcon } from "../ui-icon.js";
const style = html `
<style>
    :host {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: stretch;
        box-sizing: border-box;
    }

    #container {
        --text-color: var(--system-color-label);
        --background-color: var(--system-color-base);
        --outline-color: var(--system-color-gray2);

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        overflow: hidden;
        border: 2px solid;
        border-radius: 6px;

        color: var(--text-color);
        background-color: var(--background-color);
        border-color: var(--outline-color);
    }

    #container:focus-within {
        --outline-color: var(--system-color-gray1);
    }

    #container[disabled] {
        --text-color: var(--system-color-gray3);
        --background-color: var(--system-color-gray6);
        --outline-color: var(--system-color-gray4);
    }

    label {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        max-height: 100%;
        min-height: 32px;
        font-weight: 500;
        color: var(--system-color-gray1);
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
export class InputTransformPosition extends Input {
    constructor() {
        super();
        // Properties
        this.defaultValue = { x: 0, y: 0 };
        this._value = { x: 0, y: 0 };
        this._placeholder = null;
        this._disabled = false;
        this._readOnly = false;
        this._xInputEl = this.shadowRoot.getElementById('xInput');
        this._yInputEl = this.shadowRoot.getElementById('yInput');
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
    _onInput() {
        console.log("_onInput");
        const x = parseFloat(this._xInputEl.value);
        const y = parseFloat(this._yInputEl.value);
        const value = {
            x: !isNaN(x) ? x : this.defaultValue.x,
            y: !isNaN(y) ? y : this.defaultValue.y,
        };
        this._updateValue(value);
    }
    _onClearValue() {
        this.clearValue();
        this.focus();
    }
    _updateValue(value) {
        this.value = InputTransformPosition.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    hasSameValueAs(value) {
        const x1 = this.value?.x ?? (this.defaultValue?.x ?? 0);
        const y1 = this.value?.y ?? (this.defaultValue?.y ?? 0);
        const x2 = value?.x ?? (this.defaultValue?.x ?? 0);
        const y2 = value?.y ?? (this.defaultValue?.y ?? 0);
        return x1 === x2 && y1 === y2;
    }
    focus() {
        this._xInputEl.focus();
        this.fireFocusEvent();
    }
    blur() {
        this._xInputEl.blur();
        this._yInputEl.blur();
        this.fireBlurEvent();
    }
    // Attributes
    static get observedAttributes() {
        return ['autocomplete', 'readonly', 'disabled', 'placeholder', 'value'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            // TODO:
            // case 'value':
            //     this.value = newValue ?? "";
            //     break;
            case 'placeholder':
                this.placeholder = newValue;
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
        // Elements
        UIIcon;
        return html `
            ${style}

            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
                <label for="xInput">x</label>
                <input id="xInput" @input=${(e) => this._onInput()}
                .value=${this.value?.x ?? 0}
                .disabled=${this.disabled}
                .readOnly=${this.readOnly}
                .autocomplete=${false}
                .inputMode=${"numeric" /* Numeric */}
                .placeholder="${this.defaultValue?.x ?? 0}"
                type="text">

                <label for="yInput">y</label>
                <input id="yInput" @input=${(e) => this._onInput()}
                .value=${this.value?.y ?? 0}
                .disabled=${this.disabled}
                .readOnly=${this.readOnly}
                .autocomplete=${false}
                .inputMode=${"numeric" /* Numeric */}
                .placeholder="${this.defaultValue?.y ?? 0}"
                type="text">
            
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${() => this._onClearValue()}>
                    <ui-icon .glyph=${"clear" /* Clear */}></ui-icon>
                </div>
            </div>
        `;
    }
}
InputTransformPosition.registerCustomElement('input-transform-position');
