export type ThemeId =
  | "ink"
  | "rain"
  | "compass"
  | "hall"
  | "star"
  | "study"
  | "void";

export type ClockStyle = "classic" | "editorial" | "none";

export type QuoteId = "none" | "name" | "night" | "ink" | "still" | "unnamed";

export type SizeId = "iphone" | "promax" | "android" | "tall";

export interface Theme {
  id: ThemeId;
  name: string;
  nameEn: string;
  caption: string;
  plate: string;
  thumb: string;
  glow: string;
}

export const THEMES: Theme[] = [
  {
    id: "ink",
    name: "墨渊",
    nameEn: "Ink",
    caption: "墨色沉底，人立其中",
    plate: "/themes/ink.jpg",
    thumb: "/themes/ink-thumb.jpg",
    glow: "rgba(210, 200, 180, 0.28)",
  },
  {
    id: "rain",
    name: "夜雨",
    nameEn: "Rain",
    caption: "雨落无声，灯火远处",
    plate: "/themes/rain.jpg",
    thumb: "/themes/rain-thumb.jpg",
    glow: "rgba(160, 190, 220, 0.30)",
  },
  {
    id: "compass",
    name: "罗盘",
    nameEn: "Compass",
    caption: "星轨为针，夜色为盘",
    plate: "/themes/compass.jpg",
    thumb: "/themes/compass-thumb.jpg",
    glow: "rgba(198, 168, 110, 0.32)",
  },
  {
    id: "hall",
    name: "金厅",
    nameEn: "Hall",
    caption: "廊柱无言，金线微光",
    plate: "/themes/hall.jpg",
    thumb: "/themes/hall-thumb.jpg",
    glow: "rgba(210, 170, 100, 0.34)",
  },
  {
    id: "star",
    name: "星渊",
    nameEn: "Stars",
    caption: "星子疏落，深空无岸",
    plate: "/themes/star.jpg",
    thumb: "/themes/star-thumb.jpg",
    glow: "rgba(180, 190, 220, 0.30)",
  },
  {
    id: "study",
    name: "书灯",
    nameEn: "Lamp",
    caption: "一灯如豆，夜读未央",
    plate: "/themes/study.jpg",
    thumb: "/themes/study-thumb.jpg",
    glow: "rgba(232, 170, 90, 0.36)",
  },
  {
    id: "void",
    name: "无光",
    nameEn: "Void",
    caption: "只留轮廓，其余皆寂",
    plate: "/themes/void.jpg",
    thumb: "/themes/void-thumb.jpg",
    glow: "rgba(220, 214, 200, 0.22)",
  },
];

export const QUOTES: { id: QuoteId; text: string; sub?: string }[] = [
  { id: "none", text: "无" },
  { id: "name", text: "墨渊", sub: "MO YUNN" },
  { id: "night", text: "夜色正好" },
  { id: "ink", text: "深沉如墨" },
  { id: "still", text: "Stay still." },
  { id: "unnamed", text: "未命名的深渊" },
];

export const SIZES: { id: SizeId; label: string; w: number; h: number }[] = [
  { id: "iphone", label: "iPhone", w: 1170, h: 2532 },
  { id: "promax", label: "Pro Max", w: 1290, h: 2796 },
  { id: "android", label: "Android", w: 1080, h: 2400 },
  { id: "tall", label: "2K", w: 1440, h: 3120 },
];

export const CLOCKS: { id: ClockStyle; label: string }[] = [
  { id: "classic", label: "经典" },
  { id: "editorial", label: "衬线" },
  { id: "none", label: "纯壁纸" },
];

export const CHARACTER_SRC = "/character.webp";
