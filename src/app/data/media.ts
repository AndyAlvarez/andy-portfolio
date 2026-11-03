export interface Clip {
  src: string;
  poster: string;
  label: string;
  /** True when the file carries an audio track: the player is then not muted, so the EQ can react live. */
  hasAudio?: boolean;
}

export const WPT_CLIP: Clip = {
  src: 'assets/video/wpt_demo_20221218.mp4',
  poster: 'assets/media/wpt_robot_pad_frame.jpg',
  label: 'Own clip · Dec 2022 · robot test',
};

/**
 * Clip on the home-page WPT card: Andy's lab demo of the apparatus (personal Drive, VID-20230316-WA0002.mp4),
 * re-encoded H.264 720×480 + AAC, faststart. It has an audio track, so it plays unmuted and the EQ can go live.
 */
export const WPT_CARD_CLIP: Clip = {
  src: 'assets/media/wpt_ev_demo.mp4',
  poster: 'assets/media/wpt_ev_demo_poster.jpg',
  hasAudio: true,
  label: 'Own clip · Mar 2023 · lab demo',
};

/**
 * Clip on the home-page sumo bot card (personal Drive, phone video recorded Apr 19 2023, 4K60, 24.5 s).
 * Re-encoded H.264 1280×720 30 fps + AAC 128k, faststart; full length, no trim. Has audio, so it plays unmuted.
 */
export const SUMO_CARD_CLIP: Clip = {
  /** Silent card loop: same full 24.5 s clip, audio track removed (video stream copied, no re-encode). */
  src: 'assets/media/sumo_bot_loop.mp4',
  poster: 'assets/media/sumo_bot_poster.jpg',
  hasAudio: false,
  label: 'Clip · Apr 2023 · sumo match',
};

/** Andy's photo of the lab-test serial monitor ("Percent Misalignment: 1.53%"). From his personal Drive, Sample Work › Self Aligning Wireless Power Transfer › percent_misalignment.png. */
export const WPT_MISALIGNMENT_PHOTO = {
  src: 'assets/media/wpt_percent_misalignment.jpg',
  alt: 'Laptop serial monitor during a lab test of the alignment robot, reading Percent Misalignment: 1.53%',
};

/** Andy's resume. Redacted copy of his PDF (phone number removed from the file, not just covered). */
export const RESUME_PDF = {
  src: 'assets/docs/andy-alvarez-resume.pdf',
  title: 'Andy_Alvarez_Resume.pdf',
};

export const IEEE_PAPER = {
  src: 'assets/docs/ieee-access-2024-wpt.pdf',
  title: 'IEEE_Access_2024_WPT.pdf',
  credit: 'Paper by Behnamfar, Tariq & Sarwat (CC BY-NC-ND 4.0), shown unmodified.',
};

export interface StripPhoto {
  src: string;
  /** Small copy for the card strip; the full-size file only loads in the popup. */
  thumb: string;
  alt: string;
  caption: string;
}

/** PCM in service: the passenger screens are public on board, so these are fine to show. */
export const PCM_ROUTE_LOOP = {
  src: 'assets/media/pcm_screen_loop.mp4',
  poster: 'assets/media/pcm_screen_loop_poster.jpg',
  caption: 'Live onboard screen',
  alt: 'Onboard passenger screen in service, cycling between the live route map with stops and ETAs and an ad slot',
};

export const PCM_PHOTOS: StripPhoto[] = [
  {
    src: 'assets/media/pcm_welcome.jpg',
    thumb: 'assets/media/pcm_welcome_thumb.jpg',
    alt: 'Onboard passenger screen showing the welcome aboard screen',
    caption: 'Onboard welcome screen',
  },
  {
    src: 'assets/media/pcm_ad_slot.jpg',
    thumb: 'assets/media/pcm_ad_slot_thumb.jpg',
    alt: "Onboard passenger screen showing the 'Your ad could be on this screen' ad slot with a QR code",
    caption: 'Ad slot',
  },
];
