import { CustomElement } from "../CustomElement.js";
import { html } from "../../node_modules/lit-html/lit-html.js";
export class UIAvatar extends CustomElement {
    constructor() {
        super();
    }
    getTemplate() {
        return html `
            <style>
                :host {

                }

                #container {
                    display: flex; 
                }
            </style>
            <div id="container">
            </div>
        `;
    }
}
UIAvatar.registerCustomElement('ui-avatar');
