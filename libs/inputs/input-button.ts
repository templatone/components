import { CustomElement } from "../../libs/CustomElement.js";
import { TemplateResult, html } from "../../node_modules/lit-html/lit-html.js";


const style = html`
<style>
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    :host(:focus) {
        outline: 0;
        outline: none;
    }

    :host([disabled]) {
        color: #a8a8a8;
        cursor: auto;
        pointer-events: none;
    }


    .button {        
        user-select: none;
        cursor: pointer;
        outline: 0;
        user-select: none;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        height: var(--system-input-height);
        padding: 0 var(--system-input-padding);
        background-color: var(--system-accentColor);
        border-radius: 6px;
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: inherit;
        line-height: 1;
        font-weight: 600;
    }

    .button:hover {
        background-color: var(--system-accentColor);
        color: #fff;
    }

    .button-label {
        padding: 0 var(--system-input-padding);
    }

    .button[disabled] {
        background: red;
    }

    .button:not([disabled]) {
        background: green;
    }


</style>`;


export class InputButton extends CustomElement {

    tabIndex = 0;

    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        if (v) {
            this.setAttribute('disabled', '');
        } else if (this.hasAttribute('disabled')) {
            this.removeAttribute('disabled');
        }
        
        this._disabled = v;
        this.invalidate();
    }


    constructor() {
        super();

        this.addEventListener('keydown', (e) => this._onKeydown(e));
    }


    private _onKeydown(e: KeyboardEvent) {
        if (this.disabled) return;

        if (e.code == 'Enter' ||  e.code == 'Space') {
            e.preventDefault();

            this.click();
        }
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <div class="button" ?disabled=${this.disabled}>
                <slot name="icon"></slot>
                <div class="button-label">
                    <slot></slot>
                </div>
            </div>
        `;
    }

}

InputButton.registerCustomElement('ui-button');