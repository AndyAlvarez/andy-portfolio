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
}

export const WPT_CLIP: Clip = {
  src: 'assets/video/wpt_demo_20221218.mp4',
  poster: 'assets/media/wpt_robot_pad_frame.jpg',
  label: 'Own clip · Dec 2022 · robot test',
};

/** Clip on the home-page WPT card (note: Andy's WPT clips have no audio track, so the EQ shows its simulated pattern). */
export const WPT_CARD_CLIP: Clip = {
  src: 'assets/video/wpt_coil_20230131.mp4',
  poster: 'assets/media/wpt_robot_coil_frame.jpg',
  label: 'Own clip · Jan 2023 · robot test',
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
