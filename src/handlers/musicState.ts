import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    getVoiceConnection,
    AudioPlayerStatus,
    type DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import type { Guild } from 'discord.js';
import { type InfoData, type SpotifyTrack, type YouTubePlayList, validate, spotify, playlist_info, video_info, stream } from 'play-dl';
import { Queue, type QueueInterface } from './database/mongo.js';

export const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

export const join = (channelId: string, guild: Guild) => {
    const connection = joinVoiceChannel({
        channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
    connection.subscribe(player);
};

export const queueAdd = async (query: string, channelId: string, guild: Guild) => {
    let info: InfoData | SpotifyTrack | YouTubePlayList;
    switch (await validate(query)) {
        case 'dz_album':
            break;
        case 'dz_playlist':
            break;
        case 'dz_track':
            break;
        case 'so_playlist':
            break;
        case 'so_track':
            break;
        case 'sp_album':
            break;
        case 'sp_playlist':
            break;
        case 'sp_track':
            info = (await spotify(query)) as SpotifyTrack;
            Queue.insertOne({ url: info.url, platform: 'sp', duration: info.durationInSec, currentDuration: 0 });
            break;
        case 'yt_playlist': {
            info = (await playlist_info(query)) as YouTubePlayList;
            const videos = await info.all_videos();
            for (const video of videos) {
                Queue.insertOne({ url: video.url, platform: 'yt', duration: video.durationInSec, currentDuration: 0 });
            }
            break;
        }
        case 'yt_video':
            info = (await video_info(query)) as InfoData;
            Queue.insertOne({ url: info.video_details.url, platform: 'yt', duration: info.video_details.durationInSec, currentDuration: 0 });
            break;
        default:
            console.log('queueAdd default.');
            break;
    }
    if (!getVoiceConnection(guild.id)) {
        join(channelId, guild);
        play((await Queue.find({ _id: { $exists: true } }).toArray())[0]);
    }
};

export const play = async (song: QueueInterface) => {
    switch (song.platform) {
        case 'yt': {
            const stream_ = await stream(song.url);
            const resource = createAudioResource(stream_.stream, { inputType: stream_.type, inlineVolume: true });
            resource.volume?.setVolume(0.6);
            player.play(resource);
            break;
        }
        default:
            break;
    }
};

// player.on(AudioPlayerStatus.Idle, async () => {
//     (await Queue.find({ _id: { $exists: true } }).toArray())[0].then(async () => {
//         const song = (await Queue.find({ _id: { $exists: true } }).toArray())[0];
//         if (song) play(song);
//     });
//     console.log('Idle');
// });

player.on(AudioPlayerStatus.Paused, () => {
    console.log('Paused');
});

player.on(AudioPlayerStatus.Playing, () => {
    console.log('Playing');
});
