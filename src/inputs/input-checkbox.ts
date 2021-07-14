import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";


const enum CheckboxValueOption {
    Unchecked = -1,
    Indeterminate = 0,
    Checked = 1,
}


export type InputCheckboxValue = CheckboxValueOption;


@customElement('input-checkbox')
export class InputCheckboxElement extends InputElement<InputCheckboxValue> implements IInputElement<InputCheckboxValue> {
    readonly emptyValue: InputCheckboxValue = CheckboxValueOption.Unchecked;

    defaultValue: InputCheckboxValue = CheckboxValueOption.Unchecked;


    // Properties
    @property({ type: Number })
    value: InputCheckboxValue = CheckboxValueOption.Unchecked;


    set checked(v: boolean) { this.value = v ? CheckboxValueOption.Checked : CheckboxValueOption.Unchecked; }
    get checked(): boolean { return this.value === CheckboxValueOption.Checked; }


    set indeterminate(v: boolean) { this.value = v ? CheckboxValueOption.Indeterminate : CheckboxValueOption.Unchecked; }
    get indeterminate(): boolean { return this.value === CheckboxValueOption.Indeterminate; }


    // TODO:
    // private _disabled: boolean = false;
    // get disabled(): boolean { return this._disabled; }
    // set disabled(v: boolean) {
    //     this._disabled = v;
    //     this.invalidate();

    //     if (!v) this._container.setAttribute('tabindex', '0');
    //     else this._container.removeAttribute('tabindex');
    // }


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @query('#container')
    private _container!: HTMLElement;


    // constructor() {
    //     super();

    //     // Elements
    //     this._container = this.shadowRoot!.getElementById('container') as HTMLElement;

    //     // Event listeners
    //     const listenerOptions = { capture: false, passive: false };

    //     this._container.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);
    //     this._container.addEventListener('click', (e) => this._onPointer(e), listenerOptions);
    //     this._container.addEventListener('touchend', (e) => this._onPointer(e), listenerOptions);
    // }


    private _negateValue(value: InputCheckboxValue): InputCheckboxValue {
        return value === CheckboxValueOption.Checked ? CheckboxValueOption.Unchecked : CheckboxValueOption.Checked
    }


    // Actions
    private _onPointer(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;
        
        console.log("_onPointer", this.value);

        if (!(e instanceof MouseEvent) && e.touches.length > 1) return;
        e.preventDefault();

        this._updateValue(this._negateValue(this.value));
    }


    private _onKeyboard(e: KeyboardEvent) {
        if (this.disabled || this.readOnly) return;

        let value = this.value;

        switch (e.code) {
            case 'Enter':
            case 'Space':
                value = this._negateValue(this.value);
                break;

            default: return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (this.value != value) {
            this._updateValue(value);
        }
    }


    private _updateValue(value: InputCheckboxValue): void {
        this.value = InputCheckboxElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: InputCheckboxValue): boolean {
        return this.value === value;
    }


    focus() {
        this._container.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._container.blur();
        this.fireBlurEvent();
    }


    render() {
        return html`
            <div id="container"
                tabindex="0"
                ?checked=${this.checked}
                ?disabled=${this.disabled}
                @keydown=${(e: KeyboardEvent) => this._onKeyboard(e) }
                @click=${(e: MouseEvent) => this._onPointer(e) }
                @touchend=${(e: TouchEvent) => this._onPointer(e) }">
                <div id="track"></div>
                <div id="fill">
                    <svg ?hidden=${!this.checked} viewBox="0 0 21 21">
                        <polygon points="16.1,5.1 8.5,12.7 4.9,9.1 3.5,10.5 8.5,15.5 17.5,6.5 "/>
                    </svg>

                    <svg ?hidden=${!this.indeterminate} viewBox="0 0 21 21">
                        <path d="M16,11.5H5v-2h11V11.5z"/>
                    </svg>
                </div>
            </div>
        `;
    }

    
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        #container {
            --x-size: 24px;
            --x-border-color: var(--system-color-grey1);

            outline: 0;
            display: block;
            width: var(--x-size);
            height: var(--x-size);
            border-radius: 6px;
        }

        #container:not(:focus-within) {
            --x-border-color: var(--system-color-grey2);
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
            color: var(--system-color-grey3);
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
    `;
}