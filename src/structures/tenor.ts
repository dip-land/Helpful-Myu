export class Tenor {
    constructor() {}
    public async search(term: string, random: boolean, limit?: number | undefined): Promise<response> {
        if (random) limit = 20;
        const raw: response['raw'] = await (await fetch(`https://tenor.googleapis.com/v2/search?q=${term}&key=${process.env.TENOR_KEY}&limit=${limit || 1}`)).json();
        return {
            result: random ? raw.results[Math.floor(Math.random() * raw.results.length)] : raw.results[0],
            raw,
        };
    }
}

type response = {
    result: {
        id: string;
        title: string;
        media_formats: {
            tinymp4: { url: string; duration: number; preview: string; dims: Array<number>; size: number };
            gif: response['result']['media_formats']['tinymp4'];
            tinygif: response['result']['media_formats']['tinymp4'];
            nanogifpreview: response['result']['media_formats']['tinymp4'];
            gifpreview: response['result']['media_formats']['tinymp4'];
            loopedmp4: response['result']['media_formats']['tinymp4'];
            mediumgif: response['result']['media_formats']['tinymp4'];
            mp4: response['result']['media_formats']['tinymp4'];
            tinygifpreview: response['result']['media_formats']['tinymp4'];
            nanogif: response['result']['media_formats']['tinymp4'];
            nanowebm: response['result']['media_formats']['tinymp4'];
            nanomp4: response['result']['media_formats']['tinymp4'];
            tinywebm: response['result']['media_formats']['tinymp4'];
            webm: response['result']['media_formats']['tinymp4'];
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
