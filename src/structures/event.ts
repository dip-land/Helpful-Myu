export class Event {
    #name = '';
    #on = true;
    #fn: (...args: any) => Promise<any>;
    constructor(options: EventObject) {
        this.#name = options.name;
        this.#on = options?.on || true;
        this.#fn = options.fn;
    }

    public get name(): string {
        return this.#name as string;
    }
    public get on(): boolean {
        return this.#on as boolean;
    }
    public get fn(): (...args: any) => Promise<any> {
        return this.#fn as (...args: any) => Promise<any>;
    }
}

export type EventObject = {
    name: string;
    on?: boolean;
    fn: (...args: any) => Promise<any>;
};
