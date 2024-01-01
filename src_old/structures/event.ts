export class Event {
    #name: EventObject['name'] = '';
    #on: EventObject['on'] = true;
    #fn: EventObject['fn'];
    constructor(options: EventObject) {
        this.#name = options.name;
        this.#on = options?.on || true;
        this.#fn = options.fn;
    }

    public get name(): EventObject['name'] {
        return this.#name as EventObject['name'];
    }
    public get on(): EventObject['on'] {
        return this.#on as EventObject['on'];
    }
    public get fn(): EventObject['fn'] {
        return this.#fn as EventObject['fn'];
    }
}

export type EventObject = {
    name: string;
    on?: boolean;
    fn: (...args: any) => Promise<any>;
};
