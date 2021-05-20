const _Regex = class {
  static breakLines() {
    return _Regex._regexp.breakLines;
  }
};
export let Regex = _Regex;
Regex._regexp = {
  breakLines: /\r{0,1}\n/g
};
