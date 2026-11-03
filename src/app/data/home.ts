/** Home-page copy: the NBC feature and the featured projects. Edit text here; the components only lay it out. */

/** NBC feature card in the hero (video comes from data/videos.ts, placement 'hero'). */
export const NBC_FEATURE = {
  source: 'NBC Nightly News · Jul 2025',
  title: 'Featured on NBC',
  text: "Guident's autonomous shuttles in public service. I'm on camera as the remote operator.",
};

export type FeaturedId = 'pcm' | 'db' | 'ai' | 'wpt' | 'sumo';

export interface FeaturedCard {
  id: FeaturedId;
  title: string;
  body: string;
  /** Optional small note under the body. */
  more?: string;
  tags: string[];
  foot: string;
}

export const FEATURED: FeaturedCard[] = [
  {
    id: 'pcm',
    title: 'Passenger Communication Module',
    body: 'Led end-to-end development and deployment aboard 2 autonomous shuttles: a C++ streaming module (GStreamer pipeline, WebRTC, WebSocket signaling, state machine) for live two-way video/audio with a remote operator at <200 ms glass-to-glass latency, plus an Angular onboard UI with routes, ETAs and rotating ads. 5,500+ passengers over 400+ hours of live operation.',
    tags: ['C++', 'GStreamer', 'WebRTC'],
    foot: 'Project Lead · Guident · 2024 – present',
  },
  {
    id: 'db',
    title: 'Core API, Database & Telemetry Pipeline',
    body: "A Node/Express REST API on PostgreSQL. I designed the database schema behind fleets, vehicles, devices, routes and scheduling, and migrated it into the core database. On the team's Redis Streams sensor pipeline I built the main processor, which validates IMU (100 Hz), GPS (50 Hz) and camera events, writes them to TimescaleDB and uploads them to a remote server with retry.",
    tags: ['PostgreSQL', 'TimescaleDB', 'Redis Streams'],
    foot: 'Guident · 2024 – present',
  },
  {
    id: 'sumo',
    title: 'Sumo Bot · GE Appliances',
    body: 'Built and programmed a sumo bot in C on an Adafruit Metro M0 with IR sensors, ultrasonic sensors, DC motors and LEDs. It placed 1st in the final competition.',
    tags: ['C', 'Adafruit Metro M0', 'IR + ultrasonic'],
    foot: 'Software Technology Co-op · GE Appliances · Jan – Apr 2023',
  },
  {
    id: 'wpt',
    title: 'Self-Aligning Wireless Power Transfer',
    body: "A robot that finds an EV's receiver coil and moves the charging pad under it, reaching 1.53% misalignment in lab testing. Our senior design team is acknowledged in the IEEE Access paper on it (2024).",
    tags: ['C++', 'Arduino Mega', 'Hall-effect'],
    foot: 'Team Leader · FIU Senior Design · 2022 – 23',
  },
  {
    id: 'ai',
    title: 'Pandas vs Cats & Dogs: CNN Image Classifiers',
    body: 'Neural Networks Project 2: built and iterated two convolutional image classifiers in TensorFlow/Keras over three model versions each. Best test accuracy on 200-image test sets: 0.97 for pandas vs dogs and 0.955 for pandas vs cats.',
    more: 'More coursework on my GitHub: an MLP digit classifier, an EKG heart-attack classifier, Perceptron/Adaline vowel classifiers, power-plant regression and phishing detection.',
    tags: ['Python', 'TensorFlow', 'Keras'],
    foot: 'FIU coursework · Spring 2024',
  },
];

/** Paper shown on the WPT card (opens in the in-page pdf.js viewer; never downloaded / linked out). */
export const WPT_PAPER_CARD = {
  title: 'Novel Autonomous Self-aligning Wireless Power Transfer for Improving Misalignment',
  meta: 'IEEE Access, 2024 · Behnamfar, Tariq & Sarwat. Our team is in the acknowledgments.',
  thumb: 'assets/media/ieee_wpt_p1_thumb.jpg',
};
