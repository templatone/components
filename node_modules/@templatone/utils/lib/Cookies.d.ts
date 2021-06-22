export declare class Cookies {
    static get(name: string): string | null;
    static set(name: string, value: string, expiration: number): void;
    static delete(name: string): void;
}
