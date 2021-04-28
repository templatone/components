import { CustomElement } from "../CustomElement.js";
import { TemplateResult, html } from "../../node_modules/lit-html/lit-html.js";


export class AssetSwatch extends CustomElement {

    private _color: string = 'transparent'; 
    public get color(): string {
        return this._color;
    }
    public set color(v: string) {
        this._color = v;
        this.invalidate();
    }

    constructor() {
        super();
    }

    getTemplate(): TemplateResult {
        return html`
            <style>
                :host {
                    display: block;
                    width: 32px;
                    height: 32px;
                    flex-shrink: 0;
                }

                #container {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    transform-origin: center;
                    border-radius: 6px;
                    background-size: calc(100% / 3 * 2);
                    background-repeat: repeat;
                    background-position: left top;
                    background-image: var(--system-pattern-transparency);
                }

                #fill {
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    background-color: var(--color);
                    box-shadow: rgba(0, 0, 0, .16) 0 0 0 2px inset;
                }
            </style>

            <div id="container">
                <div id="fill" style="--color: ${this.color}"></div>
            </div>
        `;
    }

}

AssetSwatch.registerCustomElement('ui-color-swatch');
