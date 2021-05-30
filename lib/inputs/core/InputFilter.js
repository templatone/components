const _InputFilters = class {
  static trim(v) {
    return v.trim();
  }
  static trimEachLines(v) {
    const splitter = "\n";
    const lines = v.split(splitter);
    return lines.map((l) => l.trim()).join(splitter);
  }
  static reduceSpaces(v) {
    _InputFilters.regex.spaces.lastIndex = 0;
    return v.replace(_InputFilters.regex.spaces, " ");
  }
  static reduceBreaklines(v) {
    if (v == "")
      return "";
    _InputFilters.regex.breaklines.lastIndex = 0;
    return v.replace(_InputFilters.regex.breaklines, "\n");
  }
  static lowerCase(v) {
    return v.toLocaleLowerCase();
  }
  static upperCase(v) {
    return v.toLocaleUpperCase();
  }
  static blankToNull(v) {
    return v != "" ? v : null;
  }
};
export let InputFilters = _InputFilters;
InputFilters.regex = {
  spaces: /\u0020+/g,
  breaklines: /(\r*\n)+/g
};
