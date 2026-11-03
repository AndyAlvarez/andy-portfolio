/** Identity, hero copy and contact. Facts from Andy's current resume only. No phone / street address. */
export type IconName = 'pin' | 'cap' | 'mail' | 'linkedin' | 'github';

export interface HeroBullet {
  icon: IconName;
  /** Bold lead-in (optional). */
  strong?: string;
  text: string;
  /** Smaller, muted line (used for location / availability). */
  small?: boolean;
}

export const PROFILE = {
  name: { first: 'Andy', last: 'Alvarez' },
  title: 'Embedded Systems Engineer · Project Lead',
  lede:
    'I build real-time systems that move people, from live video links on public autonomous shuttles to a robot that aligns EV wireless chargers. C++, GStreamer, WebRTC, Angular, and embedded hardware.',
  bullets: [
    { icon: 'pin', text: 'Wellington, FL · Open to relocation / remote', small: true },
    { icon: 'cap', strong: 'B.S. Electrical Engineering', text: ' · Florida International University · 2023' },
    { icon: 'cap', strong: 'M.S. Computer Engineering', text: ' · Florida International University · 2024' },
  ] as HeroBullet[],
  email: 'andydalvarez30@gmail.com',
  linkedin: 'linkedin.com/in/andydalvarez',
  github: 'github.com/AndyAlvarez',
  location: 'Wellington, FL',
  availability: 'Open to remote and relocation.',
};
