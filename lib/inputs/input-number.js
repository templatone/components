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
import {InputElement} from "./core/InputElement.js";
import {clear as clearIcon, reset as resetIcon} from "../assets/icons.js";
import {InputModeType} from "./core/InputModeType.js";
import {AutocompleteType} from "./core/AutocompleteType.js";
const regex = {
  spaces: /\s+/g,
  validChars: /[^0-9,.+\- ]/g,
  decimalSeparator: /\.|\,/
};
const converterNumberOrNull = (attributeName, v) => {
  if (v !== null) {
    const n = parseFloat(v);
    if (!isNaN(n)) {
      return n;
    } else {
      console.error(`InputNumberElement - convert attribute ${attributeName} unexpected value.`);
      return null;
    }
  } else {
    return null;
  }
};
export let InputNumberElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.emptyValue = 0;
    this.defaultValue = 0;
    this.min = null;
    this.max = null;
    this.step = null;
    this.value = 0;
    this.placeholder = null;
    this.disabled = false;
    this.readOnly = false;
    this.autocomplete = AutocompleteType.Off;
    this.inputMode = InputModeType.Default;
    this.name = "";
  }
  _computeInputMode() {
    if (this.inputMode === InputModeType.Default) {
      return Number.isInteger(this.step) ? InputModeType.Decimal : InputModeType.Numeric;
    } else {
      return this.inputMode;
    }
  }
  _onInput() {
    const rawValue = this._input.value;
    const rawParts = rawValue.split(regex.decimalSeparator);
    if (rawParts.length == 1) {
      rawParts.push("");
    } else if (rawParts.length >= 3) {
      rawParts[1] = rawParts.slice(1).join("");
    }
    rawParts.splice(2);
    const parts = rawParts.map((v) => {
      return v.replace(regex.validChars, "").replace(regex.spaces, "").replace(regex.decimalSeparator, "").replace("+", "");
    });
    const value = [
      parts[0].length != 0 ? parts[0] : 0,
      parts[1].length != 0 ? parts[1] : 0
    ].join(".");
    const n = parseFloat(value);
    this._updateValue(n);
  }
  _onFocus() {
    if (this.value == 0) {
      this._input.select();
    }
  }
  _onBlur() {
    this._input.value = this._formatValue(this.value);
  }
  _onKeyDown(e) {
    const increment = (direction) => {
      e.preventDefault();
      const v = this.step ?? 1;
      this._updateValue((this.value ?? 0) + v * (e.shiftKey ? 10 : 1) * direction);
      this._input.select();
    };
    switch (e.key) {
      case "ArrowUp":
        increment(1);
        break;
      case "ArrowDown":
        increment(-1);
        break;
    }
  }
  _onClearValue() {
    this.clearValue();
    setTimeout(() => this.focus(), 1);
  }
  _updateValue(value) {
    if (value != null) {
      if (this.max != null)
        value = Math.min(value, this.max);
      if (this.min != null)
        value = Math.max(value, this.min);
    }
    this.value = InputNumberElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  _formatValue(n) {
    return n?.toString().replace(".", ",") ?? "";
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  hasSameValueAs(value) {
    return this.value === value;
  }
  focus() {
    this._input.focus();
    this._input.setSelectionRange(this._input.value.length, this._input.value.length);
    this.fireFocusEvent();
  }
  blur() {
    this._input.blur();
    this.fireBlurEvent();
  }
  render() {
    return html`
            <div id="container" ?disabled=${this.disabled} ?readOnly=${this.readOnly} ?filled=${this.value != null}>
                <div class="actionButton"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${this._onClearValue.bind(this)}>
                    ${this.defaultValue == this.emptyValue ? clearIcon : resetIcon}
                </div>
            
                <input id="input" @input=${() => this._onInput()}
                    @focus=${this._onFocus.bind(this)}
                    @blur=${this._onBlur.bind(this)}
                    @keydown=${(e) => this._onKeyDown(e)}
                    .name=${this.name}
                    .value=${this._formatValue(this.value)}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .autofocus=${this.autofocus}
                    .inputMode=${this._computeInputMode()}
                    .placeholder=${this.placeholder ? this.placeholder : ""}
                    type="text">
            </div>
        `;
  }
};
InputNumberElement.styles = css`
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
            color: var(--system-color-grey3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .actionButton {
            outline: 0;
            cursor: pointer;
            margin: 4px;
            flex-shrink: 0;
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
__decorate([
  property({
    attribute: true,
    converter: (v) => converterNumberOrNull("min", v)
  })
], InputNumberElement.prototype, "min", 2);
__decorate([
  property({
    attribute: true,
    converter: (v) => converterNumberOrNull("max", v)
  })
], InputNumberElement.prototype, "max", 2);
__decorate([
  property({
    attribute: true,
    converter: (v) => converterNumberOrNull("step", v)
  })
], InputNumberElement.prototype, "step", 2);
__decorate([
  property({type: Number})
], InputNumberElement.prototype, "value", 2);
__decorate([
  property({attribute: true, converter: (v) => v?.trim() != "" ? v : null})
], InputNumberElement.prototype, "placeholder", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputNumberElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputNumberElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true, type: String})
], InputNumberElement.prototype, "autocomplete", 2);
__decorate([
  property({attribute: true})
], InputNumberElement.prototype, "inputMode", 2);
__decorate([
  property({attribute: true})
], InputNumberElement.prototype, "name", 2);
__decorate([
  query("#input")
], InputNumberElement.prototype, "_input", 2);
InputNumberElement = __decorate([
  customElement("input-number")
], InputNumberElement);
