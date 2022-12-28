export class Event {
    #name = '';
    #on = true;
    #fn: (...args: any) => Promise<any>;
    constructor(options: EventOptions) {
        this.#name = options.name;
        this.#on = options.on;
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

export class EventOptions {
    name = '';
    on = true;
    fn!: (...args: any) => Promise<any>;
}

export class EventObject {
    name!: string;
    on!: boolean;
    fn!: (...args: any) => Promise<any>;
}
