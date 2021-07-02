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
import {Numbers, Strings} from "../web-modules/pkg/@templatone/utils.js";
import {InputElement} from "./core/InputElement.js";
export let InputTimeElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.defaultValue = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    };
    this.value = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    };
    this.disabled = false;
    this.readOnly = false;
    this.precision = 2;
  }
  _evaluateInput(input, max, nextInput) {
    const raw = input.value;
    const cursor = input.selectionStart ?? 0;
    const raw1 = raw.substring(0, cursor);
    const raw2 = raw.substring(cursor, raw.length);
    const part1 = raw1.match(InputTimeElement.regexp.numbers)?.join("") ?? "";
    const part2 = raw2.match(InputTimeElement.regexp.numbers)?.join("") ?? "";
    const cleaned = part1 + part2;
    const parsedValue = parseInt(cleaned, 10);
    let finalValue = 0;
    if (!isNaN(parsedValue)) {
      finalValue = Numbers.limit(parsedValue, 0, max);
      if (finalValue == parsedValue) {
        input.value = cleaned;
        input.selectionStart = part1.length;
        input.selectionEnd = part1.length;
      } else {
        input.value = finalValue.toString();
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
      }
    }
    const separators = [" ", ",", ":", ";", "-", "/", "\\"];
    const last = raw.substring(raw.length - 1, raw.length);
    if (!isNaN(parsedValue) && separators.indexOf(last) >= 0) {
      nextInput.focus();
      nextInput.setSelectionRange(0, nextInput.value.length);
    }
    return finalValue;
  }
  _onInputHours() {
    const hours = this._evaluateInput(this._hours, 23, this._minutes);
    if (this.value != null || hours != null) {
      this._updateValue({
        hours: hours ?? 0,
        minutes: this.value?.minutes ?? 0,
        seconds: this.value?.seconds ?? 0,
        miliseconds: this.value?.miliseconds ?? 0
      });
    } else {
      this._updateValue(this.defaultValue);
    }
  }
  _onInputMinutes() {
    const minutes = this._evaluateInput(this._minutes, 59, this._seconds);
    if (this.value != null || minutes != null) {
      this._updateValue({
        hours: this.value?.hours ?? 0,
        minutes: minutes ?? 0,
        seconds: this.value?.seconds ?? 0,
        miliseconds: this.value?.miliseconds ?? 0
      });
    } else {
      this._updateValue(this.defaultValue);
    }
  }
  _onInputSeconds() {
    const seconds = this._evaluateInput(this._seconds, 59, this._miliseconds);
    if (this.value != null || seconds != null) {
      this._updateValue({
        hours: this.value?.hours ?? 0,
        minutes: this.value?.minutes ?? 0,
        seconds: seconds ?? 0,
        miliseconds: this.value?.miliseconds ?? 0
      });
    } else {
      this._updateValue(this.defaultValue);
    }
  }
  _onInputMiliseconds() {
    const miliseconds = this._evaluateInput(this._miliseconds, 999, this._hours);
    if (this.value != null || miliseconds != null) {
      this._updateValue({
        hours: this.value?.hours ?? 0,
        minutes: this.value?.minutes ?? 0,
        seconds: this.value?.seconds ?? 0,
        miliseconds: miliseconds ?? 0
      });
    } else {
      this._updateValue(this.defaultValue);
    }
  }
  _onBlurHours() {
    this._updateIU();
  }
  _onBlurMinutes() {
    this._updateIU();
  }
  _onBlurSeconds() {
    this._updateIU();
  }
  _onBlurMiliseconds() {
    this._updateIU();
  }
  _updateIU() {
    this._updateUIHours();
    this._updateUIMinutes();
    this._updateUISeconds();
    this._updateUIMiliseconds();
  }
  _updateUIHours() {
    this._hours.value = this.value ? Strings.padLeft(this.value.hours.toString(), 2, "0") : "";
  }
  _updateUIMinutes() {
    this._minutes.value = this.value ? Strings.padLeft(this.value.minutes.toString(), 2, "0") : "";
  }
  _updateUISeconds() {
    this._seconds.value = this.value ? Strings.padLeft(this.value.seconds.toString(), 2, "0") : "";
  }
  _updateUIMiliseconds() {
    this._miliseconds.value = this.value ? Strings.padLeft(this.value.miliseconds.toString(), 3, "0") : "";
  }
  _onClearValue() {
    this.clearValue();
    setTimeout(() => this.focus(), 1);
  }
  _updateValue(value) {
    this.value = InputTimeElement.applyFilters(this.filters, {...value});
    this.fireUpdateEvent();
    this._updateIU();
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  hasSameValueAs(value) {
    if (this.value != null && value != null) {
      return this.value.hours == value.hours && this.value.minutes == value.minutes && this.value.seconds == value.seconds && this.value.miliseconds == value.miliseconds;
    }
    return this.value === value;
  }
  focus() {
    this._hours.focus();
    this._hours.setSelectionRange(0, this._hours.value.length);
    this.fireFocusEvent();
  }
  blur() {
    this._hours.blur();
    this._minutes.blur();
    this._seconds.blur();
    this._miliseconds.blur();
    this.fireBlurEvent();
  }
  render() {
    return html`
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
            
                <input ?hidden=${this.precision < 1} id="hours" @input=${(e) => this._onInputHours()}
                    @blur=${() => this._onBlurHours()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autofocus=${this.autofocus}
                    placeholder="h"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 2} class="separator">:</span>
            
                <input ?hidden=${this.precision < 2} id="minutes" @input=${(e) => this._onInputMinutes()}
                    @blur=${() => this._onBlurMinutes()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="min"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 3} class="separator">:</span>
            
                <input ?hidden=${this.precision < 3} id="seconds" @input=${(e) => this._onInputSeconds()}
                    @blur=${() => this._onBlurSeconds()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="s"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 4} class="separator">,</span>
            
                <input ?hidden=${this.precision < 4} id="miliseconds" @input=${(e) => this._onInputMiliseconds()}
                    @blur=${() => this._onBlurMiliseconds()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="ms"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <div class="actionButton" ?hidden=${this.hasSameValueAs(this.defaultValue)} @click=${() => this._onClearValue()}>
                    <div class="icon">${clearIcon}</div>
                </div>
            </div>
        `;
  }
};
InputTimeElement.regexp = {
  numbers: /[0-9]+/g
};
InputTimeElement.styles = css`
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
            justify-content: space-between;
            align-items: stretch;
            overflow: hidden;
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
            min-width: 2em;
            max-height: 100%;
            min-height: 32px;
            box-sizing: border-box;
            border: none;
            outline: 0;
            outline: none;
            padding: 4px 0;
            margin: 0;
            font-family: inherit;
            font-size: 19px;
            text-align: center;
            line-height: 24px;
            color: var(--system-color-label);
            font-variant-numeric: tabular-nums;
            -moz-font-feature-settings: "tnum";
            -webkit-font-feature-settings: "tnum";
            font-feature-settings: "tnum";
            background-color: inherit;
        }

        input::placeholder {
            color: var(--system-color-grey3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .actionButton {
            cursor: pointer;
            margin: 4px;
            flex-shrink: 0;
            fill: var(--x-border-color);
        }

        .actionButton:hover {
            fill: var(--system-color-grey2);
        }

        #container[disabled] .actionButton,
        #container:not([filled]) .actionButton {
            display: none;
        }

        .flexspace {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .separator {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        [hidden] {
            display: none;
        }
    `;
__decorate([
  property({
    attribute: true,
    converter: (v) => {
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      let miliseconds = 0;
      if (v !== null) {
        const time = parseInt(v, 10);
        const date = new Date(time);
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        miliseconds = date.getMilliseconds();
      }
      return {hours, minutes, seconds, miliseconds};
    },
    hasChanged: (val, old) => {
      console.log(val, old);
      return false;
    }
  })
], InputTimeElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTimeElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTimeElement.prototype, "readOnly", 2);
__decorate([
  property({
    attribute: true,
    type: Number,
    converter: (v) => parseInt(v ?? "2", 10)
  })
], InputTimeElement.prototype, "precision", 2);
__decorate([
  query("#hours")
], InputTimeElement.prototype, "_hours", 2);
__decorate([
  query("#minutes")
], InputTimeElement.prototype, "_minutes", 2);
__decorate([
  query("#seconds")
], InputTimeElement.prototype, "_seconds", 2);
__decorate([
  query("#miliseconds")
], InputTimeElement.prototype, "_miliseconds", 2);
InputTimeElement = __decorate([
  customElement("input-time")
], InputTimeElement);
