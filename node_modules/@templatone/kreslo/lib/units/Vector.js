import {Angle} from "./Angle.js";
export class Vector {
  constructor(...values) {
    this.x = 0;
    this.y = 0;
    this.set(...values);
  }
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  set(...values) {
    const v = Vector._parseEntryType_VectorModifier(values);
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  add(...values) {
    const v = Vector._parseEntryType_VectorModifier(values);
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  subtract(...values) {
    const v = Vector._parseEntryType_VectorModifier(values);
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  multiple(...values) {
    const v = Vector._parseEntryType_VectorModifier(values);
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  divide(...values) {
    const v = Vector._parseEntryType_VectorModifier(values);
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }
  rotate(...values) {
    const value = values[0];
    let degrees;
    if (value instanceof Angle) {
      degrees = value.degrees;
    } else {
      degrees = value;
    }
    const length = this.length;
    const angle = this.getAngle().add(degrees);
    const vector = angle.getVector().multiple(length);
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }
  normalize() {
    const length = this.length;
    if (length !== 0) {
      this.x = this.x / length;
      this.y = this.y / length;
    }
    return this;
  }
  absolute() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }
  isEquals(vector) {
    return this.x == vector.x && this.y == vector.y;
  }
  getAngle() {
    return Angle.fromRadians(Math.atan2(this.y, this.x));
  }
  clone() {
    return new Vector(this.x, this.y);
  }
  static get Zero() {
    return new Vector(0, 0);
  }
  static get Half() {
    return new Vector(0.5, 0.5);
  }
  static get One() {
    return new Vector(1, 1);
  }
  static get Top() {
    return new Vector(0, -1);
  }
  static get Bottom() {
    return new Vector(0, 1);
  }
  static get Left() {
    return new Vector(-1, 0);
  }
  static get right() {
    return new Vector(1, 0);
  }
  static distance(vector1, vector2) {
    const a = vector1.x - vector2.x;
    const b = vector1.y - vector2.y;
    return Math.sqrt(a ** 2 + b ** 2);
  }
  static _parseEntryType_Vector(raw) {
    let x;
    let y;
    if (raw.length == 2) {
      x = raw[0];
      y = raw[1];
    } else {
      x = raw[0].x;
      y = raw[0].y;
    }
    return {x, y};
  }
  static _parseEntryType_VectorModifier(raw) {
    let x;
    let y;
    if (raw.length == 2) {
      x = raw[0];
      y = raw[1];
    } else if (typeof raw[0] == "number") {
      x = raw[0];
      y = raw[0];
    } else {
      x = raw[0].x;
      y = raw[0].y;
    }
    return {x, y};
  }
}
