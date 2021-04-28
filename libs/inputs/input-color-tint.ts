import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Input, IInput } from "./Input.js";
import { Color, IColorHSL, IColorHSLA, IColorRGBA, IVector } from "../../node_modules/@templatone/kreslo/kreslo.js";
import { AssetSwatch } from "../assets/asset-swatch.js";


const style = html`
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


export type ColorTintValue = IColorHSLA;

export class InputColorTint extends Input<ColorTintValue> implements IInput<ColorTintValue> {

    readonly defaultValue: ColorTintValue = { hue: 0, saturation: 0, lightness: 0, alpha: 1 };

    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        this._disabled = v;
        this.invalidate();
    }

    private _readOnly: boolean = false;
    get readOnly(): boolean { return this._readOnly; }
    set readOnly(v: boolean) {
        this._readOnly = v;
        this.invalidate();
    }

    private _hue: number = 0;
    get hue(): number { return this._hue; }
    set hue(v: number) {
        this._hue = v;
        this._updateUI();
    }

    private _saturation: number = 0;
    get saturation(): number { return this._saturation; }
    set saturation(v: number) {
        this._saturation = v;
        this._updateUI();
    }

    private _lightness: number = 0;
    get lightness(): number { return this._lightness; }
    set lightness(v: number) {
        this._lightness = v;
        this._updateUI();
    }

    private _alpha: number = 1;
    get alpha(): number { return this._alpha; }
    set alpha(v: number) {
        this._alpha = v;
        this._updateUI();
    }

    private _containerEl: HTMLElement;
    private _area: HTMLElement;

    private _pointerActive: boolean = false;


    get value(): ColorTintValue {
        return {
            hue: this._hue,
            saturation: this._saturation,
            lightness: this._lightness,
            alpha: this._alpha,
        };
    }

    set value(color: ColorTintValue) {
        this._hue = color.hue
        this._saturation = color.saturation
        this._lightness = color.lightness
        this._alpha = color.alpha

        this.invalidate();
    }


    constructor() {
        super();

        // Elements
        this._containerEl = this.shadowRoot!.getElementById('container') as HTMLElement;
        this._area = this.shadowRoot!.getElementById('area') as HTMLElement;

        // Events
        this._containerEl.addEventListener('keydown', (e) => this._onSpectrumKeyboardSelecting(e))
        this._containerEl.addEventListener('mousedown', (e) => this._onPointerStart(e), { capture: false, passive: false })
        this._containerEl.addEventListener('touchstart', (e) => this._onPointerStart(e), { capture: false, passive: false })

        window.addEventListener('mouseup', (e) => this._onPointerEnd(e), { capture: false, passive: false })
        window.addEventListener('mouseleave', (e) => this._onPointerEnd(e), { capture: false, passive: false })

        window.addEventListener('touchend', (e) => this._onPointerEnd(e), { capture: false, passive: false })
        window.addEventListener('touchcancel', (e) => this._onPointerEnd(e), { capture: false, passive: false })

        window.addEventListener('mousemove', (e) => this._onPointerMove(e), { capture: false, passive: false })
        window.addEventListener('touchmove', (e: TouchEvent) => this._onPointerMove(e), { capture: false, passive: false })

        this.invalidate();
    }


    connectedCallback() {
        super.connectedCallback();

        this._updateUI();
    }


    private _onPointerStart(e: MouseEvent | TouchEvent) {
        this._containerEl.focus();
        this._pointerActive = true;

        this._onPointerMove(e);
    }


    private _onPointerEnd(e: MouseEvent | TouchEvent) {
        this._pointerActive = false;
    }


    private _onPointerMove(e: MouseEvent | TouchEvent) {
        if (!this._pointerActive) return;

        let clientX: number;
        let clientY: number;

        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            if (e.touches.length >= 2) return;

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


    private _onSpectrumKeyboardSelecting(e: KeyboardEvent) {
        const movement = 1;
        let { x, y } = this._computeSpectrumCoordinates(this.saturation, this.lightness)

        switch (e.code) {
            case 'ArrowUp': y += -movement * (e.shiftKey ? 10 : 1); break;
            case 'ArrowDown': y += movement * (e.shiftKey ? 10 : 1); break;
            case 'ArrowLeft': x += -movement * (e.shiftKey ? 10 : 1); break;
            case 'ArrowRight': x += movement * (e.shiftKey ? 10 : 1); break;
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


    private _computeSpectrumTint(x: number, y: number) {
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
        }
    }


    private _computeSpectrumCoordinates(s: number, l: number): IVector {
        const t = (s * (l < 50 ? l : 100 - l)) / 100
        const s1 = Math.round((200 * t) / (l + t)) | 0
        const b1 = Math.round(t + l)
        const x = s1
        const y = 100 - b1

        return { x, y }
    }


    private _updateUI(forceCoordinates?: IVector) {
        const tintColor = `hsl(${this._hue.toFixed(3)}, ${this._saturation.toFixed(3)}%, ${this._lightness.toFixed(3)}%)`;
        const baseColor = `hsl(${this._hue.toFixed(3)}, 100%, 50%)`;

        console.log("original", this._hue, this._saturation, this._lightness);
        
        const foo = Color.fromHSL(this._hue, this._saturation, this._lightness)
        const bar = foo.getHSL();
        console.log("color hsl", bar.hue, bar.saturation, bar.lightness);
        console.log("color rgb", foo.red, foo.green, foo.green);
        


        this._containerEl.style.setProperty('--x-color', tintColor);
        this._containerEl.style.setProperty('--x-color-base', baseColor);

        let x: number;
        let y: number;

        if (forceCoordinates) {
            x = Math.min(Math.max(forceCoordinates.x, 0), 100);
            y = Math.min(Math.max(forceCoordinates.y, 0), 100);
        } else {
            const coordinates = this._computeSpectrumCoordinates(this.saturation, this.lightness);
            x = coordinates.x;
            y = coordinates.y;
        }

        this._containerEl.style.setProperty('--x-handle-x', x.toFixed(3));
        this._containerEl.style.setProperty('--x-handle-y', y.toFixed(3));

        this.invalidate();
    }


    private _updateValue(value: ColorTintValue): void {
        // TODO: Add filters?
        this.value = value;
        this.fireUpdateEvent();
    }


    hasSameValueAs(value: ColorTintValue): boolean {
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


    getTemplate(): TemplateResult {
        AssetSwatch;

        return html`
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


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue == newValue) return;

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