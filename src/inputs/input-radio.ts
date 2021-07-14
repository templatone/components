import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";


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
        --x-border-color: var(--system-color-grey1);

        outline: 0;
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        border-radius: var(--x-size);
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
        border-radius: var(--x-size);
        background-color: var(--system-color-base);
        border: 2px solid var(--x-border-color);
    }

    [disabled] #track {
        background-color: transparent;
        color: var(--system-color-grey3);
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
        background-color: var(--system-color-grey3);
    }
    
    :not([checked]) #fill {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;


export type InputRadioValue = boolean;


@customElement('input-radio')
export class InputRadioElement extends InputElement<InputRadioValue> implements IInputElement<InputRadioValue> {
    readonly emptyValue: InputRadioValue = false;
    defaultValue: InputRadioValue = false;


    @property({ type: Boolean })
    value: InputRadioValue = false;


    get checked(): boolean { return this.value === true; }
    set checked(v: boolean) { this.value = v; }


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


    private _updateValue(value: InputRadioValue): void {
        this.value = InputRadioElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: InputRadioValue): boolean {
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
                ?checked=${this.value}
                ?disabled=${this.disabled}
                @keydown=${(e: KeyboardEvent) => this._onKeyboard(e) }
                @click=${(e: MouseEvent) => this._onPointer(e) }
                @touchend=${(e: TouchEvent) => this._onPointer(e) }">
                <div id="track"></div>
                <div id="fill"></div>
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
            border-radius: var(--x-size);
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
            border-radius: var(--x-size);
            background-color: var(--system-color-base);
            border: 2px solid var(--x-border-color);
        }

        [disabled] #track {
            background-color: transparent;
            color: var(--system-color-grey3);
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
            background-color: var(--system-color-grey3);
        }
        
        :not([checked]) #fill {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
}