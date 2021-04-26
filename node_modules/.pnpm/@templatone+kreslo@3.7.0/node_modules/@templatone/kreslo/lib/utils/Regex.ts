export class Regex {

    private static _regexp = {
        breakLines: /\r{0,1}\n/g,
    };


    static breakLines() {
        return Regex._regexp.breakLines;
    }

}