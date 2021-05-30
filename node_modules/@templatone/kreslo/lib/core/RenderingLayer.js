const _RenderingLayer = class {
  constructor(canvas, width, height, pixelScale = 1, updateStyleSizeCallback = _RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK) {
    this._pixelScale = 1;
    this._updateStyleSizeCallback = null;
    this._width = 0;
    this._height = 0;
    this.gizmoVisibility = false;
    this.gizmoScale = 1;
    this._canvas = canvas;
    this.updateSize(width, height, pixelScale, updateStyleSizeCallback);
  }
  static get PIXELSCALE() {
    return window.devicePixelRatio;
  }
  get pixelScale() {
    return this._pixelScale;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  updateSize(width, height, pixelScale, updateStyleSizeCallback) {
    if (pixelScale !== void 0)
      this._pixelScale = Math.max(pixelScale, 0);
    this._width = Math.max(width, 0);
    this._height = Math.max(height, 0);
    this._canvas.width = this._width * this._pixelScale;
    this._canvas.height = this._height * this._pixelScale;
    if (updateStyleSizeCallback !== void 0) {
      this._updateStyleSizeCallback = updateStyleSizeCallback;
    }
    if (this._updateStyleSizeCallback !== null) {
      this._updateStyleSizeCallback(this._canvas, this._width, this._height, this._pixelScale);
    }
    this._renderingContext = this._canvas.getContext("2d", {
      willReadFrequently: true
    });
  }
  clear() {
    const pxs = this.pixelScale;
    this.resetMatrix();
    this._renderingContext.clearRect(0, 0, this.width * pxs, this.height * pxs);
  }
  getRenderingContext() {
    return this._renderingContext;
  }
  resetRenderingContext() {
    this._renderingContext = this._canvas.getContext("2d");
  }
  setImageSmoothing(toggle) {
    const ctx = this.getRenderingContext();
    ctx.msImageSmoothingEnabled = toggle;
    ctx.mozImageSmoothingEnabled = toggle;
    ctx.webkitImageSmoothingEnabled = toggle;
    ctx.imageSmoothingEnabled = toggle;
  }
  getCanvas() {
    return this._canvas;
  }
  setMatrixToTransform(transform) {
    this.resetMatrix();
    const pxs = this.pixelScale;
    const path = [];
    let t = transform;
    path.unshift(t);
    while (t.hasParent()) {
      t = t.getParent();
      path.unshift(t);
    }
    path.forEach((t2) => {
      this._renderingContext.translate(t2.position.x * pxs, t2.position.y * pxs);
      this._renderingContext.rotate(t2.rotation.radians);
      this._renderingContext.scale(t2.scale.x, t2.scale.y);
    });
  }
  resetMatrix() {
    this._renderingContext.resetTransform();
  }
};
export let RenderingLayer = _RenderingLayer;
RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK = (canvas, width, height, pixelScale) => {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};
