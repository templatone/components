import {html, render} from "../_snowpack/pkg/lit.v2.0.0-rc.1.js";
export class CustomElement extends HTMLElement {
  static registerCustomElement(tagname) {
    tagname = tagname.toLowerCase();
    const current = customElements.get(tagname);
    if (current == void 0) {
      customElements.define(tagname, this);
    }
  }
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.invalidate();
  }
  getTemplate() {
    return html`<mark>${this.tagName}</mark>`;
  }
  invalidate() {
    render(this.getTemplate(), this.shadowRoot);
  }
  connectedCallback() {
    if (window.ShadyCSS !== void 0) {
      window.ShadyCSS.styleElement(this);
    }
  }
}
