import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import {
    visibility as visibilityIcon,
    visibilityOff as visibilityOffIcon,
} from '../assets/icons.js';
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';


export type InputPasswordValue = string;


@customElement('input-password')
export class InputPasswordElement extends InputElement<InputPasswordValue> implements ITextBasedInputElement<InputPasswordValue> {
    // Properties
    readonly emptyValue: InputPasswordValue = '';
    defaultValue: InputPasswordValue = '';

    @state()
    private _value: InputPasswordValue = '';


    get value(): InputPasswordValue {
        return this._value;
    };


    set value(v: InputPasswordValue) {
        this._value = v;
        this._reflectValueToView();
    };


    @property({ attribute: true, converter: (v) => v?.trim() != "" ? v : null  })
    placeholder: string | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, type: String })
    autocomplete: AutocompleteType = AutocompleteType.Off;


    @property({ attribute: true })
    inputMode: InputModeType = InputModeType.Default;


    @property({ attribute: true })
    name: string = '';


    @query('#input')
    private _input!: HTMLInputElement;


    @state()
    private _passwordVisibilityToggle: boolean = false;


    private _onInput() {
        const value = this._input.value;
        this._updateValue(value);
    }


    private _passwordVisibilityOn() {
        this._passwordVisibilityToggle = true;
    }


    private _passwordVisibilityOff() {
        this._passwordVisibilityToggle = false;
    }


    private _onPasswordVisibilityOn() {
        this._passwordVisibilityOn();
        setTimeout(() => this.focus(), 1);
    }


    private _onPasswordVisibilityOff() {
        this._passwordVisibilityOff();
        setTimeout(() => this.focus(), 1);
    }


    private _updateValue(value: InputPasswordValue): void {
        this._value = InputPasswordElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    private _reflectValueToView(): void {
        this._input.value = this._value;
    }


    clearValue() {
        this._updateValue(this.defaultValue);
        this._reflectValueToView();
    }


    hasSameValueAs(value: InputPasswordValue): boolean {
        return this._value === value;
    }


    focus() {
        this._input.focus();
        this._input.setSelectionRange(this._input.value.length, this._input.value.length);
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
        this._reflectValueToView();
        this.fireBlurEvent();
    }


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?readOnly=${this.readOnly} ?filled=${this._value !=null}>
                <input id="input"
                    @input=${this._onInput.bind(this)}
                    @blur=${this._passwordVisibilityOff.bind(this)}
                    .name=${this.name}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete ? 'on' : 'off'}
                    .autofocus=${this.autofocus}
                    .inputMode=${this.inputMode}
                    .placeholder=${this.placeholder ? this.placeholder : ''}
                    .type="${!this._passwordVisibilityToggle ? 'password' : 'text'}">
            
                <div class="actionButton"
                    tabindex="-1"
                    ?hidden=${this._passwordVisibilityToggle || this.hasSameValueAs(this.defaultValue)}
                    @click=${this._onPasswordVisibilityOn.bind(this)}>
                    ${visibilityIcon}
                </div>

                <div class="actionButton"
                    tabindex="-1"
                    ?hidden=${!this._passwordVisibilityToggle || this.hasSameValueAs(this.defaultValue)}
                    @click=${this._onPasswordVisibilityOff.bind(this)}>
                    ${visibilityOffIcon}
                </div>
            </div>
        `;
    }


    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            box-sizing: border-box;
        }

        #container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: stretch;
            overflow: hidden;
            box-sizing: border-box;
            border: 2px solid;
            border-radius: 6px;

            color: var(--system-color-label);
            background-color: var(--system-color-base);
            border-color: var(--system-color-grey2);
        }

        #container:focus-within {
            border-color: var(--system-color-grey1);
        }

        #container[disabled] {
            color: var(--system-color-grey3);
            background-color: var(--system-color-grey6);
            border-color: var(--system-color-grey4);
        }

        input {
            display: block;
            flex-shrink: 1;
            flex-grow: 0;

            width: 100%;
            min-width: 0%;
            max-width: 100%;

            height: 100%;
            min-height: 32px;
            max-height: 100%;

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
            color: var(--system-color-grey3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .actionButton {
            user-select: none;
            display: block;
            flex-shrink: 0;
            flex-grow: 0;
            outline: 0;
            cursor: pointer;
            margin: 4px;
            color: var(--system-color-grey2);
        }

        .actionButton > svg {
            display: block;
            width: 24px;
            height: 24px;
        }

        .actionButton:hover,
        .actionButton:focus {
            color: var(--system-color-grey1);
        }

        #container[disabled] .actionButton,
        #container:not([filled]) .actionButton,
        #container[readOnly] .actionButton {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
}