// The "mining finished" notification of the Quantum Digital Miner, as the mod draws it (src/main/java/io/github/enzodr/mekanismengineering/):
// - common/quantum/NoticePanel.java: the frozen mock-up B v2, a 200 x 58 panel in interface pixels, rectangle by rectangle with its colours;
//   the machine (its item, 16 px at 2.25 = 36 px) in a niche on the left, four lines on a screen: title, coordinates, dimension, blocks mined.
// - client/NoticeTerminal.java: the lines ("> " + toast...done, toast...coords.plain, toast...dim.*, toast...mined), in the game font with
//   its shadow; client/QuantumMinedText.java + client/gui/CompanionNumbers.java: the count grouped the language's way, with plain spaces.
// - client/QuantumMinerToast.java: Minecraft's own toast (ToastComponent), so top right of the game screen, flush with its edges; it stays
//   DISPLAY_MILLIS = 5000 ms. Vanilla ToastComponent slides a toast in from the right over 600 ms (squared ease) and out the same way.
// Here the view stands for the game window: the panel takes the interface scale the game would choose for a window of that size (its
// automatic scale: the largest whole number that leaves at least 320 x 240 interface pixels). Not reproduced: the toast's sound.
import { write } from './mcfont.js';

const W = 200, H = 58;
const SLIDE = 600, SHOWN = 5000;
const hex = n => '#' + n.toString(16).padStart(6, '0');
// NoticePanel.rects(false): x, y, width, height, colour
const RECTS = [
  [1, 0, 198, 58, 0x404651], [0, 1, 200, 56, 0x404651], [1, 1, 198, 56, 0x262B34], [1, 1, 198, 1, 0x4E5562],
  [3, 3, 38, 52, 0x151921], [4, 4, 36, 50, 0x2D323B], [4, 52, 36, 1, 0x64D1C7],
  [43, 3, 154, 52, 0x0C2C2E], [44, 4, 152, 50, 0x104042],
];
const SCAN = 0x124849, SCAN_FIRST = 7, SCAN_END = 53, SCAN_STEP = 4;
const BAR = [48, 49, 144, 2, 0x64D1C7];                       // a complete end: the full bar (BAR_FULL)
const TEXT_X = 48, LINE_Y = [8, 19, 29, 39], LINE_COLOUR = [0x96FFF0, 0xC9FFF7, 0x64D1C7, 0xC9FFF7];
const ICON = [4, 10, 36];                                      // ICON_X, ICON_Y, ICON_SIZE

/** Minecraft's automatic interface scale for a window of w x h pixels. */
const guiScale = (w, h) => { let s = 1; while (w / (s + 1) >= 320 && h / (s + 1) >= 240) s++; return s; };

/**
 * The notification over the top right corner of `host` (the 3D view). `lines` are the four texts, `icon` the machine's inventory picture.
 * Returns { show(), fixed(on), hide(), step(dt) }: step moves it on by dt ms and says whether it is on screen.
 */
export function qdmToast(host, { lines, icon }) {
  const clip = document.createElement('div');
  clip.className = 'me-toast';
  clip.setAttribute('aria-hidden', 'true');                    // the caption under the view says it in words
  const canvas = document.createElement('canvas');
  clip.append(canvas); host.append(clip);
  let scale = 0, ratio = 0;
  function paint() {
    const s = guiScale(host.clientWidth, host.clientHeight), r = Math.min(window.devicePixelRatio || 1, 3);
    if (s === scale && r === ratio) return;
    scale = s; ratio = r;
    const k = Math.max(1, Math.round(s * r));                  // canvas pixels for one interface pixel
    canvas.width = W * k; canvas.height = H * k;
    clip.style.width = canvas.style.width = W * s + 'px'; clip.style.height = canvas.style.height = H * s + 'px';
    const g = canvas.getContext('2d'); g.imageSmoothingEnabled = false;
    const box = ([x, y, w, h, c]) => { g.fillStyle = hex(c); g.fillRect(x * k, y * k, w * k, h * k); };
    RECTS.forEach(box);
    for (let y = SCAN_FIRST; y < SCAN_END; y += SCAN_STEP) box([44, y, 152, 1, SCAN]);
    box(BAR);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(icon, ICON[0] * k, ICON[1] * k, ICON[2] * k, ICON[2] * k);
    g.imageSmoothingEnabled = false;
    lines.forEach((t, i) => write(g, t, TEXT_X * k, LINE_Y[i] * k, hex(LINE_COLOUR[i]), k, true));
  }
  new ResizeObserver(() => { if (clip.style.display !== 'none') paint(); }).observe(host);

  let t = -1;                                                  // ms since it appeared, -1 = not on screen
  const place = v => { canvas.style.transform = `translateX(${((1 - v) * 100).toFixed(2)}%)`; };
  const hide = () => { t = -1; clip.style.display = 'none'; };
  hide();
  return {
    show() { t = 0; clip.style.display = ''; paint(); place(0); },
    /** Reduced motion: the notification stays on, still, or goes. */
    fixed(on) { if (on) { t = -1; clip.style.display = ''; paint(); place(1); } else hide(); },
    hide,
    get on() { return t >= 0; },
    step(dt) {
      if (t < 0) return false;
      t += dt;
      const a = Math.min(1, t / SLIDE), out = (t - SLIDE - SHOWN) / SLIDE;
      if (out >= 1) { hide(); return false; }
      place(out > 0 ? 1 - out * out : a * a);
      return true;
    },
  };
}
