import { CustomElement } from "../../libs/CustomElement.js";
import { html, svg } from "../../node_modules/lit-html/lit-html.js";
export class UIIcon extends CustomElement {
    constructor() {
        super();
        // Properties
        this._disabled = false;
        this._glyph = null;
        this._containerEl = this.shadowRoot.getElementById('container');
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        this.invalidate();
    }
    get glyph() { return this._glyph; }
    set glyph(v) {
        this._glyph = v;
        this.invalidate();
    }
    _printGlyph() {
        switch (this.glyph) {
            case "clear" /* Clear */:
                return svg `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
            case "image" /* Image */:
                return svg `<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
            default:
                // TODO: Chyba
                return html `<mark>???</mark>`;
        }
    }
    focus() {
        this._containerEl.focus();
    }
    blur() {
        this._containerEl.blur();
    }
    // Attributes
    static get observedAttributes() {
        return ['disabled', 'glyph'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLocaleLowerCase()) {
            case 'disabled':
                this.disabled = newValue !== null;
                break;
            case 'glyph':
                this.glyph = newValue ?? null;
                break;
        }
    }
    getTemplate() {
        return html `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    fill: inherit;
                    color: inherit;
                }

                #container {
                    --x-size: 24px;
                    width: var(--x-size);
                    height: var(--x-size);
                    border-radius: var(--x-size);
                    fill: inherit;
                    color: inherit;
                }

                #container svg {
                    width: var(--x-size);
                    height: var(--x-size);
                    flex-shrink: 0;
                    display: block;
                    fill: currentColor;
                    color: inherit;
                }
            </style>

            <div id="container" ?disabled=${this.disabled}>
                ${this._printGlyph()}
            </div>
        `;
    }
}
UIIcon.registerCustomElement('ui-icon');
