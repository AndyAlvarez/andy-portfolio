/**
 * CRT power-on / power-down used when switching into or out of Atomic.
 * A fixed overlay (two black shutters, a glowing scan line and a brief flash) covers the page;
 * `swap` runs while the screen is fully dark, so the theme change itself is never seen.
 * Callers skip this entirely under prefers-reduced-motion.
 */
type Swap = () => void;

const layer = (doc: Document, parent: HTMLElement, css: string) => {
  const el = doc.createElement('div');
  el.style.cssText = 'position:absolute;left:0;right:0;' + css;
  parent.appendChild(el);
  return el;
};

function build(doc: Document) {
  const root = doc.createElement('div');
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;';
  const top = layer(doc, root, 'top:0;height:50.5%;background:#000;transform-origin:50% 0;');
  const bot = layer(doc, root, 'bottom:0;height:50.5%;background:#000;transform-origin:50% 100%;');
  const flash = layer(doc, root, 'top:0;bottom:0;background:#b9fbff;mix-blend-mode:screen;opacity:0;');
  const scan = layer(doc, root,
    'top:50%;height:3px;margin-top:-1.5px;background:#fff;border-radius:50%;opacity:0;transform:scaleX(0);' +
    'box-shadow:0 0 14px 4px #b9fbff,0 0 60px 18px rgba(0,229,255,.45);');
  doc.body.appendChild(root);
  return { root, top, bot, flash, scan };
}

const run = (el: HTMLElement, k: Keyframe[], o: KeyframeAnimationOptions) => el.animate(k, { fill: 'forwards', ...o }).finished;

/** Switching into Atomic: black, a scan line draws across, then the picture opens from the centre line. */
export async function powerOn(doc: Document, swap: Swap) {
  const { root, top, bot, flash, scan } = build(doc);
  try {
    await run(root, [{ opacity: 0 }, { opacity: 1 }], { duration: 90 });
    swap();
    await run(scan, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], { duration: 190, easing: 'cubic-bezier(.2,.8,.2,1)' });
    const ease = 'cubic-bezier(.3,.9,.3,1)';
    await Promise.all([
      run(top, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 300, easing: ease }),
      run(bot, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 300, easing: ease }),
      run(flash, [{ opacity: .55 }, { opacity: 0 }], { duration: 300, easing: ease }),
      run(scan, [{ opacity: 1, transform: 'scaleX(1)', height: '3px' }, { opacity: 0, transform: 'scaleX(1)', height: '40px' }], { duration: 260, easing: 'ease-out' }),
    ]);
  } finally {
    root.remove();
  }
}

/** Leaving Atomic: the picture collapses to a bright line, the line shrinks to nothing, then the new theme fades in. */
export async function powerDown(doc: Document, swap: Swap) {
  const { root, top, bot, flash, scan } = build(doc);
  try {
    const ease = 'cubic-bezier(.6,0,.9,.4)';
    await Promise.all([
      run(top, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 200, easing: ease }),
      run(bot, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 200, easing: ease }),
      run(flash, [{ opacity: 0 }, { opacity: .6 }], { duration: 200, easing: ease }),
      run(scan, [{ opacity: 0, transform: 'scaleX(1)' }, { opacity: 1, transform: 'scaleX(1)' }], { duration: 200, easing: ease }),
    ]);
    flash.style.display = 'none';
    swap();
    await run(scan, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 1, transform: 'scaleX(0)' }], { duration: 170, easing: 'ease-in' });
    await run(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 140 });
  } finally {
    root.remove();
  }
}
