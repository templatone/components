import {Angle} from "../units/Angle.js";
import {Vector} from "../units/Vector.js";
export class Transform {
  constructor(position = Vector.Zero, scale = Vector.One, rotation = Angle.Zero, origin = Vector.Zero) {
    this._parent = null;
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
    this.origin = origin;
  }
  getComputed() {
    const transforms = (() => {
      const fce = (arr, t) => {
        arr.unshift(t);
        if (t.hasParent())
          return fce(arr, t.getParent());
        else
          return arr;
      };
      return fce([], this);
    })();
    const computed = new Transform();
    for (let i = 0; i < transforms.length; i++) {
      const current = transforms[i];
      const position = current.position.clone().rotate(computed.rotation).multiple(computed.scale);
      computed.position.add(position);
      computed.rotation.add(current.rotation);
      computed.scale.multiple(current.scale);
    }
    return computed;
  }
  setParent(parent, updateLocals = false) {
    const before = this.getComputed();
    this._parent = parent;
    if (updateLocals === true) {
      const after = this.getComputed();
      after.position.subtract(before.position);
      after.rotation.subtract(before.rotation);
      after.scale.subtract(before.scale);
      this.position.subtract(after.position);
      this.rotation.subtract(after.rotation);
      this.scale.subtract(after.scale);
    }
  }
  clearParent(updateLocals = false) {
    if (this._parent === null)
      return;
    const before = this.getComputed();
    this._parent = null;
    if (updateLocals === true) {
      const after = this.getComputed();
      after.position.subtract(before.position);
      after.rotation.subtract(before.rotation);
      after.scale.subtract(before.scale);
      this.position.subtract(after.position);
      this.rotation.subtract(after.rotation);
      this.scale.subtract(after.scale);
    }
  }
  hasParent() {
    return this._parent !== null;
  }
  getParent() {
    if (this._parent == null) {
      throw new Error("Transform has no parent. You can test by method `.hasParent()`");
    }
    return this._parent;
  }
  clone() {
    const t = new Transform(this.position.clone(), this.scale.clone(), this.rotation.clone(), this.origin.clone());
    if (this.hasParent())
      t.setParent(t.getParent());
    return t;
  }
}
