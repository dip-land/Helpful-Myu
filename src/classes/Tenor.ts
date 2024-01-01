export class Tenor {
    constructor() {}
    public async search(term: string, random: boolean, limit?: number): Promise<response> {
        if (random) limit = limit || 20;
        const raw: response['raw'] = await (await fetch(`https://tenor.googleapis.com/v2/search?q=${term}&key=${process.env.TENOR_KEY}&limit=${limit || 1}`)).json();
        return {
            result: random ? raw.results[Math.floor(Math.random() * raw.results.length)] : raw.results[0],
            raw,
        };
    }
    public async posts(ids: string): Promise<response> {
        const raw: response['raw'] = await (await fetch(`https://tenor.googleapis.com/v2/posts?ids=${ids}&key=${process.env.TENOR_KEY}`)).json();
        return {
            result: raw.results[0],
            raw,
        };
    }
}

type response = {
    result: {
        id: string;
        title: string;
        media_formats: {
            gif: { url: string; duration: number; preview: string; dims: Array<number>; size: number };
            tinymp4: response['result']['media_formats']['gif'];
            tinygif: response['result']['media_formats']['gif'];
            nanogifpreview: response['result']['media_formats']['gif'];
            gifpreview: response['result']['media_formats']['gif'];
            loopedmp4: response['result']['media_formats']['gif'];
            mediumgif: response['result']['media_formats']['gif'];
            mp4: response['result']['media_formats']['gif'];
            tinygifpreview: response['result']['media_formats']['gif'];
            nanogif: response['result']['media_formats']['gif'];
            nanowebm: response['result']['media_formats']['gif'];
            nanomp4: response['result']['media_formats']['gif'];
            tinywebm: response['result']['media_formats']['gif'];
            webm: response['result']['media_formats']['gif'];
        };
        created: number;
        content_description: string;
        itemurl: string;
        url: string;
        tags: Array<string>;
        flags: Array<unknown>;
        hasaudio: boolean;
    };
    raw: {
        results: Array<response['result']>;
        next: string;
    };
};
