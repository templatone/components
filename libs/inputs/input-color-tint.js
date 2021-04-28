import { html } from "../../node_modules/lit-html/lit-html.js";
import { Input } from "./Input.js";
import { Color } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { AssetSwatch } from "../assets/asset-swatch.js";
const style = html `
<style>
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        /* width: 200px; */
        height: 200px;
    }

    #container {
        --x-handle-outline-color: rgba(0, 0, 0, .16);
        --x-color: transparent;
        --x-color-base: transparent;

        --x-handle-size: 24px;
        --x-radius: 6px;
        --x-margin: calc(var(--x-handle-size) / 2 + var(--x-radius));

        outline: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: var(--x-radius);
        box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px inset;
        background-color: var(--x-color-base);
        background-image:
            linear-gradient(180deg,
                #0000 0%,
                #0000 var(--x-margin),
                #000f calc(100% - var(--x-margin)),
                #000f 100%
            ),
            linear-gradient(-90deg,
                #fff0 0%,
                #fff0 var(--x-margin),
                #ffff calc(100% - var(--x-margin)),
                #ffff 100%
            );
    }

    #area {
        display: block;
        width: calc(100% - var(--x-margin) * 2);
        height: calc(100% - var(--x-margin) * 2);
        background-color: transparent;
    }

    #handle {
        display: block;
        width: 0px;
        height: 0px;
        position: relative;
        left: calc(var(--x-handle-x) * 1%);
        top: calc(var(--x-handle-y) * 1%);
    }

    #handle::before {
        content: '';
        display: block;
        margin-top: calc((var(--x-handle-size) / -2) + 2px);
        margin-left: calc((var(--x-handle-size) / -2) + 2px);
        background-color: var(--x-color);
    }
</style>
`;
export class InputColorTint extends Input {
    constructor() {
        super();
        this.defaultValue = { hue: 0, saturation: 0, lightness: 0, alpha: 1 };
        this._disabled = false;
        this._readOnly = false;
        this._hue = 0;
        this._saturation = 0;
        this._lightness = 0;
        this._alpha = 1;
        this._pointerActive = false;
        // Elements
        this._containerEl = this.shadowRoot.getElementById('container');
        this._area = this.shadowRoot.getElementById('area');
        // Events
        this._containerEl.addEventListener('keydown', (e) => this._onSpectrumKeyboardSelecting(e));
        this._containerEl.addEventListener('mousedown', (e) => this._onPointerStart(e), { capture: false, passive: false });
        this._containerEl.addEventListener('touchstart', (e) => this._onPointerStart(e), { capture: false, passive: false });
        window.addEventListener('mouseup', (e) => this._onPointerEnd(e), { capture: false, passive: false });
        window.addEventListener('mouseleave', (e) => this._onPointerEnd(e), { capture: false, passive: false });
        window.addEventListener('touchend', (e) => this._onPointerEnd(e), { capture: false, passive: false });
        window.addEventListener('touchcancel', (e) => this._onPointerEnd(e), { capture: false, passive: false });
        window.addEventListener('mousemove', (e) => this._onPointerMove(e), { capture: false, passive: false });
        window.addEventListener('touchmove', (e) => this._onPointerMove(e), { capture: false, passive: false });
        this.invalidate();
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        this.invalidate();
    }
    get readOnly() { return this._readOnly; }
    set readOnly(v) {
        this._readOnly = v;
        this.invalidate();
    }
    get hue() { return this._hue; }
    set hue(v) {
        this._hue = v;
        this._updateUI();
    }
    get saturation() { return this._saturation; }
    set saturation(v) {
        this._saturation = v;
        this._updateUI();
    }
    get lightness() { return this._lightness; }
    set lightness(v) {
        this._lightness = v;
        this._updateUI();
    }
    get alpha() { return this._alpha; }
    set alpha(v) {
        this._alpha = v;
        this._updateUI();
    }
    get value() {
        return {
            hue: this._hue,
            saturation: this._saturation,
            lightness: this._lightness,
            alpha: this._alpha,
        };
    }
    set value(color) {
        this._hue = color.hue;
        this._saturation = color.saturation;
        this._lightness = color.lightness;
        this._alpha = color.alpha;
        this.invalidate();
    }
    connectedCallback() {
        super.connectedCallback();
        this._updateUI();
    }
    _onPointerStart(e) {
        this._containerEl.focus();
        this._pointerActive = true;
        this._onPointerMove(e);
    }
    _onPointerEnd(e) {
        this._pointerActive = false;
    }
    _onPointerMove(e) {
        if (!this._pointerActive)
            return;
        let clientX;
        let clientY;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else {
            if (e.touches.length >= 2)
                return;
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }
        e.preventDefault();
        const rect = this._area.getBoundingClientRect();
        const left = rect.left;
        const top = rect.top;
        const width = rect.width;
        const height = rect.height;
        const realX = clientX - left;
        const realY = clientY - top;
        const x = (realX / width) * 100;
        const y = (realY / height) * 100;
        const c = this._computeSpectrumTint(x, y);
        this._saturation = c.saturation;
        this._lightness = c.lightness;
        this.fireUpdateEvent();
        this._updateUI({ x, y });
    }
    _onSpectrumKeyboardSelecting(e) {
        const movement = 1;
        let { x, y } = this._computeSpectrumCoordinates(this.saturation, this.lightness);
        switch (e.code) {
            case 'ArrowUp':
                y += -movement * (e.shiftKey ? 10 : 1);
                break;
            case 'ArrowDown':
                y += movement * (e.shiftKey ? 10 : 1);
                break;
            case 'ArrowLeft':
                x += -movement * (e.shiftKey ? 10 : 1);
                break;
            case 'ArrowRight':
                x += movement * (e.shiftKey ? 10 : 1);
                break;
            default: return;
        }
        e.preventDefault();
        e.stopPropagation();
        const c = this._computeSpectrumTint(x, y);
        this._saturation = c.saturation;
        this._lightness = c.lightness;
        this.fireUpdateEvent();
        this._updateUI({ x, y });
    }
    _computeSpectrumTint(x, y) {
        x = Math.min(Math.max(x, 0), 100);
        y = Math.min(Math.max(y, 0), 100);
        const _v = 1 - (y / 100);
        const _s = x / 100;
        const l_ratio = (_v / 2) * (2 - _s);
        const s_ratio = (_v * _s) / (1 - Math.abs(2 * l_ratio - 1));
        const s = !isNaN(s_ratio) ? s_ratio * 100 : 0;
        const l = l_ratio * 100;
        return {
            saturation: s,
            lightness: l,
        };
    }
    _computeSpectrumCoordinates(s, l) {
        const t = (s * (l < 50 ? l : 100 - l)) / 100;
        const s1 = Math.round((200 * t) / (l + t)) | 0;
        const b1 = Math.round(t + l);
        const x = s1;
        const y = 100 - b1;
        return { x, y };
    }
    _updateUI(forceCoordinates) {
        const tintColor = `hsl(${this._hue.toFixed(3)}, ${this._saturation.toFixed(3)}%, ${this._lightness.toFixed(3)}%)`;
        const baseColor = `hsl(${this._hue.toFixed(3)}, 100%, 50%)`;
        console.log("original", this._hue, this._saturation, this._lightness);
        const foo = Color.fromHSL(this._hue, this._saturation, this._lightness);
        const bar = foo.getHSL();
        console.log("color hsl", bar.hue, bar.saturation, bar.lightness);
        console.log("color rgb", foo.red, foo.green, foo.green);
        this._containerEl.style.setProperty('--x-color', tintColor);
        this._containerEl.style.setProperty('--x-color-base', baseColor);
        let x;
        let y;
        if (forceCoordinates) {
            x = Math.min(Math.max(forceCoordinates.x, 0), 100);
            y = Math.min(Math.max(forceCoordinates.y, 0), 100);
        }
        else {
            const coordinates = this._computeSpectrumCoordinates(this.saturation, this.lightness);
            x = coordinates.x;
            y = coordinates.y;
        }
        this._containerEl.style.setProperty('--x-handle-x', x.toFixed(3));
        this._containerEl.style.setProperty('--x-handle-y', y.toFixed(3));
        this.invalidate();
    }
    _updateValue(value) {
        // TODO: Add filters?
        this.value = value;
        this.fireUpdateEvent();
    }
    hasSameValueAs(value) {
        return this.value === value;
    }
    clearValue() {
        this._updateValue(this.defaultValue);
    }
    focus() {
        this._containerEl.focus();
        this.fireFocusEvent();
    }
    blur() {
        this._containerEl.blur();
        this.fireBlurEvent();
    }
    getTemplate() {
        AssetSwatch;
        return html `
            ${style}
            
            <div id="container" tabindex="0">
                <div id="area">
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }
    static get observedAttributes() {
        return ['hue', 'saturation', 'lightness'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name.toLocaleLowerCase()) {
            case 'hue':
                this.hue = newValue ? parseFloat(newValue) : NaN;
                break;
            case 'saturation':
                this.saturation = newValue ? parseFloat(newValue) : NaN;
                break;
            case 'lightness':
                this.lightness = newValue ? parseFloat(newValue) : NaN;
                break;
        }
    }
}
InputColorTint.registerCustomElement('input-color-tint');
