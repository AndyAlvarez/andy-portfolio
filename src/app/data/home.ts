/**
 * Home-page copy: the "What I do" cards and the four featured projects.
 * Edit text here; the components only lay it out.
 *
 * DRAFT / UNCONFIRMED wording is marked with `// DRAFT:` comments. Confirm with Andy before launch:
 *  - ESP32 in "Embedded software" (from older resume / project notes, not the current resume)
 *  - GTK/WebKit and Mapbox tags on the PCM card
 *  - "two-factor login and role-based access" + "I designed and migrated the schemas" on the DB card
 *    (the core schema was a shared effort; Andy's resume says "Designed and migrated PoC schemas")
 */

/** NBC feature card in the hero (video comes from data/videos.ts, placement 'hero'). */
export const NBC_FEATURE = {
  kicker: 'ON AIR',
  source: 'NBC NIGHTLY NEWS · JUL 2025',
  title: 'Featured on NBC',
  text: "Guident's autonomous shuttles in public service, with me on camera as the remote control operator.",
};

export interface WhatIDo {
  title: string;
  text: string;
  stack: string;
  color: string;
}

export const WHAT_I_DO: WhatIDo[] = [
  {
    title: 'REAL-TIME STREAMING',
    text: 'Low-latency two-way video and audio in C++ with GLib, GStreamer and WebRTC, running live on public autonomous shuttles.',
    stack: 'C++ · GLib · GStreamer · WebRTC',
    color: '#00E5FF',
  },
  {
    title: 'EMBEDDED SOFTWARE',
    // DRAFT: ESP32 not on the current resume; confirm.
    text: 'C/C++ on microcontrollers, sensors and motors (Arduino Mega, Adafruit Metro M0, ESP32), state machines, and Redis Streams telemetry at the vehicle edge.',
    stack: 'C/C++ · Arduino · ESP32 · Redis',
    color: '#39FF14',
  },
  {
    title: 'FULL-STACK & DATA',
    text: 'Angular onboard UIs, NodeJS and Python services, PostgreSQL and TimescaleDB schemas, deployed on AWS.',
    stack: 'Angular · NodeJS · PostgreSQL · AWS',
    color: '#7B2CFF',
  },
];

export type FeaturedId = 'pcm' | 'db' | 'ai' | 'wpt' | 'sumo';

export interface FeaturedCard {
  id: FeaturedId;
  kind: 'PROFESSIONAL' | 'COURSEWORK' | 'ACADEMIC';
  kindColor: string;
  discipline: string;
  title: string;
  body: string;
  /** Optional small note under the body (purple rule). */
  more?: string;
  tags: string[];
  foot: string;
  /** Shows a dashed yellow "needs confirming" chip after the foot text. */
  footFlag?: string;
  /** Optional card link; rendered only when SHOW_CASE_STUDY_LINKS is true. */
  link?: { label: string; href: string };
}

/**
 * Case-study pages are not built yet, so the 'OPEN CASE STUDY →' links are hidden.
 * To re-enable: set this to true and point each card's link.href at its page.
 */
export const SHOW_CASE_STUDY_LINKS = false;
const CASE_STUDY_SOON = '#work';

