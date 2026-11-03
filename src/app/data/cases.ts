/** Featured case studies. */
export interface SupportItem { title: string; text: string; }
export interface FeaturedCase {
  key: 'pcm' | 'wpt';
  kicker: string;
  title: string;
  bullets: string[]; // may contain <b> for emphasis
  support?: SupportItem[];
  seal?: string;
  credit?: string;
  reversed?: boolean;
}

export const PCM_TAGS = ['C++', 'GLib', 'GStreamer', 'WebRTC', 'GTK/WebKit', 'Angular', 'Mapbox', 'PostgreSQL'];

export const PCM_SUMMARY =
  'Led end-to-end development and deployment of a public-facing module on 2 autonomous shuttles: live two-way video/audio with a remote operator, an onboard passenger UI, and an ad-impression tracking backend.';

export const CASES: FeaturedCase[] = [
  {
    key: 'pcm',
    kicker: 'CASE 01 · GUIDENT CORP.',
    title: 'Passenger Communication Module',
    bullets: [
      'Streaming module in C++ with GLib, GStreamer and WebRTC at <b>under 200 ms</b> glass-to-glass latency.',
      'Onboard UI: GTK/WebKitWebView loading a local Angular app (stops, routes, ETAs, rotating ads), network-aware screen switching via the Mapbox API.',
      'Designed and migrated PoC schemas into the core PostgreSQL database.',
      '<b>5,500+ passengers</b> over <b>400+ hours</b> of live operation on 2 autonomous shuttles.',
    ],
    support: [
      {
        title: 'Teleoperation integration',
        text: "Led C++ TCP/UDP integration with the AV's ROS client; demoed live remote operation at National Autonomous Vehicle Day.",
      },
      {
        title: 'IoT edge data pipeline',
        text: 'Redis Streams for IMU (100 Hz), GPS (50 Hz) and camera detections to a remote server and local TimescaleDB, with upload retry.',
      },
    ],
  },
  {
    key: 'wpt',
    kicker: 'CASE 02 · FIU SENIOR DESIGN · 2022–23',
    title: 'EV Wireless Charging Alignment System',
    bullets: [
      '<b>Team leader</b> of a five-person senior design team.',
      "Arduino Mega 2560 in C++ reads a hall-effect sensor and drives DC motors to align the transmitter coil to the car's receiver coil.",
      'Single-axis, double single-axis and spiral alignment algorithms; 1.53% misalignment in lab testing.',
    ],
    seal: 'Senior design team acknowledged in IEEE Access, 2024',
    reversed: true,
  },
];
