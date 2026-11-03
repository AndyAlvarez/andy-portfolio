/**
 * Resume content (source: Andy_Alvarez.pdf, current version).
 * The site renders this as HTML instead of embedding the PDF, because the PDF contains a phone number.
 */
export interface Job {
  when: string;
  role: string;
  org: string;
  summary: string;
  bullets: string[];
}

export const JOBS: Job[] = [
  {
    when: 'Jan 2024 – Present',
    role: 'Embedded Systems Engineer, Project Lead',
    org: 'Guident Corp. · IoT edge, remote monitoring & teleoperation',
    summary:
      'Passenger Communication Module on 2 autonomous shuttles (4,000+ passengers). C++ GStreamer/WebRTC streaming, Angular onboard UI, Redis Streams edge pipeline, C++ teleop over TCP/UDP with ROS. Presented to customers and investors; featured on NBC.',
    bullets: [
      'Led end-to-end development and deployment of a public-facing Passenger Communication Module on 2 autonomous shuttles, serving 4,000+ passengers over 300+ hours of live operation.',
      'Streaming module in C++ (GLib, GStreamer, WebRTC) with <200 ms glass-to-glass latency.',
      'Onboard UI: GTK/WebKitWebView loading a local Angular app; network-aware screen switching via Mapbox API.',
      'Designed and migrated PoC schemas into the core PostgreSQL database.',
      'IoT edge pipeline on Redis Streams (IMU 100 Hz, GPS 50 Hz, detections) to remote server and local TimescaleDB, with upload retry.',
      "Led C++ teleoperation integration (TCP/UDP) with the AV's ROS client; demoed at National Autonomous Vehicle Day.",
      'Presented and demoed to customers, investors and stakeholders; featured on NBC.',
    ],
  },
  {
    when: 'Jan – Apr 2023',
    role: 'Co-op',
    org: 'GE Appliances',
    summary: 'Sumo bot in C (1st in final competition). SmartHQ iOS accessibility in Swift. Agile, TDD, MVP/VIPER.',
    bullets: [
      'Sumo bot in C on an Adafruit Metro M0 (IR, ultrasonic, motors), 1st in the final competition.',
      'SmartHQ iOS accessibility features in Swift; Agile, TDD, MVP/VIPER.',
    ],
  },
];

export const EDUCATION = {
  when: '2023 · 2024',
  degrees: 'B.S. Electrical Engineering (3.52) · M.S. Computer Engineering (4.0)',
  school: 'Florida International University',
  note: 'Senior design team leader: EV wireless charging alignment, acknowledged in IEEE Access 2024.',
  lines: ['M.S. Computer Engineering, 2024 (GPA 4.0)', 'B.S. Electrical Engineering, 2023 (GPA 3.52)'],
};

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Front end', items: ['Angular', 'TypeScript', 'HTML/CSS', 'styled-components'] },
  { group: 'Back end', items: ['Python', 'TypeScript', 'NodeJS', 'PostgreSQL', 'TimescaleDB', 'Flask'] },
  { group: 'Systems', items: ['C/C++', 'GStreamer', 'WebRTC', 'Redis', 'State machines'] },
  { group: 'Deploy', items: ['AWS EC2', 'API Gateway', 'Lambda', 'Tailscale'] },
  { group: 'Tools', items: ['Docker', 'Git', 'npm', 'Electron', 'DBeaver', 'Postman', 'Jira', 'Confluence', 'Agile', 'TDD'] },
];