export const FEATURED: FeaturedCard[] = [
  {
    id: 'pcm',
    kind: 'PROFESSIONAL',
    kindColor: '#00E5FF',
    discipline: 'Embedded · Web · Video',
    title: 'Passenger Communication Module',
    body: 'Led end-to-end development and deployment aboard 2 autonomous shuttles: a C++ streaming module (GStreamer pipeline, WebRTC, WebSocket signaling, state machine) for live two-way video/audio with a remote operator at <200 ms glass-to-glass latency, plus an Angular onboard UI with routes, ETAs and rotating ads. 5,500+ passengers over 400+ hours of live operation.',
    tags: ['C++', 'GStreamer', 'WebRTC', 'GTK/WebKit', 'Angular', 'Mapbox'], // DRAFT: GTK/WebKit, Mapbox
    foot: 'Project Lead · Guident · 2024 – Present',
    link: { label: 'OPEN CASE STUDY →', href: CASE_STUDY_SOON },
  },
  {
    id: 'db',
    kind: 'PROFESSIONAL',
    kindColor: '#00E5FF',
    discipline: 'Data · Backend',
    title: 'Core API, Database & Telemetry Pipeline',
    // DRAFT: schema credit + "two-factor login and role-based access" need Andy's confirmation.
    body: "A Node/Express REST API on PostgreSQL. I designed and migrated the schemas behind fleets, vehicles, devices, routes and scheduling, with JWT auth, two-factor login and role-based access. On the team's Redis Streams sensor pipeline I built the main processor, which validates IMU (100 Hz), GPS (50 Hz) and camera events, writes them to TimescaleDB and uploads them to a remote server with retry.",
    tags: ['NodeJS', 'Express', 'PostgreSQL', 'Redis Streams', 'Python', 'TimescaleDB', 'Docker'],
    foot: 'Guident · 2024 – Present · pipeline: team effort',
    link: { label: 'OPEN CASE STUDY →', href: CASE_STUDY_SOON },
  },
  {
    id: 'sumo',
    kind: 'PROFESSIONAL',
    kindColor: '#00E5FF',
    discipline: 'Embedded · Robotics',
    title: 'Sumo Bot · GE Appliances',
    // Facts from Andy's resume only (GE Appliances co-op, Jan – Apr 2023).
    body: 'Built and programmed a sumo bot in C on an Adafruit Metro M0 with IR sensors, ultrasonic sensors, DC motors and LEDs. It placed 1st in the final competition.',
    tags: ['C', 'Adafruit Metro M0', 'IR + ultrasonic', 'DC motors'],
    foot: 'Software Technology Co-op · GE Appliances · Jan – Apr 2023',
    link: { label: 'OPEN CASE STUDY →', href: CASE_STUDY_SOON },
  },
  {
    id: 'wpt',
    kind: 'ACADEMIC',
    kindColor: '#B48CFF',
    discipline: 'Embedded · Hardware',
    title: 'Self-Aligning Wireless Power Transfer',
    body: "A robot that finds an EV's receiver coil and moves the charging pad under it, reaching 1.53% misalignment in lab testing. Our senior design team was acknowledged in IEEE Access (2024).",
    tags: ['C++', 'Arduino Mega', 'Hall-effect', 'DC motors'],
    foot: 'Team Leader · FIU Senior Design · 2022 – 23',
    link: { label: 'OPEN CASE STUDY →', href: CASE_STUDY_SOON },
  },
  {
    id: 'ai',
    kind: 'COURSEWORK',
    kindColor: '#B48CFF',
    discipline: 'AI · Neural networks',
    title: 'Pandas vs Cats & Dogs: CNN Image Classifiers',
    body: 'Neural Networks Project 2: built and iterated two convolutional image classifiers in TensorFlow/Keras over three model versions each. Best test accuracy on 200-image test sets: 0.97 for pandas vs dogs and 0.955 for pandas vs cats.',
    more: 'Also on GitHub: MLP backprop digit classifier, EKG heart-attack classifier, Perceptron/Adaline vowels, power-plant regression, phishing detection.',
    tags: ['Python', 'TensorFlow', 'Keras', 'Colab'],
    foot: 'FIU coursework · Spring 2024',
  },
];

/** Paper shown on the WPT card (opens in the in-page pdf.js viewer; never downloaded / linked out). */
export const WPT_PAPER_CARD = {
  title: 'Novel Autonomous Self-aligning Wireless Power Transfer for Improving Misalignment',
  meta: 'IEEE Access · 2024 · Behnamfar, Tariq & Sarwat · team acknowledged',
  thumb: 'assets/media/ieee_wpt_p1_thumb.jpg',
};
