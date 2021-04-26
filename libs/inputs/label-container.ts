import { html, render, TemplateResult, RenderOptions } from "../../node_modules/lit-html/lit-html.js";
import { CustomElement } from "../../libs/CustomElement.js";


const style = html`
<style>
    :host {
        display: block;
        box-sizing: border-box;
    }

    #container {
        --x-transition-duration: .3s;
        --x-pading: 10px;

        padding: var(--x-pading);
        border-radius: calc(6px + var(--x-pading));
        background-color: var(--system-color-gray6);

        transition-property: background-color;
        transition-duration: var(--x-transition-duration);
    }

    #container:not(:focus-within) {
        background: transparent;
    }

    ::slotted([slot=label]) {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        line-height: 1;
        font-size: 18px;
        height: 18px;
        color: var(--system-color-label);
        transform-origin: left bottom;

        transition-property: transform, color, letter-spacing, font-weight;
        transition-duration: var(--x-transition-duration);
    }

    #container:not(:focus-within) ::slotted([slot=label]) {
        transform: scale(.7);
        font-weight: 600;
        letter-spacing: .06em;
        color: var(--system-color-gray1);
    }

    #label:empty {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>`;


export type TextValue = string | null;

export class LabelContainer extends CustomElement {

    private _label: string | null = null;
    get label(): string | null { return this._label; }
    set label(v: string | null) {
        this._label = v;
        this.invalidate();
    }


    constructor() {
        super();
    }


   // Attributes
    static get observedAttributes() {
        return ['label'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
            case 'label':
                this.label = newValue;
                break;
        }
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <div id="container">
                <!-- <div id="label">${this.label}</div> -->
                <div id="label">
                    <slot name="label"></slot>
                </div>
                <slot></slot>
            </div>
        `;
    }
}

LabelContainer.registerCustomElement('label-container');