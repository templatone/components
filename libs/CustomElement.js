import { html, render } from "../node_modules/lit-html/lit-html.js";
export class CustomElement extends HTMLElement {
    static registerCustomElement(tagname) {
        tagname = tagname.toLowerCase();
        const current = customElements.get(tagname);
        if (current == undefined) {
            customElements.define(tagname, this);
        }
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.invalidate();
    }
    getTemplate() {
        return html `<mark>${this.tagName}</mark>`;
    }
    invalidate() {
        render(this.getTemplate(), this.shadowRoot);
    }
    connectedCallback() {
        if (window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
}
