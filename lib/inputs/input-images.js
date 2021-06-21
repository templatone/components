var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {css, html} from "../web-modules/pkg/lit.js";
import {customElement, property, query} from "../web-modules/pkg/lit/decorators.js";
import {InputElement} from "./core/InputElement.js";
import {clear as clearIcon, images as imagesIcon} from "../assets/icons.js";
import {Images as ImagesUtils} from "../web-modules/pkg/@templatone/utils.js";
export let InputImagesElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.defaultValue = [];
    this.value = [];
    this.disabled = false;
    this.readOnly = false;
    this.capture = false;
    this.multiple = false;
  }
  async _onFileSelect(e) {
    const f = this._input.files;
    const files = f != null && f.length ? [...f] : [];
    if (files.length > 0) {
      const promises = files.map((f2) => ImagesUtils.getFormFile(f2));
      const images = await Promise.all(promises);
      this._addImages(...images);
    }
  }
  _addImages(...images) {
    if (this.multiple) {
      this._updateValue([...this.value ?? [], ...images]);
    } else {
      this._updateValue(images.slice(0, 1));
    }
  }
  _removeImageByIndex(index) {
    console.log(index);
    if (this.value == null)
      return;
    const images = [...this.value];
    images.splice(index, 1);
    this._updateValue(images);
  }
  _updateValue(value) {
    this.value = InputImagesElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  hasSameValueAs(value) {
    return this.value === value;
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  focus() {
    this._input.focus();
    this.fireFocusEvent();
  }
  blur() {
    this._input.blur();
    this.fireBlurEvent();
  }
  _renderThumbnails() {
    if (this.value == null)
      return [];
    const urls = this.value.map((img) => img.src);
    return urls.map((url, i) => html`
            <div class="thumbnail">
                <div class="close buttonicon" @click=${() => this._removeImageByIndex(i)}>
                    <div class="icon">${clearIcon}</div>
                </div>

                <img .src=${url}>
            </div>
        `);
  }
  render() {
    return html`
            <div id="container" ?disabled=${this.disabled}>
                <div id="button" ?disabled=${this.disabled}>
                    <div class="buttonface">
                        <div class="icon">${imagesIcon}</div>
                
                        <span>${this.multiple ? "Vybrat obrázky" : "Vybrat obrázek"}</span>
                    </div>
                
                    <div class="file">
                        <input id="input"
                            accept="image/*"
                            ?capture=${this.capture}
                            ?multiple=${this.multiple}
                            ?disabled=${this.disabled}
                            ?autofocus=${this.autofocus}
                            @change=${(e) => this._onFileSelect(e)}
                        type="file">
                    </div>
                </div>

                <div id="thumbnailContainer" ?hidden=${this._renderThumbnails().length == 0}>${this._renderThumbnails()}</div>
            </div>
        `;
  }
};
InputImagesElement.styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            box-sizing: border-box;
        }

        #button {
            display: block;
            overflow: hidden;
        }

        #button .buttonface {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--system-color-grey5);
            font-weight: 500;
            /* border: 2px solid var(--x-border-color); */
            border-radius: 6px;

            width: 100%;
            height: 36px;
            box-sizing: border-box;
            margin-bottom: -36px;
        }

        #button:focus-within .buttonface,
        #button:hover .buttonface {
            background-color: var(--system-color-grey4);
        }

        #button:focus-within:hover .buttonface {
            background-color: var(--system-color-grey3);
        }

        .icon {
            display: block;
            width: 24px;
            height: 24px;
            margin: 0 8px;
        }

        .icon:first-child {
            margin-left: 0;
        }
        
        .icon:last-child {
            margin-right: 0;
        }

        .file {
            display: block;

            width: 100%;
            height: 36px;
        }

        input[type=file] {
            display: block;
            min-width: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: 0 !important;
            max-height: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 0 !important;
            outline: 0 !important;
            box-sizing: border-box !important;
            background-color: transparent !important;
            opacity: 0 !important;
            cursor: inherit !important;
        }

        [hidden] {
            display: none;
        }

        #thumbnailContainer {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            width: 100%;
            margin-top: 10px;
            border-radius: 6px;
            scroll-snap-type: x mandatory;
        }

        #thumbnailContainer:empty {
            display: none;
        }

        .thumbnail {
            scroll-snap-align: start;
            overflow: hidden;
            flex-shrink: 0;
            height: 128px;
            border-radius: 6px;
        }

        .thumbnail + .thumbnail {
            margin-left: 10px;
        }

        .thumbnail img {
            display: block;
            height: 100%;
            user-select: none;
            /* pointer-events: none; */
        }


        .buttonicon {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--system-color-grey5);
            font-weight: 500;
            border-radius: 6px;
            box-sizing: border-box;
        }

        .buttonicon:focus-within,
        .buttonicon:hover {
            background-color: var(--system-color-grey4);
        }

        .buttonicon:hover {
            background-color: var(--system-color-grey3);
        }


        .thumbnail .close {
            cursor: pointer;
            position: relative;
            top: 8px;
            left: 8px;
            display: block;
            width: 24px;
            height: 24px;
            margin-bottom: -24px;
        }
    `;
__decorate([
  property({type: Array})
], InputImagesElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputImagesElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputImagesElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true, type: Boolean})
], InputImagesElement.prototype, "capture", 2);
__decorate([
  property({attribute: true, type: Boolean})
], InputImagesElement.prototype, "multiple", 2);
__decorate([
  query("#input")
], InputImagesElement.prototype, "_input", 2);
InputImagesElement = __decorate([
  customElement("input-images")
], InputImagesElement);
