/**
 * YouTube videos shown on the site. Edit this list to add / remove videos.
 *
 *  - id:        the YouTube video id (the part after `watch?v=`)
 *  - placement: 'hero' (big player in the hero card), 'pcm' (inside the Passenger
 *               Communication case) or 'row' (the "In the field" video row)
 *  - enabled:   set to false to hide a video without deleting it
 *  - andyConfirmed: true only once Andy has confirmed he appears in the video.
 *               (Only NBC is confirmed so far: the report names him on camera.)
 *  - thumb:     optional local thumbnail; if omitted the YouTube thumbnail is used.
 *
 * Players load from youtube-nocookie.com only after the visitor clicks play.
 */
export type VideoPlacement = 'hero' | 'pcm' | 'row';

export interface Video {
  id: string;
  title: string;
  source: string;
  date: string;
  placement: VideoPlacement;
  enabled: boolean;
  andyConfirmed: boolean;
  note?: string;
  thumb?: string;
}

export const VIDEOS: Video[] = [
  {
    id: 'n8bM6e9aCgo',
    title: 'Self-driving shuttles mark major test for public transit',
    source: 'NBC Nightly News',
    date: 'Jul 2025',
    placement: 'hero',
    enabled: true,
    andyConfirmed: true,
    thumb: 'assets/media/yt/n8bM6e9aCgo_max.jpg',
  },
  {
    id: '27AeYgct5lI',
    title: 'Guident Passenger Communication Module for Autonomous Vehicles',
    source: 'Guident',
    date: 'Jul 2025',
    placement: 'pcm',
    enabled: true,
    andyConfirmed: false,
    thumb: 'assets/media/yt/27AeYgct5lI_max.jpg',
  },
  {
    id: 'yY3R3tGGjH8',
    title: "Guident's MiCa at West Palm Beach",
    source: 'Guident',
    date: 'Jul 2025',
    placement: 'row',
    enabled: true,
    andyConfirmed: false,
    thumb: 'assets/media/yt/yY3R3tGGjH8_max.jpg',
  },
  {
    id: 'Nb0y88hAlzA',
    title: 'Autonomous Vehicle Day 2025',
    source: 'Guident',
    date: 'Jun 2025',
    placement: 'row',
    enabled: true,
    andyConfirmed: false,
    thumb: 'assets/media/yt/Nb0y88hAlzA_max.jpg',
  },
  {
    id: 'ow6DcoyIof8',
    title: 'Remote Monitor and Control Center Remote Driving',
    source: 'Guident',
    date: 'Nov 2024',
    placement: 'row',
    enabled: true,
    andyConfirmed: false,
    thumb: 'assets/media/yt/ow6DcoyIof8_max.jpg',
  },
  // --- Shortlisted but hidden. Flip `enabled` to true to show them in the row. ---
  {
    id: 'wcdQ5yXf8kg',
    title: 'Guident Achieves Industry First with Automated Bus Teleoperation',
    source: 'Guident',
    date: 'Jun 2025',
    placement: 'row',
    enabled: false,
    andyConfirmed: false,
    thumb: 'assets/media/yt/wcdQ5yXf8kg_max.jpg',
  },
  {
    id: 'eLbCSG74afU',
    title: "Guident's MiCa Launch Event at West Palm Beach",
    source: 'Guident',
    date: 'Apr 2025',
    placement: 'row',
    enabled: false,
    andyConfirmed: false,
    thumb: 'assets/media/yt/eLbCSG74afU_max.jpg',
  },
  {
    id: 'mO8-eYuMzzM',
    title: 'National Autonomous Vehicle Day 2024 Jacksonville, Florida',
    source: 'Guident',
    date: 'Jun 2024',
    placement: 'row',
    enabled: false,
    andyConfirmed: false,
  },
];

export const videosFor = (p: VideoPlacement) => VIDEOS.filter((v) => v.enabled && v.placement === p);
export const thumbFor = (v: Video) => v.thumb ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
