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
import {Color, Utils} from "../web-modules/pkg/@templatone.kreslo.v3.7.0.js";
import {css, html} from "../web-modules/pkg/lit.v2.0.0-rc.2.js";
import {customElement, property, query} from "../web-modules/pkg/lit.decorators.v2.0.0-rc.2.js";
import {InputElement} from "./core/InputElement.js";
function printColor(red, green, blue, alpha) {
  const r = red.toFixed(3);
  const g = green.toFixed(3);
  const b = blue.toFixed(3);
  const a = alpha.toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
export let InputSliderGradientElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = null;
    this.disabled = false;
    this.readOnly = false;
    this.defaultColorSteps = InputSliderGradientElement.computeGradientSteps("#8880", "#888f");
    this._colorSteps = this.defaultColorSteps;
    this._pointerActive = false;
  }
  get defaultValue() {
    return this.min;
  }
  get colorSteps() {
    return this._colorSteps;
  }
  set colorSteps(v) {
    this._colorSteps = v.sort((a, b) => a.offset - b.offset);
    this._updateUI();
  }
  connectedCallback() {
    super.connectedCallback();
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
    if (this.disabled || this.readOnly)
      return;
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
    let value = Utils.Numbers.remap(ratio, 0, 1, this.min, this.max);
    value = Utils.Numbers.limit(value, this.min, this.max);
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
    value = Utils.Numbers.limit(value, this.min, this.max);
    if (value != this.value) {
      this._updateValue(value);
      this._updateUI();
    }
  }
  _updateUI() {
    console.log(this.shadowRoot);
    this._updateTrackUI();
    this._updateGradientUI();
  }
  _updateTrackUI() {
    const value = (this.value - this.min) / (this.max - this.min);
    this._container.style.setProperty("--x-value", value.toFixed(3));
  }
  _updateGradientUI() {
    const steps = this.colorSteps.length > 0 ? this.colorSteps : [{
      offset: 0,
      color: {red: 0, green: 0, blue: 0, alpha: 0}
    }];
    const parts = steps.map((s) => {
      const offset = ((s.offset / 2 + 1 / 4) * 100).toFixed(3);
      return `${printColor(s.color.red, s.color.green, s.color.blue, s.color.alpha)} ${offset}%`;
    });
    const styleGradient = `linear-gradient(90deg, ${parts.join(", ")})`;
    this._container.style.setProperty("--x-gradient", styleGradient);
  }
  _updateValue(value) {
    this.value = InputSliderGradientElement.applyFilters(this.filters, value);
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
  static get observedAttributes() {
    return ["color-steps", "value", "min", "max", "step", "disabled", "readonly"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name.toLocaleLowerCase()) {
      case "color-steps":
        this.colorSteps = newValue ? InputSliderGradientElement.computeGradientSteps(...newValue.split(",")) : this.defaultColorSteps;
        break;
      case "value":
        this.value = newValue ? parseFloat(newValue) : NaN;
        break;
      case "min":
        this.min = newValue ? parseFloat(newValue) : NaN;
        break;
      case "max":
        this.max = newValue ? parseFloat(newValue) : NaN;
        break;
      case "step":
        this.step = newValue ? parseFloat(newValue) : null;
        break;
      case "disabled":
        this.disabled = newValue !== null;
        break;
      case "readonly":
        this.readOnly = newValue !== null;
        break;
    }
  }
  render() {
    return html`
            <div id="container"
                tabindex="0"
                ?disabled=${this.disabled}
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
  static computeGradientSteps(...hexColors) {
    const steps = hexColors.map((hex, i, arr) => {
      const color = Color.fromHex(hex).getRGBA();
      const offset = i / (arr.length - 1);
      return {color, offset};
    });
    return steps;
  }
};
InputSliderGradientElement.style = css`
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    #container {
        --x-value: 1;
        --x-height: 32px;
        --x-color: rgba(255, 0, 0, .5);

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
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px inset;
        background-color: #fff;
        background-image:
            var(--x-gradient),
            var(--system-pattern-transparency);

        background-size:
            calc(200% - var(--x-height) * 2) 100%,
            auto calc(100% / 3 * 2);

        background-repeat:
            no-repeat,
            repeat;

        background-position:
            center center,
            left top;
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
    }

    #bar[stepping] {
        transition: width .16s;
    }

    #handle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--x-height);
        height: var(--x-height);
    }

    #handle::before {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 2px solid #fff;
        box-sizing: border-box;
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px, rgba(0, 0, 0, .16) 0 0 0 2px inset;
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
], InputSliderGradientElement.prototype, "value", 2);
__decorate([
  property({type: Number})
], InputSliderGradientElement.prototype, "min", 2);
__decorate([
  property({type: Number})
], InputSliderGradientElement.prototype, "max", 2);
__decorate([
  property({type: Number})
], InputSliderGradientElement.prototype, "step", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputSliderGradientElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputSliderGradientElement.prototype, "readOnly", 2);
__decorate([
  property()
], InputSliderGradientElement.prototype, "colorSteps", 1);
__decorate([
  query("#container")
], InputSliderGradientElement.prototype, "_container", 2);
__decorate([
  query("#track")
], InputSliderGradientElement.prototype, "_track", 2);
__decorate([
  query("#bar")
], InputSliderGradientElement.prototype, "_bar", 2);
__decorate([
  query("#handle")
], InputSliderGradientElement.prototype, "_handle", 2);
InputSliderGradientElement = __decorate([
  customElement("input-slider-gradient")
], InputSliderGradientElement);
