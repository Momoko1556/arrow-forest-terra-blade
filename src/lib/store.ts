import { create } from "zustand";
import type { ClockStyle, QuoteId, SizeId, ThemeId } from "./themes";

export interface StudioState {
  themeId: ThemeId;
  clockStyle: ClockStyle;
  quoteId: QuoteId;
  scale: number;
  offsetX: number;
  offsetY: number;
  glow: number;
  vignette: number;
  grain: number;
  sizeId: SizeId;
  showButtons: boolean;
  setTheme: (id: ThemeId) => void;
  setClock: (id: ClockStyle) => void;
  setQuote: (id: QuoteId) => void;
  setScale: (n: number) => void;
  setOffsetX: (n: number) => void;
  setOffsetY: (n: number) => void;
  setGlow: (n: number) => void;
  setVignette: (n: number) => void;
  setGrain: (n: number) => void;
  setSize: (id: SizeId) => void;
  setShowButtons: (v: boolean) => void;
  reset: () => void;
}

const defaults = {
  themeId: "ink" as ThemeId,
  clockStyle: "classic" as ClockStyle,
  quoteId: "name" as QuoteId,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  glow: 0.82,
  vignette: 0.62,
  grain: 0.35,
  sizeId: "promax" as SizeId,
  showButtons: true,
};

export const useStudio = create<StudioState>((set) => ({
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
  reset: () => set(defaults),
}));
