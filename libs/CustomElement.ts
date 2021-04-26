import { TemplateResult, html, render } from "../node_modules/lit-html/lit-html.js";

export abstract class CustomElement extends HTMLElement {

    static registerCustomElement(tagname: string) {
        tagname = tagname.toLowerCase();

        const current = customElements.get(tagname) as undefined | Object;

        if (current == undefined) {
            customElements.define(tagname, this as any);
        }
    }


    constructor() {
        super();

        this.attachShadow({ mode: 'open' })
        this.invalidate();
    }


    getTemplate(): TemplateResult {
        return html`<mark>${this.tagName}</mark>`;
    }


    invalidate() {
        render(this.getTemplate(), this.shadowRoot!);
    }


    connectedCallback() {
        if ((window as any).ShadyCSS !== undefined) {
            (window as any).ShadyCSS.styleElement(this);
        }
    }
}