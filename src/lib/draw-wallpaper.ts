import { CHARACTER_SRC, QUOTES, THEMES, type QuoteId, type ThemeId } from "./themes";

export interface DrawOptions {
  themeId: ThemeId;
  scale: number;
  offsetX: number;
  offsetY: number;
  glow: number;
  vignette: number;
  grain: number;
  quoteId: QuoteId;
  clockStyle?: "classic" | "editorial" | "none";
  showButtons?: boolean;
  now?: Date;
}

const imageCache = new Map<string, HTMLImageElement>();
let grainTile: HTMLCanvasElement | null = null;

function makeGrainTile(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 160;
  const g = c.getContext("2d");
  if (!g) return c;
  const data = g.createImageData(160, 160);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 118 + Math.random() * 40;
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  g.putImageData(data, 0, 0);
  grainTile = c;
  return c;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit?.complete && hit.naturalWidth > 0) return Promise.resolve(hit);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export async function preloadTheme(themeId: ThemeId): Promise<{
  bg: HTMLImageElement;
  character: HTMLImageElement;
}> {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const [bg, character] = await Promise.all([
    loadImage(theme.plate),
    loadImage(CHARACTER_SRC),
  ]);
  return { bg, character };
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const ir = img.width / img.height;
  const cr = w / h;
  let dw: number, dh: number, dx: number, dy: number;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
    dx = (w - dw) / 2;
    dy = 0;
  } else {
    dw = w;
    dh = w / ir;
    dx = 0;
    dy = (h - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function characterBox(
  w: number,
  h: number,
  img: HTMLImageElement,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  const charH = h * 0.68 * scale;
  const charW = charH * (img.width / img.height);
  const x = w / 2 - charW / 2 + offsetX * w;
  const y = h - charH - h * 0.045 + offsetY * h;
  return { x, y, charW, charH };
}

function withAlpha(rgba: string, alpha: number) {
  return rgba.replace(/[\d.]+\)$/, `${alpha})`);
}

export function drawWallpaper(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: HTMLImageElement,
  character: HTMLImageElement,
  options: DrawOptions,
) {
  const theme = THEMES.find((t) => t.id === options.themeId) ?? THEMES[0];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, w, h);
  drawCover(ctx, bg, w, h);

  const { x, y, charW, charH } = characterBox(
    w,
    h,
    character,
    options.scale,
    options.offsetX,
    options.offsetY,
  );

  const cx = x + charW / 2;
  const torsoY = y + charH * 0.32;

  if (options.glow > 0.01) {
    const g = ctx.createRadialGradient(
      cx,
      torsoY,
      charW * 0.08,
      cx,
      torsoY,
      Math.max(charW, charH * 0.55) * (0.7 + options.glow * 0.5),
    );
    g.addColorStop(0, theme.glow);
    g.addColorStop(0.45, withAlpha(theme.glow, 0.1));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.filter = `blur(${Math.max(8, w * 0.018)}px)`;
  ctx.beginPath();
  ctx.ellipse(cx, y + charH * 0.985, charW * 0.28, h * 0.012, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = Math.max(12, w * 0.045) * options.glow;
  ctx.drawImage(character, x, y, charW, charH);
  ctx.restore();

  ctx.drawImage(character, x, y, charW, charH);

  if (options.vignette > 0.01) {
    const v = ctx.createRadialGradient(
      w * 0.5,
      h * 0.42,
      h * 0.12,
      w * 0.5,
      h * 0.5,
      h * 0.78,
    );
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${0.72 * options.vignette})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  if (options.grain > 0.01) {
    const tile = makeGrainTile();
    ctx.save();
    ctx.globalAlpha = 0.045 + options.grain * 0.1;
    ctx.globalCompositeOperation = "overlay";
    const pat = ctx.createPattern(tile, "repeat");
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }
}

function formatTime(now: Date) {
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${now.getHours()}:${m}`;
}

function formatDate(now: Date) {
  const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return `${now.getMonth() + 1}月${now.getDate()}日 ${week[now.getDay()]}`;
}

export function drawLockChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: DrawOptions,
) {
  const now = options.now ?? new Date();
  const pad = w * 0.086;

  if (options.clockStyle === "classic") {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `500 ${Math.round(w * 0.195)}px Outfit, system-ui, sans-serif`;
    ctx.fillText(formatTime(now), w / 2, h * 0.105);
    ctx.font = `400 ${Math.round(w * 0.038)}px Outfit, system-ui, sans-serif`;
    ctx.globalAlpha = 0.88;
    ctx.fillText(formatDate(now), w / 2, h * 0.105 + w * 0.2);
    ctx.restore();
  } else if (options.clockStyle === "editorial") {
    ctx.save();
    ctx.fillStyle = "rgba(243,239,230,0.94)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `500 ${Math.round(w * 0.168)}px "Cormorant Garamond", "Noto Serif SC", serif`;
    ctx.fillText(formatTime(now), w / 2, h * 0.112);
    ctx.font = `400 ${Math.round(w * 0.032)}px "Noto Serif SC", serif`;
    ctx.globalAlpha = 0.72;
    ctx.fillText(formatDate(now), w / 2, h * 0.112 + w * 0.175);
    ctx.restore();
  }

  const quote = QUOTES.find((q) => q.id === options.quoteId);
  if (quote && quote.id !== "none") {
    ctx.save();
    ctx.fillStyle = "rgba(243,239,230,0.78)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 ${Math.round(w * 0.036)}px "Noto Serif SC", "Cormorant Garamond", serif`;
    const qy = options.clockStyle === "none" ? h * 0.12 : h * 0.82;
    ctx.fillText(quote.text, w / 2, qy);
    if (quote.sub) {
      ctx.font = `400 ${Math.round(w * 0.022)}px Outfit, sans-serif`;
      ctx.globalAlpha = 0.5;
      ctx.fillText(quote.sub, w / 2, qy + w * 0.042);
    }
    ctx.restore();
  }

  if (options.showButtons && options.clockStyle !== "none") {
    const by = h * 0.905;
    const br = w * 0.062;
    const left = pad + br;
    const right = w - pad - br;
    for (const bx of [left, right]) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20,20,22,0.42)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = Math.max(1, w * 0.002);
      ctx.stroke();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.88)";
    ctx.lineWidth = Math.max(1.5, w * 0.0032);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(left, by - br * 0.28);
    ctx.lineTo(left, by + br * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(left, by - br * 0.28, br * 0.18, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(left - br * 0.16, by + br * 0.22);
    ctx.lineTo(left + br * 0.16, by + br * 0.22);
    ctx.stroke();

    const camW = br * 0.64;
    const camH = br * 0.48;
    const camX = right - camW / 2;
    const camY = by - camH / 2;
    ctx.beginPath();
    ctx.rect(camX, camY, camW, camH);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(right, by, br * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    const iw = w * 0.28;
    const ih = Math.max(4, h * 0.0045);
    ctx.fillRect(w / 2 - iw / 2, h * 0.968, iw, ih);
    ctx.restore();
  }
}

export async function exportWallpaper(
  options: DrawOptions,
  width: number,
  height: number,
  withLock: boolean,
): Promise<Blob> {
  const { bg, character } = await preloadTheme(options.themeId);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  drawWallpaper(ctx, width, height, bg, character, options);
  if (withLock) drawLockChrome(ctx, width, height, options);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      "image/jpeg",
      0.94,
    );
  });
}
