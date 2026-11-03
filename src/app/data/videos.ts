/**
 * YouTube videos shown on the site.
 *
 *  - id:        the YouTube video id (the part after `watch?v=`)
 *  - placement: 'hero' (big player in the hero card) or 'pcm' (on the Passenger Communication Module card)
 *  - thumb:     optional local thumbnail; if omitted the YouTube thumbnail is used.
 *
 * Players load from youtube-nocookie.com only after the visitor clicks play.
 */
export type VideoPlacement = 'hero' | 'pcm';

export interface Video {
  id: string;
  title: string;
  source: string;
  date: string;
  placement: VideoPlacement;
  thumb?: string;
}

export const VIDEOS: Video[] = [
  {
    id: 'n8bM6e9aCgo',
    title: 'Self-driving shuttles mark major test for public transit',
    source: 'NBC Nightly News',
    date: 'Jul 2025',
    placement: 'hero',
    thumb: 'assets/media/yt/n8bM6e9aCgo_max.jpg',
  },
  {
    id: '27AeYgct5lI',
    title: 'Guident Passenger Communication Module for Autonomous Vehicles',
    source: 'Guident',
    date: 'Jul 2025',
    placement: 'pcm',
    thumb: 'assets/media/yt/27AeYgct5lI_max.jpg',
  },
];

export const videosFor = (p: VideoPlacement) => VIDEOS.filter((v) => v.placement === p);
export const thumbFor = (v: Video) => v.thumb ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
