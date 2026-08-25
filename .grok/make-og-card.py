#!/usr/bin/env python3
"""Editorial 1200×630 lock-screen poster for 墨渊."""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace")
FONTS = ROOT / ".grok" / "fonts"
CHAR = ROOT / "public" / "character.png"
OUT_PNG = ROOT / ".grok" / "og-raw.png"

# 2× working canvas, downscaled at the end
S = 2
W, H = 1200 * S, 630 * S

INK = (9, 9, 11)
INK2 = (18, 18, 20)
IVORY = (243, 239, 230)
TAUPE = (154, 148, 136)
PAPER = (231, 225, 212)


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


def radial(h: int, w: int, cx: float, cy: float, rx: float, ry: float) -> np.ndarray:
    yy, xx = np.mgrid[0:h, 0:w]
    nx = (xx - cx * w) / (rx * w)
    ny = (yy - cy * h) / (ry * h)
    return np.exp(-(nx * nx + ny * ny))


def make_background(rng: np.random.Generator) -> Image.Image:
    paper = fbm(H, W, rng, [(6, 0.45), (18, 0.35), (48, 0.20)])
    grain = rng.normal(0.0, 0.018, (H, W)).astype(np.float32)

    yy = np.linspace(0, 1, H)[:, None]
    wash = 0.55 + 0.45 * np.sin(np.clip(yy * math.pi, 0, math.pi)) ** 1.15
    wash = np.broadcast_to(wash, (H, W))

    # Warm pool behind the figure (right), cooler field on the left for type
    key = radial(H, W, 0.78, 0.42, 0.34, 0.55) * 0.55
    left_glow = radial(H, W, 0.28, 0.48, 0.38, 0.50) * 0.18

    lum = 7 + 16 * paper * wash + 38 * key + 14 * left_glow
    r = lum * 0.96 + 4
    g = lum * 0.93 + 3
    b = lum * 0.90 + 5
    rgb = np.dstack([r, g, b]) + grain[:, :, None] * 255.0

    # Vignette
    nx = (np.linspace(-1, 1, W))[None, :]
    ny = (np.linspace(-1, 1, H))[:, None]
    vig = 1.0 - smoothstep(0.55, 1.28, np.sqrt((nx * 0.92) ** 2 + (ny * 1.05) ** 2)) * 0.55
    rgb *= vig[:, :, None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def draw_compass(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    radius: int,
    color: tuple[int, int, int, int],
    fill_n: tuple[int, int, int, int] | None = None,
) -> None:
    for i, width in enumerate((max(2, radius // 90), 1, 1)):
        r = radius - i * max(10, radius // 14)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=width)

    for ang in range(0, 360, 15):
        rad = math.radians(ang)
        inner = radius * (0.76 if ang % 90 == 0 else 0.86 if ang % 45 == 0 else 0.92)
        outer = radius * 0.98
        x1 = cx + inner * math.cos(rad)
        y1 = cy + inner * math.sin(rad)
        x2 = cx + outer * math.cos(rad)
        y2 = cy + outer * math.sin(rad)
        width = 3 if ang % 90 == 0 else 2 if ang % 45 == 0 else 1
        draw.line([(x1, y1), (x2, y2)], fill=color, width=width)

    n_fill = fill_n or color
    for ang, scale, col in (
        (270, 1.0, n_fill),
        (0, 0.72, color),
        (90, 0.72, color),
        (180, 0.72, color),
    ):
        rad = math.radians(ang)
        tip = radius * 0.58 * scale
        side = radius * 0.09
        tx = cx + tip * math.cos(rad)
        ty = cy + tip * math.sin(rad)
        px = math.cos(rad + math.pi / 2) * side
        py = math.sin(rad + math.pi / 2) * side
        bx = cx + (radius * 0.07) * math.cos(rad)
        by = cy + (radius * 0.07) * math.sin(rad)
        draw.polygon([(tx, ty), (bx + px, by + py), (bx - px, by - py)], fill=col)

    hole = max(4, radius // 28)
    draw.ellipse([cx - hole, cy - hole, cx + hole, cy + hole], fill=color)
    draw.ellipse(
        [cx - hole // 2, cy - hole // 2, cx + hole // 2, cy + hole // 2],
        fill=(INK[0], INK[1], INK[2], color[3]),
    )


def suppress_spill(im: Image.Image) -> Image.Image:
    arr = np.asarray(im).astype(np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    chroma = g - np.maximum(r, b)
    spill = np.clip(chroma / 55.0, 0.0, 1.0)
    # Pull leftover green toward luminance, then toward black
    lum = 0.21 * r + 0.72 * g + 0.07 * b
    g2 = g * (1.0 - spill) + lum * spill
    arr[:, :, 1] = g2
    arr[:, :, 0] = r * (1.0 - spill * 0.35) + lum * spill * 0.35
    arr[:, :, 2] = b * (1.0 - spill * 0.25) + lum * spill * 0.25
    # Drop obviously keyed pixels (green and not fully opaque)
    keyed = (chroma > 14) & (g > 28) & (a < 250)
    arr[:, :, 3] = np.where(keyed, np.minimum(a, 8.0), a)
    # Darken remaining semi-transparent fringe so it melts into the field
    fringe = (a > 8) & (a < 200)
    arr[:, :, 0] = np.where(fringe, arr[:, :, 0] * 0.35, arr[:, :, 0])
    arr[:, :, 1] = np.where(fringe, arr[:, :, 1] * 0.32, arr[:, :, 1])
    arr[:, :, 2] = np.where(fringe, arr[:, :, 2] * 0.30, arr[:, :, 2])
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


def load_character() -> Image.Image:
    im = Image.open(CHAR).convert("RGBA")
    im = suppress_spill(im)
    # Head, shoulders, chest — lock-screen crop
    top, bottom = 0, 1020
    im = im.crop((0, top, im.width, bottom))
    alpha = im.split()[-1]
    bbox = alpha.point(lambda p: 255 if p > 10 else 0).getbbox()
    if bbox:
        l, t, r, b = bbox
        pad = 12
        im = im.crop((max(0, l - pad), max(0, t - 8), min(im.width, r + pad), min(im.height, b + pad)))
    # Scale to canvas height with a little overscan
    target_h = int(H * 1.06)
    ratio = target_h / im.height
    im = im.resize((max(1, int(im.width * ratio)), target_h), Image.Resampling.LANCZOS)
    # Soften cutout edge
    a = im.split()[-1].filter(ImageFilter.GaussianBlur(radius=1.2))
    im.putalpha(a)
    # Left fade so he dissolves into the field
    arr = np.asarray(im).astype(np.float32)
    fade_w = int(im.width * 0.28)
    ramp = np.linspace(0.0, 1.0, fade_w, dtype=np.float32)
    # Ease the ramp so the cut is invisible
    ramp = ramp * ramp * (3.0 - 2.0 * ramp)
    arr[:, :fade_w, 3] *= ramp[None, :]
    # Slight bottom fade
    fade_h = int(im.height * 0.12)
    ramp_y = np.linspace(1.0, 0.45, fade_h, dtype=np.float32)
    arr[-fade_h:, :, 3] *= ramp_y[:, None]
    # Editorial grade: darker, warmer, silhouette-leaning
    arr[:, :, 0] *= 0.82
    arr[:, :, 1] *= 0.79
    arr[:, :, 2] *= 0.76
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


def text_width(font: ImageFont.FreeTypeFont, text: str, tracking: float = 0) -> float:
    if not text:
        return 0.0
    w = sum(font.getlength(ch) for ch in text)
    w += tracking * (len(text) - 1)
    return w


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill,
    tracking: float = 0,
) -> None:
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking


def main() -> None:
    rng = np.random.default_rng(渊_seed())
    bg = make_background(rng).convert("RGBA")

    # Large ghost compass behind the type
    ghost = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(ghost)
    draw_compass(
        gd,
        cx=int(W * 0.30),
        cy=int(H * 0.50),
        radius=int(H * 0.42),
        color=(154, 148, 136, 52),
        fill_n=(231, 225, 212, 64),
    )
    ghost = ghost.filter(ImageFilter.GaussianBlur(radius=0.6))
    bg = Image.alpha_composite(bg, ghost)

    # Character, right third
    char = load_character()
    cx = W - char.width + int(18 * S)
    cy = H - char.height + int(36 * S)
    bg.paste(char, (cx, cy), char)

    # Inner print frame
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    m1, m2 = 28 * S, 34 * S
    fd.rectangle([m1, m1, W - m1 - 1, H - m1 - 1], outline=(154, 148, 136, 90), width=max(1, S))
    fd.rectangle([m2, m2, W - m2 - 1, H - m2 - 1], outline=(231, 225, 212, 40), width=max(1, S))
    bg = Image.alpha_composite(bg, frame)

    # Type
    title_font = ImageFont.truetype(str(FONTS / "NotoSerifSC-700.ttf"), 118 * S)
    latin_font = ImageFont.truetype(str(FONTS / "Cormorant-500.ttf"), 26 * S)
    tag_font = ImageFont.truetype(str(FONTS / "Cormorant-Italic.ttf"), 20 * S)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    title = "墨渊"
    title_track = 22 * S
    tw = text_width(title_font, title, title_track)
    latin = "MO YUNN"
    latin_track = 14 * S
    lw = text_width(latin_font, latin, latin_track)
    tag = "lock screen"
    tag_track = 6 * S
    tagw = text_width(tag_font, tag, tag_track)

    # Left lockup, vertically centered, well inside the frame
    block_w = max(tw, lw, tagw)
    left = int(W * 0.285 - block_w / 2)
    left = max(int(72 * S), min(left, int(W * 0.42 - block_w)))

    title_h = 118 * S
    latin_h = 26 * S
    gap1, gap2, gap3 = 18 * S, 22 * S, 16 * S
    rule_w = int(block_w * 0.55)
    block_h = title_h + gap1 + latin_h + gap2 + 2 * S + gap3 + 20 * S
    top = int((H - block_h) / 2) - 6 * S

    # Small crisp compass seal above the title
    seal = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(seal)
    seal_cx = left + int(block_w / 2)
    seal_cy = top - int(44 * S)
    draw_compass(
        sd,
        cx=seal_cx,
        cy=seal_cy,
        radius=int(32 * S),
        color=(231, 225, 212, 220),
        fill_n=(243, 239, 230, 240),
    )
    overlay = Image.alpha_composite(overlay, seal)
    d = ImageDraw.Draw(overlay)

    draw_tracked(d, (left, top), title, title_font, (*IVORY, 245), title_track)

    latin_x = left + (block_w - lw) / 2
    latin_y = top + title_h + gap1
    draw_tracked(d, (latin_x, latin_y), latin, latin_font, (*TAUPE, 230), latin_track)

    rule_y = latin_y + latin_h + gap2
    rule_x0 = left + (block_w - rule_w) / 2
    d.line([(rule_x0, rule_y), (rule_x0 + rule_w, rule_y)], fill=(*PAPER, 140), width=max(1, S))

    tag_x = left + (block_w - tagw) / 2
    tag_y = rule_y + gap3
    draw_tracked(d, (tag_x, tag_y), tag, tag_font, (*TAUPE, 200), tag_track)

    bg = Image.alpha_composite(bg, overlay)
    out = bg.convert("RGB").resize((1200, 630), Image.Resampling.LANCZOS)
    out.save(OUT_PNG, "PNG")
    print(f"wrote {OUT_PNG} {out.size}")


def 渊_seed() -> int:
    return 0x58A1


if __name__ == "__main__":
    main()
