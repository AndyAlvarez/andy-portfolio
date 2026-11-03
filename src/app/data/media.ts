/**
 * Photos/clips that need Andy's sign-off before they go public.
 * `approved: false` keeps the item hidden everywhere on the site.
 */
export interface GatedPhoto {
  src: string;
  caption: string;
  approved: boolean;
}

/** Andy's own photo of the in-shuttle passenger display (Feb 4, 2026). PENDING APPROVAL. */
export const PCM_PHOTO: GatedPhoto = {
  src: 'assets/media/passenger_comm_20260204_133815.jpg',
  caption: 'Passenger display on board · own photo, Feb 2026',
  approved: false,
};

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
  src: 'assets/media/sumo_bot.mp4',
  poster: 'assets/media/sumo_bot_poster.jpg',
  hasAudio: true,
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
