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
import {Numbers} from "../web-modules/pkg/@templatone/utils.js";
import {css, html} from "../web-modules/pkg/lit.js";
import {customElement, property, query} from "../web-modules/pkg/lit/decorators.js";
import {InputElement} from "./core/InputElement.js";
export let InputSliderElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = null;
    this.disabled = false;
    this.readOnly = false;
    this._pointerActive = false;
  }
  get defaultValue() {
    return this.min;
  }
  connectedCallback() {
    super.connectedCallback();
    console.log("connectedCallback");
    const listenerOptions = {capture: false, passive: false};
    window.addEventListener("mouseup", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("mouseleave", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("touchend", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("touchcancel", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("mousemove", (e) => this._onPointerMove(e), listenerOptions);
    window.addEventListener("touchmove", (e) => this._onPointerMove(e), listenerOptions);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  firstUpdated() {
    console.log("firstUpdated");
    this._updateUI();
  }
  _onPointerStart(e) {
    if (this.disabled || this.readOnly)
      return;
    this._container.focus();
    this._pointerActive = true;
    this._onPointerMove(e);
  }
  _onPointerEnd(e) {
    this._pointerActive = false;
  }
  _onPointerMove(e) {
    if (this.disabled || this.readOnly)
      return;
    if (!this._pointerActive)
      return;
    let clientX;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    } else {
      if (e.touches.length >= 2)
        return;
      const touch = e.touches[0];
      clientX = touch.clientX;
    }
    e.preventDefault();
    const rect = this._container.getBoundingClientRect();
    const left = rect.left;
    const width = rect.width;
    const height = rect.height;
    const realX = clientX - left;
    const valueMaxWidth = width - height;
    const valueX = realX - height / 2;
    const ratio = valueX / valueMaxWidth;
    let value = Numbers.remap(ratio, 0, 1, this.min, this.max);
    value = Numbers.limit(value, this.min, this.max);
    if (this.step) {
      value = Math.round(value / this.step) * this.step;
    }
    if (value != this.value) {
      this._updateValue(value);
      this._updateUI();
    }
  }
  _onKeyboard(e) {
    if (this.disabled || this.readOnly)
      return;
    const movement = this.step ?? (this.max - this.min) / 100;
    let value = this.value;
    switch (e.code) {
      case "ArrowUp":
      case "ArrowLeft":
        value += -movement * (e.shiftKey ? 10 : 1);
        break;
      case "ArrowDown":
      case "ArrowRight":
        value += movement * (e.shiftKey ? 10 : 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    value = Numbers.limit(value, this.min, this.max);
    if (value != this.value) {
      this._updateValue(value);
      this._updateUI();
    }
  }
  _updateUI() {
    console.log("_updateUI");
    this._updateTrackUI();
  }
  _updateTrackUI() {
    const value = (this.value - this.min) / (this.max - this.min);
    this._container.style.setProperty("--x-value", value.toFixed(3));
  }
  _updateValue(value) {
    this.value = InputSliderElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  hasSameValueAs(value) {
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
                ?disabled=${this.disabled}
                ?is-min=${this.value <= this.min}
                ?is-max=${this.value >= this.max}
                @keydown=${(e) => this._onKeyboard(e)}
                @mousedown=${(e) => this._onPointerStart(e)}
                @touchstart=${(e) => this._onPointerStart(e)}>
                <div id="track"></div>
                <div id="bar" ?stepping=${this.step}>
                    <div id="handle"></div>
                </div>
            </div>
        `;
  }
};
InputSliderElement.style = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        #container {
            --x-value: 1;
            --x-height: 32px;
            --x-track-size: 2px;
            --x-track-color: var(--x-border-color);
            --x-border-color: var(--system-color-grey1);

            outline: 0;
            display: block;
            width: 100%;
            height: var(--x-height);
            border-radius: 6px;
        }


        #track {
            display: block;
            width: calc(100%);
            height: var(--x-height);
            box-sizing: border-box;
            margin-bottom: calc(var(--x-height) * -1);
            border-radius: inherit;
            background-position: center center;
            background-size: 100% 100%;
            background-image: linear-gradient(180deg,
                transparent 0%,
                transparent calc(50% - var(--x-track-size) / 2),
                var(--x-track-color) calc(50% - var(--x-track-size) / 2),
                var(--x-track-color) calc(50% + var(--x-track-size) / 2),
                transparent calc(50% + var(--x-track-size) / 2),
                transparent 100%);

            transition: background-image .3s;
        }


        #container[is-max] #track {
            --x-track-size: 4px;
            --x-track-color: var(--system-accentColor);
        }


        [disabled] #track {
            background-color: transparent;
            color: var(--system-color-grey3);
        }

        #bar {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            width: calc((100% - var(--x-height)) * var(--x-value) + var(--x-height));
            height: var(--x-height);
            margin-bottom: calc(var(--x-height) * -1);
            border-radius: inherit;
            /* background-color: var(--system-accentColor); */
            background-position: left center;
            background-repeat: no-repeat;
            background-size: calc(100% - var(--x-height) / 2) 100%;
            background-image: linear-gradient(180deg,
                transparent 0%,
                transparent calc(50% - 2px),
                var(--system-accentColor) calc(50% - 2px),
                var(--system-accentColor) calc(50% + 2px),
                transparent calc(50% + 2px),
                transparent 100%);
        }

        #container[is-min] #bar {
            background-image: none;
        }


        [disabled] #bar {
            background-color: var(--system-color-grey3);
        }

        #bar[stepping] {
            transition: width .16s;
        }

        #handle {
            --x-outline: var(--system-color-grey1);
            --x-fill: var(--system-color-grey3);

            display: flex;
            justify-content: center;
            align-items: center;
            width: var(--x-height);
            height: var(--x-height);
        }

        #handle::before {
            content: '';
            box-sizing: border-box;
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 20px;

            border: 2px solid var(--x-outline);
            background-color: var(--x-fill);
        }

        [disabled] #handle {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
__decorate([
  property({type: Number})
], InputSliderElement.prototype, "value", 2);
__decorate([
  property({type: Number})
], InputSliderElement.prototype, "min", 2);
__decorate([
  property({type: Number})
], InputSliderElement.prototype, "max", 2);
__decorate([
  property({type: Number})
], InputSliderElement.prototype, "step", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputSliderElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputSliderElement.prototype, "readOnly", 2);
__decorate([
  query("#container")
], InputSliderElement.prototype, "_container", 2);
__decorate([
  query("#track")
], InputSliderElement.prototype, "_track", 2);
__decorate([
  query("#bar")
], InputSliderElement.prototype, "_bar", 2);
__decorate([
  query("#handle")
], InputSliderElement.prototype, "_handle", 2);
InputSliderElement = __decorate([
  customElement("input-slider")
], InputSliderElement);
