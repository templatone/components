import { Numbers } from '@templatone/utils';
import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from './core/IInputElement.js';


export type InputSliderValue = number;


@customElement('input-slider')
export class InputSliderElement extends InputElement<InputSliderValue> implements IInputElement<InputSliderValue> {
    get emptyValue(): InputSliderValue { return this.min; }

    private _customDefaultValue: InputSliderValue | undefined = undefined;
    get defaultValue(): InputSliderValue { return this._customDefaultValue ?? this.min; }
    set defaultValue(v: InputSliderValue) { this._customDefaultValue = v; }


    @property({ type: Number })
    value: InputSliderValue = 0;


    @property({ type: Number })
    min: number = 0;


    @property({ type: Number })
    max: number = 100;


    @property({ type: Number })
    step: number | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    autofocus: boolean = false;


    // Elements
    @query('#container')
    private _container!: HTMLElement;
    
    @query('#track')
    private _track!: HTMLElement;
    
    @query('#bar')
    private _bar!: HTMLElement;
    
    @query('#handle')
    private _handle!: HTMLElement;



    // Toggles
    private _pointerActive: boolean = false;


    connectedCallback() {
        super.connectedCallback();
        console.log("connectedCallback");
        

        // Event listeners
        const listenerOptions = { capture: false, passive: false };


        window.addEventListener('mouseup', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('mouseleave', (e) => this._onPointerEnd(e), listenerOptions);

        window.addEventListener('touchend', (e) => this._onPointerEnd(e), listenerOptions);
        window.addEventListener('touchcancel', (e) => this._onPointerEnd(e), listenerOptions);

        window.addEventListener('mousemove', (e) => this._onPointerMove(e), listenerOptions);
        window.addEventListener('touchmove', (e: TouchEvent) => this._onPointerMove(e), listenerOptions);
    }


    disconnectedCallback() {
        super.disconnectedCallback();

        // TODO: Remove listeners
    }


    firstUpdated() {
        console.log("firstUpdated");
        this._updateUI();
    }


    // Actions
    private _onPointerStart(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;

        this._container.focus();
        this._pointerActive = true;

        this._onPointerMove(e);
    }


    private _onPointerEnd(e: MouseEvent | TouchEvent) {
        this._pointerActive = false;
    }


    private _onPointerMove(e: MouseEvent | TouchEvent) {
        if (this.disabled || this.readOnly) return;

        if (!this._pointerActive) return;

        let clientX: number;

        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        } else {
            if (e.touches.length >= 2) return;

            const touch = e.touches[0];
            clientX = touch.clientX;
        }

        e.preventDefault();

        const rect = this._container.getBoundingClientRect();

        const left = rect.left;
        const width = rect.width;
        const height = rect.height;

        const realX = (clientX - left)
        const valueMaxWidth = width - height;  // width - radius
        const valueX = realX - height / 2

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


    private _onKeyboard(e: KeyboardEvent) {
        if (this.disabled || this.readOnly) return;

        const movement = this.step ?? (this.max - this.min) / 100;

        let value = this.value;

        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowLeft': value += -movement * (e.shiftKey ? 10 : 1); break;

            case 'ArrowDown':
            case 'ArrowRight': value += movement * (e.shiftKey ? 10 : 1); break;

            default: return;
        }

        e.preventDefault();
        e.stopPropagation();

        value = Numbers.limit(value, this.min, this.max);

        if (value != this.value) {
            this._updateValue(value);
            this._updateUI();
        }
    }


    // UI
    private _updateUI() {
        console.log("_updateUI");
        this._updateTrackUI();
    }


    private _updateTrackUI() {
        const value = (this.value - this.min) / (this.max - this.min)

        this._container.style.setProperty('--x-value', value.toFixed(3));
    }


    private _updateValue(value: InputSliderValue): void {
        this.value = InputSliderElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: InputSliderValue): boolean {
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
                ?is-min=${this.value <=this.min}
                ?is-max=${this.value>= this.max}
                @keydown=${(e: KeyboardEvent) => this._onKeyboard(e)}
                @mousedown=${(e: MouseEvent) => this._onPointerStart(e)}
                @touchstart=${(e: MouseEvent) => this._onPointerStart(e)}>
                <div id="track"></div>
                <div id="bar" ?stepping=${this.step}>
                    <div id="handle"></div>
                </div>
            </div>
        `;
    }


    static style = css`
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
}