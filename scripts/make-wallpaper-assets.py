#!/usr/bin/env python3
"""Chroma-key Mo Yuan and generate cinematic wallpaper plates."""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

ROOT = Path("/workspace")
SRC = ROOT / "attachments" / "d3475e6eaa76feaf09b4413351b22478.png"
PUBLIC = ROOT / "public"
THEMES = PUBLIC / "themes"
CHAR_OUT = PUBLIC / "character.png"
CHAR_WEB = PUBLIC / "character.webp"

W, H = 1290, 2796  # iPhone 15 Pro Max portrait
THUMB_W, THUMB_H = 240, 520


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def value_noise(h: int, w: int, cell: int, rng: np.random.Generator) -> np.ndarray:
    sh = max(2, h // cell + 2)
    sw = max(2, w // cell + 2)
    small = (rng.random((sh, sw)) * 255).astype(np.uint8)
    img = Image.fromarray(small, "L").resize((w, h), Image.Resampling.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def fbm(h: int, w: int, rng: np.random.Generator, octaves: list[tuple[int, float]]) -> np.ndarray:
    acc = np.zeros((h, w), dtype=np.float32)
    amp_sum = 0.0
    for cell, amp in octaves:
        acc += value_noise(h, w, cell, rng) * amp
        amp_sum += amp
    return acc / amp_sum


def warp_fbm(h: int, w: int, rng: np.random.Generator) -> np.ndarray:
    base = fbm(h, w, rng, [(18, 0.5), (48, 0.3), (120, 0.2)])
    dx = (fbm(h, w, rng, [(32, 1.0), (90, 0.5)]) - 0.5) * 80
    dy = (fbm(h, w, rng, [(28, 1.0), (80, 0.5)]) - 0.5) * 80
    yy, xx = np.mgrid[0:h, 0:w]
    xs = np.clip((xx + dx).astype(np.int32), 0, w - 1)
    ys = np.clip((yy + dy).astype(np.int32), 0, h - 1)
    return base[ys, xs]


def vignette(h: int, w: int, strength: float = 0.72, aspect: float = 0.85) -> np.ndarray:
    yy, xx = np.mgrid[0:h, 0:w]
    nx = (xx / (w - 1) - 0.5) * 2.0
    ny = (yy / (h - 1) - 0.5) * 2.0
    r = np.sqrt((nx * aspect) ** 2 + ny**2)
    return 1.0 - smoothstep(0.35, 1.35, r) * strength


def radial(h: int, w: int, cx: float, cy: float, rx: float, ry: float) -> np.ndarray:
    yy, xx = np.mgrid[0:h, 0:w]
    nx = (xx - cx * w) / (rx * w)
    ny = (yy - cy * h) / (ry * h)
    return np.exp(-(nx * nx + ny * ny))


def film_grain(h: int, w: int, rng: np.random.Generator, amount: float = 0.035) -> np.ndarray:
    g = rng.normal(0.0, amount, (h, w)).astype(np.float32)
    return g


def to_img(rgb: np.ndarray) -> Image.Image:
    clipped = np.clip(rgb, 0, 255).astype(np.uint8)
    return Image.fromarray(clipped, "RGB")


def chroma_key(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGB")
    arr = np.asarray(im, dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    key = np.array([8.8, 197.1, 29.9], dtype=np.float32)
    dist = np.sqrt(((arr - key) ** 2).sum(axis=2))
    chroma = g - np.maximum(r, b)

    a_dist = smoothstep(16.0, 78.0, dist)
    a_chroma = 1.0 - smoothstep(36.0, 118.0, chroma)
    alpha = np.minimum(a_dist, a_chroma)

    # Kill leftover screen: very green AND close to key
    screen = (dist < 28.0) | ((chroma > 90.0) & (dist < 55.0))
    alpha = np.where(screen, 0.0, alpha)

    # Spill suppression on remaining pixels
    spill = np.clip((g - np.maximum(r, b)) / 90.0, 0.0, 1.0) * (1.0 - alpha * 0.35)
    g2 = g - spill * np.maximum(0.0, g - (r + b) * 0.5)
    # Pull residual green toward luminance
    out = arr.copy()
    out[:, :, 1] = g2
    # Darken fully-transparent to black so jpeg-ish fringes don't flash
    out = out * alpha[..., None]

    # Slight edge contract: erode tiny green islands
    a8 = (alpha * 255).astype(np.uint8)
    a_img = Image.fromarray(a8, "L")
    a_img = a_img.filter(ImageFilter.MinFilter(3))
    a_img = a_img.filter(ImageFilter.MaxFilter(3))
    a_img = a_img.filter(ImageFilter.GaussianBlur(radius=0.8))
    alpha2 = np.asarray(a_img, dtype=np.float32) / 255.0
    # Keep interior of character (don't eat the suit)
    alpha = np.maximum(alpha * 0.35, np.minimum(alpha, alpha2 * 1.15))
    alpha = np.clip(alpha, 0, 1)

    rgba = np.dstack([out, alpha * 255.0]).astype(np.uint8)
    keyed = Image.fromarray(rgba, "RGBA")

    # Tight crop around opaque pixels
    bbox = keyed.split()[-1].point(lambda p: 255 if p > 12 else 0).getbbox()
    if bbox:
        pad = 36
        l, t, rgt, btm = bbox
        l = max(0, l - pad)
        t = max(0, t - 24)
        rgt = min(keyed.width, rgt + pad)
        btm = min(keyed.height, btm + 8)
        keyed = keyed.crop((l, t, rgt, btm))

    # Downscale for web while keeping print-quality for 2K wallpapers
    target_h = 2800
    if keyed.height > target_h:
        ratio = target_h / keyed.height
        keyed = keyed.resize(
            (max(1, int(keyed.width * ratio)), target_h),
            Image.Resampling.LANCZOS,
        )
    return keyed


def grade(rgb: np.ndarray, lift: np.ndarray, gain: np.ndarray, gamma: float = 1.0) -> np.ndarray:
    x = np.clip(rgb / 255.0, 0, 1)
    x = np.power(np.maximum(x, 1e-6), gamma)
    x = x * gain + lift
    return x * 255.0


def draw_compass(draw: ImageDraw.ImageDraw, cx: int, cy: int, radius: int, color: tuple[int, int, int, int]) -> None:
    # Outer rings
    for i, w in enumerate((2, 1, 1)):
        r = radius - i * 18
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, outline=color, width=w)
    # Cardinal ticks
    for ang in range(0, 360, 15):
        rad = math.radians(ang)
        inner = radius * (0.78 if ang % 90 == 0 else 0.88 if ang % 45 == 0 else 0.93)
        outer = radius * 0.98
        x1 = cx + inner * math.cos(rad)
        y1 = cy + inner * math.sin(rad)
        x2 = cx + outer * math.cos(rad)
        y2 = cy + outer * math.sin(rad)
        width = 3 if ang % 90 == 0 else 2 if ang % 45 == 0 else 1
        draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    # Diamond points N/E/S/W
    for ang, scale in ((270, 1.0), (0, 0.72), (90, 0.72), (180, 0.72)):
        rad = math.radians(ang)
        tip = radius * 0.62 * scale
        side = radius * 0.10
        tx = cx + tip * math.cos(rad)
        ty = cy + tip * math.sin(rad)
        px = math.cos(rad + math.pi / 2) * side
        py = math.sin(rad + math.pi / 2) * side
        bx = cx + (radius * 0.08) * math.cos(rad)
        by = cy + (radius * 0.08) * math.sin(rad)
        draw.polygon([(tx, ty), (bx + px, by + py), (bx - px, by - py)], fill=color)
    # Center
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=color)


def bg_ink(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    ink = warp_fbm(h, w, rng)
    ink2 = fbm(h, w, rng, [(12, 0.4), (40, 0.35), (110, 0.25)])
    flow = np.clip((ink * 1.25 + ink2 * 0.4) ** 1.6, 0, 1)
    # Vertical wash — darker at top (clock) and bottom
    yy = np.linspace(0, 1, h)[:, None]
    wash = 0.18 + 0.55 * np.sin(np.clip(yy * math.pi, 0, math.pi)) ** 1.4
    wash = np.broadcast_to(wash, (h, w))
    spotlight = radial(h, w, 0.50, 0.42, 0.42, 0.28) * 0.55
    paper = fbm(h, w, rng, [(3, 0.5), (9, 0.3), (28, 0.2)])

    # Ink black with faint warm paper in midtones
    lum = 8 + 22 * paper + 70 * flow * wash + 90 * spotlight
    r = lum * 0.92 + 6
    g = lum * 0.90 + 4
    b = lum * 0.88 + 8
    # Deep indigo in shadows
    shadow = 1.0 - flow
    b += shadow * 10
    rgb = np.dstack([r, g, b])
    rgb += film_grain(h, w, rng, 0.012)[:, :, None] * 255
    rgb *= vignette(h, w, 0.78, 0.9)[:, :, None]
    img = to_img(rgb)

    # Faint calligraphy-like strokes
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(7):
        x0 = int(rng.integers(w * 0.05, w * 0.95))
        y0 = int(rng.integers(h * 0.08, h * 0.55))
        x1 = x0 + int(rng.integers(-180, 180))
        y1 = y0 + int(rng.integers(80, 420))
        width = int(rng.integers(2, 9))
        alpha = int(rng.integers(18, 48))
        d.line([(x0, y0), (x1, y1)], fill=(210, 200, 180, alpha), width=width)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1.6))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return img


def bg_rain(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    base = fbm(h, w, rng, [(20, 0.45), (70, 0.35), (160, 0.2)])
    yy = np.linspace(0, 1, h)[:, None]
    sky = 0.22 + 0.55 * (1 - yy) ** 1.3
    sky = np.broadcast_to(sky, (h, w))
    lights = radial(h, w, 0.5, 0.38, 0.5, 0.32) * 0.5
    # Distant bokeh city band
    band = np.exp(-((yy - 0.62) ** 2) / 0.018)
    band = np.broadcast_to(band, (h, w)) * (0.25 + 0.5 * base)

    r = 10 + 28 * sky + 40 * lights + 55 * band * 0.7
    g = 14 + 32 * sky + 38 * lights + 48 * band * 0.55
    b = 22 + 48 * sky + 36 * lights + 40 * band * 0.4
    rgb = np.dstack([r, g, b])

    img = to_img(rgb)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    # Bokeh orbs
    for _ in range(48):
        x = int(rng.integers(0, w))
        y = int(rng.integers(int(h * 0.48), int(h * 0.78)))
        rad = int(rng.integers(4, 28))
        a = int(rng.integers(18, 70))
        col = (int(rng.integers(180, 255)), int(rng.integers(140, 210)), int(rng.integers(80, 140)), a)
        d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=col)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=6))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    # Rain streaks
    rain = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rain)
    for _ in range(420):
        x = int(rng.integers(-20, w + 20))
        y = int(rng.integers(0, h))
        length = int(rng.integers(18, 70))
        a = int(rng.integers(20, 70))
        rd.line([(x, y), (x + 3, y + length)], fill=(210, 220, 230, a), width=1)
    rain = rain.filter(ImageFilter.GaussianBlur(radius=0.4))
    img = Image.alpha_composite(img.convert("RGBA"), rain).convert("RGB")

    arr = np.asarray(img, dtype=np.float32)
    arr *= vignette(h, w, 0.7, 0.88)[:, :, None]
    arr += film_grain(h, w, rng, 0.02)[:, :, None] * 255
    return to_img(arr)


