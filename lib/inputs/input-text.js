var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {css, html} from "../web-modules/pkg/lit.js";
import {customElement, property, query} from "../web-modules/pkg/lit/decorators.js";
import {clear as clearIcon} from "../assets/icons.js";
import {AutocompleteType} from "./core/AutocompleteType.js";
import {InputElement} from "./core/InputElement.js";
import {InputModeType} from "./core/InputModeType.js";
export let InputTextElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.defaultValue = "";
    this.value = "";
    this.placeholder = null;
    this.disabled = false;
    this.readOnly = false;
    this.autocomplete = AutocompleteType.Off;
    this.inputMode = InputModeType.Default;
  }
  _onInput() {
    const value = this._input.value;
    this._updateValue(value);
  }
  _onClearValue() {
    this.clearValue();
    this.focus();
  }
  _updateValue(value) {
    this.value = InputTextElement.applyFilters(this.filters, value);
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
  render() {
    return html`
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
                <input id="input" @input=${(e) => this._onInput()}
                .value=${this.value}
                ?disabled=${this.disabled}
                ?readOnly=${this.readOnly}
                .autocomplete=${this.autocomplete ? "on" : "off"}
                .inputMode=${this.inputMode}
                placeholder=${this.placeholder ? this.placeholder : ""}
                type="text">
            
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${() => this._onClearValue()}>
                    ${clearIcon}
                </div>
            </div>
        `;
  }
};
InputTextElement.styles = css`
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
    `;
__decorate([
  property()
], InputTextElement.prototype, "value", 2);
__decorate([
  property({attribute: true, converter: (v) => v?.trim() != "" ? v : null})
], InputTextElement.prototype, "placeholder", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTextElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTextElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true, type: String})
], InputTextElement.prototype, "autocomplete", 2);
__decorate([
  property({attribute: true})
], InputTextElement.prototype, "inputMode", 2);
__decorate([
  query("#input")
], InputTextElement.prototype, "_input", 2);
InputTextElement = __decorate([
  customElement("input-text")
], InputTextElement);
