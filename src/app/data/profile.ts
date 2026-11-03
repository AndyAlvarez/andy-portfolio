/** Identity, hero copy and contact. Facts from my current resume only. No phone / street address. */
export type IconName = 'pin' | 'cap' | 'mail' | 'linkedin' | 'github' | 'sun' | 'moon' | 'atom' | 'arrow' | 'doc' | 'menu';

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
  lede: 'I build software and hardware that run in the real world, from embedded systems to full-stack apps.',
  /** Hero skill rows. */
  skills: [
    { group: 'Embedded & systems', items: ['C', 'C++', 'Arduino', 'ESP32', 'State machines', 'TCP/UDP', 'ROS integration'] },
    { group: 'Full-stack & data', items: ['TypeScript', 'Angular', 'Node.js', 'Python', 'PostgreSQL', 'TimescaleDB', 'Redis', 'REST APIs', 'Docker', 'AWS'] },
  ],
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
