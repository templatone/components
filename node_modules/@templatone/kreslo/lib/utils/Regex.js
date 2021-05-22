export class Regex {
    static breakLines() {
        return Regex._regexp.breakLines;
    }
}
Regex._regexp = {
    breakLines: /\r{0,1}\n/g,
};
