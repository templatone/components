import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
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
        --x-size: 24px;
        --x-border-color: var(--system-color-gray1);

        outline: 0;
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        border-radius: var(--x-size);
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
        border-radius: var(--x-size);
        background-color: var(--system-color-base);
        border: 2px solid var(--x-border-color);
    }

    [disabled] #track {
        background-color: transparent;
        color: var(--system-color-gray3);
    }

    #fill {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--x-size);
        height: var(--x-size);
        margin-bottom: calc(var(--x-size) * -1);
        border-radius: var(--x-size);
        background-color: var(--system-accentColor);
        transition: width .16s;
    }

    #fill:active {
        background-color: var(--system-accentColor-hover);
    }

    #fill::before {
        display: block;
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: #fff;
    }

    [disabled] #fill {
        background-color: var(--system-color-gray3);
    }
    
    :not([checked]) #fill {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;


export type RadioValue = boolean;

export class InputRadio extends Input<RadioValue> implements IInput<RadioValue> {

    // Properties
    readonly defaultValue: RadioValue = false;

    private _value: RadioValue = false;
    get value(): RadioValue { return this._value; }
    set value(v: RadioValue) {
        this._value = v;
        this.invalidate();
    }


    get checked(): boolean { return this.value === true; }
    set checked(v: boolean) { this.value = v; }


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


    constructor() {
        super();

        // Elements
        this._containerEl = this.shadowRoot!.getElementById('container') as HTMLElement;

        // Event listeners
        const listenerOptions = { capture: false, passive: false };

        this._containerEl.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);
        this._containerEl.addEventListener('click', (e) => this._onPointer(e), listenerOptions);
        this._containerEl.addEventListener('touchend', (e) => this._onPointer(e), listenerOptions);
    }


    // Actions
    private _onPointer(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;

        if (!(e instanceof MouseEvent) && e.touches.length > 1) return;
        e.preventDefault();

        if (!this.value) this._updateValue(true);
    }


    private _onKeyboard(e: KeyboardEvent) {
        if (this.disabled || this.readOnly) return;

        switch (e.code) {
            case 'Enter':
            case 'Space':
                if (!this.value) this._updateValue(true);
                break;

            default: return;
        }

        e.preventDefault();
        e.stopPropagation();
    }


    private _updateValue(value: RadioValue): void {
        this._value = InputRadio.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: RadioValue): boolean {
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


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
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


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <div id="container" tabindex="0" ?checked=${this.value} ?disabled=${this.disabled}>
                <div id="track"></div>
                <div id="fill"></div>
            </div>
        `;
    }
}

InputRadio.registerCustomElement('input-radio');