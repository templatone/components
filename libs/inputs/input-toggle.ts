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


export type ToggleValue = boolean;

export class InputToggle extends Input<ToggleValue> implements IInput<ToggleValue> {

    // Properties
    readonly defaultValue: ToggleValue = false;

    private _value: ToggleValue = false;
    get value(): ToggleValue { return this._value; }
    set value(v: ToggleValue) {
        this._value = v;
        this.invalidate();
    }


    get checked(): boolean { return this.value === true; }
    set checked(checked: boolean) { this.value = checked; }


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


    //
    private _pointerActive: boolean = false;
    private _pointerMovements: number[] = [];
    private _pointerLastX: number = NaN;
    private _skipClick: boolean = false;


    constructor() {
        super();

        // Elements
        this._containerEl = this.shadowRoot!.getElementById('container') as HTMLElement;

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
        window.addEventListener('touchmove', (e: TouchEvent) => this._onPointerMove(e), listenerOptions);
    }


    // Actions
    private _onPointerStart(e: MouseEvent | TouchEvent) {
        this._containerEl.focus();

        this._pointerActive = true;
        this._pointerMovements = [];
        this._pointerLastX = NaN;

        this._onPointerMove(e);
    }


    private _onPointerEnd(e: MouseEvent | TouchEvent, mayClicked: boolean = false) {
        if (this.disabled || this.readOnly) return;

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

        if (isNaN(this._pointerLastX)) {
            this._pointerLastX = clientX;
        } else {
            this._pointerMovements.push(clientX - this._pointerLastX);
            this._pointerLastX = clientX
        }

        if (this._pointerMovements.length > 8) {
            this._pointerMovements = this._pointerMovements.slice(this._pointerMovements.length - 32);

            const movement = this._pointerMovements.reduce((acc, n) => acc += n, 0);

            if (movement > 8 && this.value == false) {
                this._skipClick = true;
                this._updateValue(true);

            } else if (movement < -8 && this.value == true) {
                this._skipClick = true;
                this._updateValue(false);
            }
        }
    }


    private _onKeyboard(e: KeyboardEvent) {
        if (this.disabled || this.readOnly) return;

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


    private _updateValue(value: ToggleValue): void {
        this._value = InputToggle.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: ToggleValue): boolean {
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
                <div id="bar">
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }
}

InputToggle.registerCustomElement('input-toggle');