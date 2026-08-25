import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Flashlight, c as Camera, i as RotateCcw, l as Battery, o as Download, r as Signal, s as ChevronDown, t as Wifi } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BET4Qb_9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaults = {
	themeId: "ink",
	clockStyle: "classic",
	quoteId: "name",
	scale: 1,
	offsetX: 0,
	offsetY: 0,
	glow: .82,
	vignette: .62,
	grain: .35,
	sizeId: "promax",
	showButtons: true
};
var useStudio = create((set) => ({
	...defaults,
	setTheme: (themeId) => set({ themeId }),
	setClock: (clockStyle) => set({ clockStyle }),
	setQuote: (quoteId) => set({ quoteId }),
	setScale: (scale) => set({ scale }),
	setOffsetX: (offsetX) => set({ offsetX }),
	setOffsetY: (offsetY) => set({ offsetY }),
	setGlow: (glow) => set({ glow }),
	setVignette: (vignette) => set({ vignette }),
	setGrain: (grain) => set({ grain }),
	setSize: (sizeId) => set({ sizeId }),
	setShowButtons: (showButtons) => set({ showButtons }),
	reset: () => set(defaults)
}));
var THEMES = [
	{
		id: "ink",
		name: "墨渊",
		nameEn: "Ink",
		caption: "墨色沉底，人立其中",
		plate: "/themes/ink.jpg",
		thumb: "/themes/ink-thumb.jpg",
		glow: "rgba(210, 200, 180, 0.28)"
	},
	{
		id: "rain",
		name: "夜雨",
		nameEn: "Rain",
		caption: "雨落无声，灯火远处",
		plate: "/themes/rain.jpg",
		thumb: "/themes/rain-thumb.jpg",
		glow: "rgba(160, 190, 220, 0.30)"
	},
	{
		id: "compass",
		name: "罗盘",
		nameEn: "Compass",
		caption: "星轨为针，夜色为盘",
		plate: "/themes/compass.jpg",
		thumb: "/themes/compass-thumb.jpg",
		glow: "rgba(198, 168, 110, 0.32)"
	},
	{
		id: "hall",
		name: "金厅",
		nameEn: "Hall",
		caption: "廊柱无言，金线微光",
		plate: "/themes/hall.jpg",
		thumb: "/themes/hall-thumb.jpg",
		glow: "rgba(210, 170, 100, 0.34)"
	},
	{
		id: "star",
		name: "星渊",
		nameEn: "Stars",
		caption: "星子疏落，深空无岸",
		plate: "/themes/star.jpg",
		thumb: "/themes/star-thumb.jpg",
		glow: "rgba(180, 190, 220, 0.30)"
	},
	{
		id: "study",
		name: "书灯",
		nameEn: "Lamp",
		caption: "一灯如豆，夜读未央",
		plate: "/themes/study.jpg",
		thumb: "/themes/study-thumb.jpg",
		glow: "rgba(232, 170, 90, 0.36)"
	},
	{
		id: "void",
		name: "无光",
		nameEn: "Void",
		caption: "只留轮廓，其余皆寂",
		plate: "/themes/void.jpg",
		thumb: "/themes/void-thumb.jpg",
		glow: "rgba(220, 214, 200, 0.22)"
	}
];
var QUOTES = [
	{
		id: "none",
		text: "无"
	},
	{
		id: "name",
		text: "墨渊",
		sub: "MO YUNN"
	},
	{
		id: "night",
		text: "夜色正好"
	},
	{
		id: "ink",
		text: "深沉如墨"
	},
	{
		id: "still",
		text: "Stay still."
	},
	{
		id: "unnamed",
		text: "未命名的深渊"
	}
];
var SIZES = [
	{
		id: "iphone",
		label: "iPhone",
		w: 1170,
		h: 2532
	},
	{
		id: "promax",
		label: "Pro Max",
		w: 1290,
		h: 2796
	},
	{
		id: "android",
		label: "Android",
		w: 1080,
		h: 2400
	},
	{
		id: "tall",
		label: "2K",
		w: 1440,
		h: 3120
	}
];
var CLOCKS = [
	{
		id: "classic",
		label: "经典"
	},
	{
		id: "editorial",
		label: "衬线"
	},
	{
		id: "none",
		label: "纯壁纸"
	}
];
var CHARACTER_SRC = "/character.webp";
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function useNow(active) {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(/* @__PURE__ */ new Date());
		if (!active) return;
		const id = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => window.clearInterval(id);
	}, [active]);
	return now;
}
function pad(n) {
	return n.toString().padStart(2, "0");
}
var WEEK = [
	"星期日",
	"星期一",
	"星期二",
	"星期三",
	"星期四",
	"星期五",
	"星期六"
];
function PhonePreview() {
	const themeId = useStudio((s) => s.themeId);
	const scale = useStudio((s) => s.scale);
	const offsetX = useStudio((s) => s.offsetX);
	const offsetY = useStudio((s) => s.offsetY);
	const glow = useStudio((s) => s.glow);
	const vignette = useStudio((s) => s.vignette);
	const grain = useStudio((s) => s.grain);
	const clockStyle = useStudio((s) => s.clockStyle);
	const quoteId = useStudio((s) => s.quoteId);
	const showButtons = useStudio((s) => s.showButtons);
	const now = useNow(clockStyle !== "none");
	const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
	const quote = QUOTES.find((q) => q.id === quoteId);
	(0, import_react.useEffect)(() => {
		for (const item of THEMES) {
			const img = new Image();
			img.src = item.plate;
		}
	}, []);
	const time = now ? `${now.getHours()}:${pad(now.getMinutes())}` : "9:41";
	const date = now ? `${now.getMonth() + 1}月${now.getDate()}日 ${WEEK[now.getDay()]}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "studio-stage relative flex shrink-0 items-center justify-center px-4 py-4 md:min-h-0 md:flex-1 md:py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "phone-shell is-ready relative",
			style: {
				"--scale": scale,
				"--ox": offsetX,
				"--oy": offsetY,
				"--glow": glow,
				"--vignette": vignette,
				"--grain": grain,
				"--glow-color": theme.glow
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "phone-bezel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "phone-screen",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: theme.plate,
							alt: "",
							className: "wallpaper-plate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wallpaper-glow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: CHARACTER_SRC,
							alt: theme.name,
							className: "wallpaper-char"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wallpaper-vignette" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wallpaper-grain" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lock-layer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dynamic-island" }),
								clockStyle !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "status-icons",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signal, {
											className: "size-3",
											strokeWidth: 2.2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
											className: "size-3",
											strokeWidth: 2.2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, {
											className: "size-3.5",
											strokeWidth: 2.2
										})
									]
								}),
								clockStyle === "classic" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "lock-clock lock-clock-classic",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-time tabular-nums",
										children: time
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-date",
										children: date
									})]
								}),
								clockStyle === "editorial" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "lock-clock lock-clock-editorial",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-time tabular-nums",
										children: time
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-date",
										children: date
									})]
								}),
								quote && quote.id !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("lock-quote", clockStyle === "none" && "lock-quote-solo"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: quote.text }), quote.sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "lock-quote-sub",
										children: quote.sub
									}) : null]
								}),
								showButtons && clockStyle !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-btn lock-btn-left",
										"aria-hidden": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flashlight, {
											className: "size-5",
											strokeWidth: 1.6
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lock-btn lock-btn-right",
										"aria-hidden": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
											className: "size-5",
											strokeWidth: 1.6
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "home-bar" })
								] })
							]
						})
					]
				})
			})
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			outline: "bg-transparent text-fg ring-1 ring-line hover:bg-surface-2",
			subtle: "bg-surface-2 text-fg hover:bg-line"
		},
		size: {
			sm: "h-9 rounded-md px-3 text-sm",
			md: "h-11 rounded-lg px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			icon: "size-11 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
function Slider({ className, min = 0, max = 1, step = .01, value, onValueChange, "aria-label": ariaLabel }) {
	const current = value[0] ?? min;
	const pct = (current - min) / (max - min) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "range",
		min,
		max,
		step,
		value: current,
		"aria-label": ariaLabel,
		onChange: (e) => onValueChange([Number(e.target.value)]),
		className: cn("range", className),
		style: { "--pct": `${pct}%` }
	});
}
var imageCache = /* @__PURE__ */ new Map();
var grainTile = null;
function makeGrainTile() {
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
function loadImage(src) {
	const hit = imageCache.get(src);
	if (hit?.complete && hit.naturalWidth > 0) return Promise.resolve(hit);
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			imageCache.set(src, img);
			resolve(img);
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load ${src}`));
		img.src = src;
	});
}
async function preloadTheme(themeId) {
	const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
	const [bg, character] = await Promise.all([loadImage(theme.plate), loadImage(CHARACTER_SRC)]);
	return {
		bg,
		character
	};
}
function drawCover(ctx, img, w, h) {
	const ir = img.width / img.height;
	const cr = w / h;
	let dw, dh, dx, dy;
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
function characterBox(w, h, img, scale, offsetX, offsetY) {
	const charH = h * .68 * scale;
	const charW = charH * (img.width / img.height);
	return {
		x: w / 2 - charW / 2 + offsetX * w,
		y: h - charH - h * .045 + offsetY * h,
		charW,
		charH
	};
}
function withAlpha(rgba, alpha) {
	return rgba.replace(/[\d.]+\)$/, `${alpha})`);
}
function drawWallpaper(ctx, w, h, bg, character, options) {
	const theme = THEMES.find((t) => t.id === options.themeId) ?? THEMES[0];
	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = "#09090b";
	ctx.fillRect(0, 0, w, h);
	drawCover(ctx, bg, w, h);
	const { x, y, charW, charH } = characterBox(w, h, character, options.scale, options.offsetX, options.offsetY);
	const cx = x + charW / 2;
	const torsoY = y + charH * .32;
	if (options.glow > .01) {
		const g = ctx.createRadialGradient(cx, torsoY, charW * .08, cx, torsoY, Math.max(charW, charH * .55) * (.7 + options.glow * .5));
		g.addColorStop(0, theme.glow);
		g.addColorStop(.45, withAlpha(theme.glow, .1));
		g.addColorStop(1, "rgba(0,0,0,0)");
		ctx.save();
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
		ctx.restore();
	}
	ctx.save();
	ctx.fillStyle = "rgba(0,0,0,0.45)";
	ctx.filter = `blur(${Math.max(8, w * .018)}px)`;
	ctx.beginPath();
	ctx.ellipse(cx, y + charH * .985, charW * .28, h * .012, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.save();
	ctx.shadowColor = theme.glow;
	ctx.shadowBlur = Math.max(12, w * .045) * options.glow;
	ctx.drawImage(character, x, y, charW, charH);
	ctx.restore();
	ctx.drawImage(character, x, y, charW, charH);
	if (options.vignette > .01) {
		const v = ctx.createRadialGradient(w * .5, h * .42, h * .12, w * .5, h * .5, h * .78);
		v.addColorStop(0, "rgba(0,0,0,0)");
		v.addColorStop(1, `rgba(0,0,0,${.72 * options.vignette})`);
		ctx.fillStyle = v;
		ctx.fillRect(0, 0, w, h);
	}
	if (options.grain > .01) {
		const tile = makeGrainTile();
		ctx.save();
		ctx.globalAlpha = .045 + options.grain * .1;
		ctx.globalCompositeOperation = "overlay";
		const pat = ctx.createPattern(tile, "repeat");
		if (pat) {
			ctx.fillStyle = pat;
			ctx.fillRect(0, 0, w, h);
		}
		ctx.restore();
	}
}
function formatTime(now) {
	const m = now.getMinutes().toString().padStart(2, "0");
	return `${now.getHours()}:${m}`;
}
function formatDate(now) {
	return `${now.getMonth() + 1}月${now.getDate()}日 ${[
		"星期日",
		"星期一",
		"星期二",
		"星期三",
		"星期四",
		"星期五",
		"星期六"
	][now.getDay()]}`;
}
function drawLockChrome(ctx, w, h, options) {
	const now = options.now ?? /* @__PURE__ */ new Date();
	const pad = w * .086;
	if (options.clockStyle === "classic") {
		ctx.save();
		ctx.fillStyle = "rgba(255,255,255,0.96)";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = `500 ${Math.round(w * .195)}px Outfit, system-ui, sans-serif`;
		ctx.fillText(formatTime(now), w / 2, h * .105);
		ctx.font = `400 ${Math.round(w * .038)}px Outfit, system-ui, sans-serif`;
		ctx.globalAlpha = .88;
		ctx.fillText(formatDate(now), w / 2, h * .105 + w * .2);
		ctx.restore();
	} else if (options.clockStyle === "editorial") {
		ctx.save();
		ctx.fillStyle = "rgba(243,239,230,0.94)";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = `500 ${Math.round(w * .168)}px "Cormorant Garamond", "Noto Serif SC", serif`;
		ctx.fillText(formatTime(now), w / 2, h * .112);
		ctx.font = `400 ${Math.round(w * .032)}px "Noto Serif SC", serif`;
		ctx.globalAlpha = .72;
		ctx.fillText(formatDate(now), w / 2, h * .112 + w * .175);
		ctx.restore();
	}
	const quote = QUOTES.find((q) => q.id === options.quoteId);
	if (quote && quote.id !== "none") {
		ctx.save();
		ctx.fillStyle = "rgba(243,239,230,0.78)";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = `500 ${Math.round(w * .036)}px "Noto Serif SC", "Cormorant Garamond", serif`;
		const qy = options.clockStyle === "none" ? h * .12 : h * .82;
		ctx.fillText(quote.text, w / 2, qy);
		if (quote.sub) {
			ctx.font = `400 ${Math.round(w * .022)}px Outfit, sans-serif`;
			ctx.globalAlpha = .5;
			ctx.fillText(quote.sub, w / 2, qy + w * .042);
		}
		ctx.restore();
	}
	if (options.showButtons && options.clockStyle !== "none") {
		const by = h * .905;
		const br = w * .062;
		const left = pad + br;
		const right = w - pad - br;
		for (const bx of [left, right]) {
			ctx.beginPath();
			ctx.arc(bx, by, br, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(20,20,22,0.42)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,0.16)";
			ctx.lineWidth = Math.max(1, w * .002);
			ctx.stroke();
		}
		ctx.save();
		ctx.strokeStyle = "rgba(255,255,255,0.88)";
		ctx.lineWidth = Math.max(1.5, w * .0032);
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(left, by - br * .28);
		ctx.lineTo(left, by + br * .12);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(left, by - br * .28, br * .18, Math.PI, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(left - br * .16, by + br * .22);
		ctx.lineTo(left + br * .16, by + br * .22);
		ctx.stroke();
		const camW = br * .64;
		const camH = br * .48;
		const camX = right - camW / 2;
		const camY = by - camH / 2;
		ctx.beginPath();
		ctx.rect(camX, camY, camW, camH);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(right, by, br * .16, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();
		ctx.save();
		ctx.fillStyle = "rgba(255,255,255,0.55)";
		const iw = w * .28;
		const ih = Math.max(4, h * .0045);
		ctx.fillRect(w / 2 - iw / 2, h * .968, iw, ih);
		ctx.restore();
	}
}
async function exportWallpaper(options, width, height, withLock) {
	const { bg, character } = await preloadTheme(options.themeId);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unsupported");
	drawWallpaper(ctx, width, height, bg, character, options);
	if (withLock) drawLockChrome(ctx, width, height, options);
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("Export failed")), "image/jpeg", .94);
	});
}
function Segment({ value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex rounded-lg bg-surface-2 p-1",
		children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(opt.id),
			className: cn("h-9 min-w-0 flex-1 rounded-md px-2 font-sans text-sm font-medium transition-colors duration-150 ease-out active:scale-[0.98]", value === opt.id ? "bg-surface text-fg shadow-[0_0_0_1px_rgba(243,239,230,0.08)]" : "text-muted hover:text-fg"),
			children: opt.label
		}, opt.id))
	});
}
function Field({ label, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-xs tabular-nums text-subtle",
				children: value
			}) : null]
		}), children]
	});
}
function AtmosphereSliders() {
	const scale = useStudio((s) => s.scale);
	const setScale = useStudio((s) => s.setScale);
	const offsetX = useStudio((s) => s.offsetX);
	const setOffsetX = useStudio((s) => s.setOffsetX);
	const offsetY = useStudio((s) => s.offsetY);
	const setOffsetY = useStudio((s) => s.setOffsetY);
	const glow = useStudio((s) => s.glow);
	const setGlow = useStudio((s) => s.setGlow);
	const vignette = useStudio((s) => s.vignette);
	const setVignette = useStudio((s) => s.setVignette);
	const grain = useStudio((s) => s.grain);
	const setGrain = useStudio((s) => s.setGrain);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "人物大小",
			value: scale.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: .78,
				max: 1.18,
				step: .01,
				value: [scale],
				onValueChange: ([v]) => setScale(v ?? 1),
				"aria-label": "人物大小"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "左右",
			value: offsetX.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: -.08,
				max: .08,
				step: .005,
				value: [offsetX],
				onValueChange: ([v]) => setOffsetX(v ?? 0),
				"aria-label": "左右位置"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "上下",
			value: offsetY.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: -.08,
				max: .1,
				step: .005,
				value: [offsetY],
				onValueChange: ([v]) => setOffsetY(v ?? 0),
				"aria-label": "上下位置"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "轮廓光",
			value: glow.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 0,
				max: 1,
				step: .01,
				value: [glow],
				onValueChange: ([v]) => setGlow(v ?? 0),
				"aria-label": "轮廓光"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "暗角",
			value: vignette.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 0,
				max: 1,
				step: .01,
				value: [vignette],
				onValueChange: ([v]) => setVignette(v ?? 0),
				"aria-label": "暗角"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "颗粒",
			value: grain.toFixed(2),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 0,
				max: 1,
				step: .01,
				value: [grain],
				onValueChange: ([v]) => setGrain(v ?? 0),
				"aria-label": "颗粒"
			})
		})
	] });
}
function StudioPanel() {
	const themeId = useStudio((s) => s.themeId);
	const setTheme = useStudio((s) => s.setTheme);
	const clockStyle = useStudio((s) => s.clockStyle);
	const setClock = useStudio((s) => s.setClock);
	const quoteId = useStudio((s) => s.quoteId);
	const setQuote = useStudio((s) => s.setQuote);
	const sizeId = useStudio((s) => s.sizeId);
	const setSize = useStudio((s) => s.setSize);
	const showButtons = useStudio((s) => s.showButtons);
	const setShowButtons = useStudio((s) => s.setShowButtons);
	const reset = useStudio((s) => s.reset);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const size = SIZES.find((item) => item.id === sizeId) ?? SIZES[1];
	async function download(withLock) {
		setBusy(true);
		try {
			const state = useStudio.getState();
			const blob = await exportWallpaper({
				themeId: state.themeId,
				scale: state.scale,
				offsetX: state.offsetX,
				offsetY: state.offsetY,
				glow: state.glow,
				vignette: state.vignette,
				grain: state.grain,
				quoteId: state.quoteId,
				clockStyle: withLock ? state.clockStyle : "none",
				showButtons: withLock && state.showButtons,
				now: /* @__PURE__ */ new Date()
			}, size.w, size.h, withLock);
			const theme = THEMES.find((item) => item.id === state.themeId);
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = `moyuan-${theme?.id ?? "ink"}-${size.w}x${size.h}${withLock ? "-lock" : ""}.jpg`;
			a.click();
			URL.revokeObjectURL(a.href);
			toast.success(withLock ? "锁屏预览已保存" : "壁纸已保存，去相册设为屏保");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "导出失败");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 w-full flex-1 flex-col border-t border-line bg-surface md:h-full md:border-t-0 md:border-l",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif-sc text-lg text-fg",
					children: "氛围"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "七种夜色，同一位墨渊。点选后可微调站位与光。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "theme-rail mt-4",
					children: THEMES.map((theme) => {
						const active = theme.id === themeId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTheme(theme.id),
							className: cn("theme-chip group relative overflow-hidden rounded-md transition-transform duration-150 ease-out active:scale-[0.98]", active ? "theme-thumb-active" : "theme-thumb"),
							"aria-pressed": active,
							"aria-label": theme.name,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: theme.thumb,
									alt: "",
									className: "absolute inset-0 size-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/character.webp",
									alt: "",
									className: "absolute bottom-0 left-1/2 h-4/5 -translate-x-1/2 object-contain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "theme-thumb-label",
									children: theme.name
								})
							]
						}, theme.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-serif-sc text-sm tracking-wide text-muted",
					children: THEMES.find((item) => item.id === themeId)?.caption
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "锁定画面",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segment, {
								value: clockStyle,
								options: CLOCKS,
								onChange: setClock
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "题字",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: QUOTES.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuote(q.id),
									className: cn("h-9 rounded-md px-3 font-serif-sc text-sm transition-colors duration-150 ease-out", quoteId === q.id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted hover:text-fg"),
									children: q.text
								}, q.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden flex-col gap-6 md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtmosphereSliders, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "group rounded-lg bg-surface-2 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "flex h-11 cursor-pointer list-none items-center justify-between px-3 text-sm text-fg",
								children: ["站位与光影", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted transition-transform duration-150 group-open:rotate-180" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-5 px-3 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtmosphereSliders, {})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "导出尺寸",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segment, {
								value: sizeId,
								options: SIZES,
								onChange: setSize
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-subtle tabular-nums",
								children: [
									size.w,
									" × ",
									size.h
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 cursor-pointer items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium tracking-wide text-muted",
								children: "预览手电筒与相机"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "switch",
								"aria-checked": showButtons,
								onClick: () => setShowButtons(!showButtons),
								className: cn("relative h-6 w-10 rounded-full transition-colors duration-150 ease-out", showButtons ? "bg-accent" : "bg-line"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-bg transition-transform duration-150 ease-out", showButtons && "translate-x-4") })
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 flex-col gap-2 border-t border-line bg-surface px-5 py-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "w-full",
					disabled: busy,
					onClick: () => void download(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), busy ? "导出中…" : "下载壁纸"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1",
						disabled: busy,
						onClick: () => void download(true),
						children: "带锁屏画面"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: reset,
						"aria-label": "重置",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs leading-relaxed text-subtle",
					children: "保存到相册后，在系统设置里设为屏保或壁纸。"
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-8 place-items-center rounded-sm bg-accent font-serif-sc text-sm text-accent-fg",
					"aria-hidden": true,
					children: "渊"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "brand-title",
						children: "墨渊"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "brand-kicker",
						children: "Lock studio"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden max-w-xs text-right text-xs leading-relaxed text-subtle md:block",
				children: "用这张立绘，做成你的手机屏保。"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhonePreview, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 md:h-full md:w-[380px] md:flex-none lg:w-[420px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioPanel, {})
			})]
		})]
	});
}
//#endregion
export { Home as component };
