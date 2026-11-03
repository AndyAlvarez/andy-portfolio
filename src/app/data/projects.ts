export interface Project {
  title: string;
  text: string;
  stack: string;
  image?: string;
  invert?: boolean;
  /** Placeholder for a clip not yet added (e.g. the GE sumo bot video is >100 MB). */
  clipPlaceholder?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'Smart Modular MacroPad',
    text: 'ESP32 Bluetooth/wired macro keypad; pads chain over USB-C I²C. Custom KiCad PCB, $92.92 BOM.',
    stack: 'ESP32 · KiCad · I²C',
    image: 'assets/media/macropad_pcb_3d_top.png',
  },
  {
    title: 'FPGA Temperature Display',
    text: 'Zybo Z7 reads a Pmod TMP3 sensor and drives a Pmod OLED. Vivado block design + Vitis C.',
    stack: 'Zynq · Vivado · Vitis',
    image: 'assets/media/fpga_zybo_tmp3_oled.png',
  },
  {
    title: 'Applied AI Models',
    text: 'MLP with backprop from scratch (digits 0.90, EKG 0.91), power-plant regression (RMSE 2.109), phishing detection 0.917.',
    stack: 'Python · NumPy · Keras',
    image: 'assets/media/cnn_pandas_vs_cats_training.png',
    invert: true,
  },
  {
    title: 'Sumo Bot · GE Appliances',
    text: 'Built in C on an Adafruit Metro M0 with IR, ultrasonic and motors. 1st in the final competition.',
    stack: 'C · Metro M0 · Sensors',
    image: 'assets/media/sumo_bot_poster.jpg',
  },
];
