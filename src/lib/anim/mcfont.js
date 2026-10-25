// The game's default font, drawn from its own bitmaps (vanilla 1.21.1 assets/minecraft/font/include/default.json):
// - ascii.png: 8 x 8 cells in the code page 437 layout (row = code >> 4, column = code & 15 for plain ASCII; ░ and █ further down);
// - nonlatin_european.png: 8 x 8 cells, the middle dot in its first row;
// - accented.png: 9 x 12 cells, height 12 and ascent 10, so each glyph is drawn 3 pixels higher than an ASCII one (same baseline).
// Advance of a glyph = its rightmost lit column + 1, plus 1 of spacing (BitmapProvider); a space advances 4 (include/space.json).
// A text with a shadow is drawn first one pixel down and right in its colour at a quarter of its brightness (Font.drawString).

const sheets = [];                                  // { img, px, cw, ch, dy }: ascii, nonlatin_european, accented
const tinted = new Map();                           // 'sheet|colour' -> canvas
const glyphs = new Map();

// the letters of the French texts in accented.png: [row, column], as default.json lists them
const ACCENTED = {
  À: [0, 0], Ç: [0, 7], È: [0, 8], É: [0, 9], à: [1, 12], â: [1, 14], ä: [2, 0], ç: [2, 3], î: [2, 6], ï: [2, 7],
  ô: [2, 11], ö: [2, 13], ù: [2, 14], û: [3, 0], ü: [3, 1], è: [15, 12], é: [15, 13], ê: [15, 14], ë: [15, 15],
};

function pixels(img) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  return g.getImageData(0, 0, c.width, c.height);
}

let loading = null;
/** Loads the three sheets once (plain pictures: nonlatin_european and accented are tall, which getTexture would take for animation strips). */
export function loadFont(base) {
  const load = file => new Promise((ok, ko) => {
    const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('missing font ' + file));
    i.src = `${base}/minecraft/textures/font/${file}.png`;
  });
  return (loading ??= Promise.all(['ascii', 'nonlatin_european', 'accented'].map(load)).then(([ascii, nonlatin, accented]) => {
    sheets.push({ img: ascii, px: pixels(ascii), cw: 8, ch: 8, dy: 0 }, { img: nonlatin, px: pixels(nonlatin), cw: 8, ch: 8, dy: 0 },
      { img: accented, px: pixels(accented), cw: 9, ch: 12, dy: -3 });
  }));
}

/** Where a character is in the font and how far it advances. */
export function glyph(ch) {
  let g = glyphs.get(ch);
  if (g) return g;
  const code = ch.charCodeAt(0);
  let sheet = 0, col = code & 15, row = code >> 4;
  if (ch === ' ') g = { adv: 4 };
  else {
    if (ch === '·') { sheet = 1; col = 3; row = 0; }
    else if (ch === '░') { col = 0; row = 11; }
    else if (ch === '█') { col = 11; row = 13; }
    else if (ACCENTED[ch]) { sheet = 2; [row, col] = ACCENTED[ch]; }
    const s = sheets[sheet], px = s.px;
    let w = 0;
    for (let x = s.cw - 1; x >= 0 && !w; x--) for (let y = 0; y < s.ch; y++) if (px.data[((row * s.ch + y) * px.width + col * s.cw + x) * 4 + 3] > 0) { w = x + 1; break; }
    g = { sheet, sx: col * s.cw, sy: row * s.ch, adv: w + 1 };
  }
  glyphs.set(ch, g);
  return g;
}

/** Width of a text in font pixels. */
export const width = s => { let w = 0; for (const ch of s) w += glyph(ch).adv; return w; };

function sheetIn(sheet, colour) {
  const k = sheet + colour;
  let c = tinted.get(k);
  if (!c) {
    const img = sheets[sheet].img;
    c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = colour; g.fillRect(0, 0, c.width, c.height);
    tinted.set(k, c);
  }
  return c;
}

/** The colour of a text's shadow: each channel at a quarter ((rgb & 0xFCFCFC) >> 2). */
const shadowOf = colour => '#' + [1, 3, 5].map(i => (parseInt(colour.slice(i, i + 2), 16) >> 2).toString(16).padStart(2, '0')).join('');

/** Writes `text` at (x, y) (top of the line) in `colour` ('#rrggbb'), each font pixel `scale` canvas pixels wide. */
export function write(g, text, x, y, colour, scale = 1, shadow = false) {
  if (shadow) write(g, text, x + scale, y + scale, shadowOf(colour), scale);
  for (const ch of text) {
    const gl = glyph(ch);
    if (gl.sheet !== undefined) {
      const s = sheets[gl.sheet];
      g.drawImage(sheetIn(gl.sheet, colour), gl.sx, gl.sy, s.cw, s.ch, x, y + s.dy * scale, s.cw * scale, s.ch * scale);
    }
    x += gl.adv * scale;
  }
}
