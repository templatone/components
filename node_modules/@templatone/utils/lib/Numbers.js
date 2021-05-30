export class Numbers {
  static remap(value, min1, max1, min2 = 0, max2 = 1) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }
  static limit(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  static randomArbitrary(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
  }
  static randomInt(min = 0, max = 1) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static bezierCurve2(t, p1, p2) {
    const compute = (t2, v1, v2) => {
      return (1 - t2) * v1 + t2 * v2;
    };
    return {
      x: compute(t, p1.x, p2.x),
      y: compute(t, p1.y, p2.y)
    };
  }
  static bezierCurve3(t, p1, p2, p3) {
    const compute = (t2, v1, v2, v3) => {
      return (1 - t2) ** 2 * v1 + 2 * (1 - t2) * t2 * v2 + t2 ** 2 * v3;
    };
    return {
      x: compute(t, p1.x, p2.x, p3.x),
      y: compute(t, p1.y, p2.y, p3.y)
    };
  }
  static bezierCurve4(t, p1, p2, p3, p4) {
    const compute = (t2, v1, v2, v3, v4) => {
      return (1 - t2) ** 3 * v1 + 3 * (1 - t2) ** 2 * t2 * v2 + 3 * (1 - t2) * t2 ** 2 * v3 + t2 ** 3 * v4;
    };
    return {
      x: compute(t, p1.x, p2.x, p3.x, p4.x),
      y: compute(t, p1.y, p2.y, p3.y, p4.y)
    };
  }
}
