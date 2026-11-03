export interface Clip {
  src: string;
  poster: string;
  label: string;
  /** True when the file carries an audio track: the player is then not muted, so the EQ can react live. */
  hasAudio?: boolean;
}

/** WPT card: lab demo of the apparatus. H.264 720×480 + AAC, faststart; has audio, so it plays unmuted and the EQ can go live. */
export const WPT_CARD_CLIP: Clip = {
  src: 'assets/media/wpt_ev_demo.mp4',
  poster: 'assets/media/wpt_ev_demo_poster.jpg',
  hasAudio: true,
  label: 'Lab demo, Mar 2023',
};

/** Sumo bot card: silent loop of the full 24.5 s match clip (H.264 1280×720, faststart, no audio track). */
export const SUMO_CARD_CLIP: Clip = {
  src: 'assets/media/sumo_bot_loop.mp4',
  poster: 'assets/media/sumo_bot_poster.jpg',
  hasAudio: false,
  label: 'Sumo match, Apr 2023',
};

/** Lab-test serial monitor reading ("Percent Misalignment: 1.53%"). */
export const WPT_MISALIGNMENT_PHOTO = {
  src: 'assets/media/wpt_percent_misalignment.jpg',
  alt: 'Laptop serial monitor during a lab test of the alignment robot, reading Percent Misalignment: 1.53%',
};

/** Resume PDF (phone number removed from the file itself, not just covered). */
export const RESUME_PDF = {
  src: 'assets/docs/andy-alvarez-resume.pdf',
  title: 'Andy_Alvarez_Resume.pdf',
};

export const IEEE_PAPER = {
  src: 'assets/docs/ieee-access-2024-wpt.pdf',
  title: 'IEEE_Access_2024_WPT.pdf',
  credit: 'Behnamfar, Tariq & Sarwat, IEEE Access 2024. CC BY-NC-ND 4.0.',
};

export interface StripPhoto {
  src: string;
  /** Small copy for the card strip; the full-size file only loads in the popup. */
  thumb: string;
  alt: string;
  caption: string;
}

/** PCM passenger screens in service. */
export const PCM_ROUTE_LOOP = {
  src: 'assets/media/pcm_screen_loop.mp4',
  poster: 'assets/media/pcm_screen_loop_poster.jpg',
  caption: 'Onboard screen in service',
  alt: 'Onboard passenger screen in service, cycling between the live route map with stops and ETAs and an ad slot',
};

export const PCM_PHOTOS: StripPhoto[] = [
  {
    src: 'assets/media/pcm_welcome.jpg',
    thumb: 'assets/media/pcm_welcome_thumb.jpg',
    alt: 'Onboard passenger screen showing the welcome aboard screen',
    caption: 'Welcome screen',
  },
  {
    src: 'assets/media/pcm_ad_slot.jpg',
    thumb: 'assets/media/pcm_ad_slot_thumb.jpg',
    alt: "Onboard passenger screen showing the 'Your ad could be on this screen' ad slot with a QR code",
    caption: 'Ad screen',
  },
];