def bg_compass(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    n = fbm(h, w, rng, [(24, 0.5), (80, 0.3), (180, 0.2)])
    spot = radial(h, w, 0.5, 0.40, 0.55, 0.34)
    yy = np.linspace(0, 1, h)[:, None]
    r = 6 + 18 * n + 48 * spot
    g = 10 + 22 * n + 42 * spot
    b = 22 + 36 * n + 38 * spot
    # Deep navy
    r = r * 0.85 + 4
    g = g * 0.9 + 8
    b = b * 1.15 + 18
    rgb = np.dstack([r, g, b])
    rgb *= vignette(h, w, 0.65, 0.92)[:, :, None]
    img = to_img(rgb).convert("RGBA")

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    gold = (198, 168, 110, 70)
    draw_compass(d, w // 2, int(h * 0.36), int(w * 0.42), gold)
    # Fainter outer ring
    draw_compass(d, w // 2, int(h * 0.36), int(w * 0.58), (198, 168, 110, 28))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.4))
    img = Image.alpha_composite(img, overlay)

    # Stars
    stars = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stars)
    for _ in range(160):
        x = int(rng.integers(0, w))
        y = int(rng.integers(0, int(h * 0.55)))
        rad = int(rng.choice([1, 1, 1, 2, 2, 3]))
        a = int(rng.integers(40, 180))
        sd.ellipse([x, y, x + rad, y + rad], fill=(230, 220, 200, a))
    img = Image.alpha_composite(img, stars)
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    arr += film_grain(h, w, rng, 0.016)[:, :, None] * 255
    return to_img(arr)


def bg_hall(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    n = fbm(h, w, rng, [(10, 0.35), (36, 0.35), (90, 0.3)])
    # Marble veins via warped noise threshold
    veins_n = warp_fbm(h, w, rng)
    veins = smoothstep(0.46, 0.52, veins_n) * (1.0 - smoothstep(0.54, 0.62, veins_n))
    veins2 = smoothstep(0.58, 0.63, n) * (1.0 - smoothstep(0.66, 0.72, n))
    spot = radial(h, w, 0.5, 0.34, 0.38, 0.26)
    floor = radial(h, w, 0.5, 0.92, 0.7, 0.18)  # floor reflection glow

    lum = 10 + 16 * n + 70 * spot + 28 * floor
    r = lum * 1.05 + 8 + 90 * veins + 40 * veins2
    g = lum * 0.95 + 6 + 70 * veins + 30 * veins2
    b = lum * 0.82 + 5 + 40 * veins + 16 * veins2
    rgb = np.dstack([r, g, b])
    rgb *= vignette(h, w, 0.8, 0.86)[:, :, None]
    arr = rgb + film_grain(h, w, rng, 0.018)[:, :, None] * 255
    img = to_img(arr)

    # Architectural gold lines
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    gold = (186, 150, 92, 55)
    # Vertical columns
    for x in (int(w * 0.12), int(w * 0.88)):
        d.line([(x, int(h * 0.08)), (x, int(h * 0.92))], fill=gold, width=2)
    d.line([(int(w * 0.08), int(h * 0.18)), (int(w * 0.92), int(h * 0.18))], fill=gold, width=1)
    d.line([(int(w * 0.18), int(h * 0.78)), (int(w * 0.82), int(h * 0.78))], fill=(186, 150, 92, 30), width=1)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.6))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def bg_star(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    neb = warp_fbm(h, w, rng)
    neb2 = fbm(h, w, rng, [(40, 0.6), (120, 0.4)])
    spot = radial(h, w, 0.5, 0.40, 0.48, 0.30)
    r = 6 + 18 * neb + 36 * spot
    g = 8 + 14 * neb2 + 28 * spot
    b = 16 + 40 * neb + 22 * neb2 + 30 * spot
    rgb = np.dstack([r, g, b])
    rgb *= vignette(h, w, 0.6, 0.95)[:, :, None]
    img = to_img(rgb).convert("RGBA")

    stars = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(stars)
    for _ in range(280):
        x = int(rng.integers(0, w))
        y = int(rng.integers(0, h))
        rad = float(rng.choice([0.6, 0.8, 1.0, 1.2, 1.6, 2.2, 3.0], p=[0.25, 0.25, 0.2, 0.12, 0.1, 0.05, 0.03]))
        a = int(rng.integers(50, 210))
        col = (235, 230, 220, a)
        d.ellipse([x, y, x + rad * 2, y + rad * 2], fill=col)
        if rad > 2:
            d.line([(x - 4, y + rad), (x + rad * 2 + 4, y + rad)], fill=(235, 230, 220, a // 3), width=1)
            d.line([(x + rad, y - 4), (x + rad, y + rad * 2 + 4)], fill=(235, 230, 220, a // 3), width=1)
    img = Image.alpha_composite(img, stars)
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    arr += film_grain(h, w, rng, 0.02)[:, :, None] * 255
    return to_img(arr)


def bg_study(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    n = fbm(h, w, rng, [(16, 0.4), (50, 0.35), (130, 0.25)])
    lamp = radial(h, w, 0.5, 0.28, 0.55, 0.22)
    lamp2 = radial(h, w, 0.5, 0.42, 0.32, 0.28)
    yy = np.linspace(0, 1, h)[:, None]
    falloff = np.broadcast_to(1.0 - 0.45 * yy, (h, w))

    r = 12 + 20 * n + 110 * lamp + 70 * lamp2
    g = 9 + 14 * n + 70 * lamp + 42 * lamp2
    b = 7 + 10 * n + 28 * lamp + 18 * lamp2
    r *= falloff
    g *= falloff
    b *= falloff
    rgb = np.dstack([r, g, b])
    rgb *= vignette(h, w, 0.82, 0.8)[:, :, None]
    img = to_img(rgb).convert("RGBA")

    # Bookshelf silhouettes
    shelves = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(shelves)
    for side, x0 in (("L", 0), ("R", int(w * 0.78))):
        d.rectangle([x0, int(h * 0.22), x0 + int(w * 0.22), int(h * 0.88)], fill=(0, 0, 0, 90))
        for i in range(6):
            y = int(h * (0.26 + i * 0.10))
            d.line([(x0 + 8, y), (x0 + int(w * 0.22) - 8, y)], fill=(40, 28, 16, 110), width=3)
            for k in range(8):
                bx = x0 + 12 + k * int(w * 0.024)
                bh = int(rng.integers(28, 70))
                bw = int(rng.integers(8, 16))
                d.rectangle([bx, y - bh, bx + bw, y - 2], fill=(18, 12, 8, int(rng.integers(80, 140))))
    shelves = shelves.filter(ImageFilter.GaussianBlur(radius=1.2))
    img = Image.alpha_composite(img, shelves)
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    arr += film_grain(h, w, rng, 0.016)[:, :, None] * 255
    return to_img(arr)


def bg_void(rng: np.random.Generator) -> Image.Image:
    h, w = H, W
    n = fbm(h, w, rng, [(8, 0.5), (40, 0.3), (120, 0.2)])
    spot = radial(h, w, 0.5, 0.40, 0.36, 0.24)
    r = 4 + 8 * n + 28 * spot
    g = 4 + 8 * n + 24 * spot
    b = 5 + 9 * n + 22 * spot
    rgb = np.dstack([r, g, b])
    rgb *= vignette(h, w, 0.55, 0.95)[:, :, None]
    img = to_img(rgb).convert("RGBA")
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    # Single hairline gold rule
    d.line([(int(w * 0.18), int(h * 0.14)), (int(w * 0.82), int(h * 0.14))], fill=(198, 168, 110, 50), width=1)
    d.line([(int(w * 0.42), int(h * 0.14)), (int(w * 0.58), int(h * 0.14))], fill=(198, 168, 110, 120), width=1)
    img = Image.alpha_composite(img, overlay)
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    arr += film_grain(h, w, rng, 0.022)[:, :, None] * 255
    return to_img(arr)


THEMES_SPEC = [
    ("ink", "墨渊", bg_ink, 11),
    ("rain", "夜雨", bg_rain, 22),
    ("compass", "罗盘", bg_compass, 33),
    ("hall", "金厅", bg_hall, 44),
    ("star", "星渊", bg_star, 55),
    ("study", "书灯", bg_study, 66),
    ("void", "无光", bg_void, 77),
]


def save_jpeg(img: Image.Image, path: Path, quality: int = 88) -> None:
    rgb = img.convert("RGB")
    rgb.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def main() -> None:
    THEMES.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    print("keying character…")
    char = chroma_key(SRC)
    char.save(CHAR_OUT, "PNG", optimize=True)
    char.save(CHAR_WEB, "WEBP", quality=92, method=4)
    print("character", char.size, CHAR_OUT.stat().st_size, CHAR_WEB.stat().st_size)

    for slug, _name, fn, seed in THEMES_SPEC:
        print("theme", slug)
        rng = np.random.default_rng(seed)
        plate = fn(rng)
        # Slight contrast
        plate = ImageEnhance.Contrast(plate).enhance(1.08)
        plate = ImageEnhance.Color(plate).enhance(0.92)
        save_jpeg(plate, THEMES / f"{slug}.jpg", 90)
        thumb = plate.resize((THUMB_W, THUMB_H), Image.Resampling.LANCZOS)
        thumb = ImageEnhance.Contrast(thumb).enhance(1.05)
        save_jpeg(thumb, THEMES / f"{slug}-thumb.jpg", 82)
        print("  wrote", slug, plate.size)

    print("done")


if __name__ == "__main__":
    main()
