import { useState, type ReactNode } from "react";
import { ChevronDown, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { exportWallpaper } from "@/lib/draw-wallpaper";
import { useStudio } from "@/lib/store";
import { CLOCKS, QUOTES, SIZES, THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-surface-2 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "h-9 min-w-0 flex-1 rounded-md px-2 font-sans text-sm font-medium transition-colors duration-150 ease-out active:scale-[0.98]",
            value === opt.id
              ? "bg-surface text-fg shadow-[0_0_0_1px_rgba(243,239,230,0.08)]"
              : "text-muted hover:text-fg",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium tracking-wide text-muted">{label}</span>
        {value ? (
          <span className="font-sans text-xs tabular-nums text-subtle">{value}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
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

  return (
    <>
      <Field label="人物大小" value={scale.toFixed(2)}>
        <Slider
          min={0.78}
          max={1.18}
          step={0.01}
          value={[scale]}
          onValueChange={([v]) => setScale(v ?? 1)}
          aria-label="人物大小"
        />
      </Field>
      <Field label="左右" value={offsetX.toFixed(2)}>
        <Slider
          min={-0.08}
          max={0.08}
          step={0.005}
          value={[offsetX]}
          onValueChange={([v]) => setOffsetX(v ?? 0)}
          aria-label="左右位置"
        />
      </Field>
      <Field label="上下" value={offsetY.toFixed(2)}>
        <Slider
          min={-0.08}
          max={0.1}
          step={0.005}
          value={[offsetY]}
          onValueChange={([v]) => setOffsetY(v ?? 0)}
          aria-label="上下位置"
        />
      </Field>
      <Field label="轮廓光" value={glow.toFixed(2)}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[glow]}
          onValueChange={([v]) => setGlow(v ?? 0)}
          aria-label="轮廓光"
        />
      </Field>
      <Field label="暗角" value={vignette.toFixed(2)}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[vignette]}
          onValueChange={([v]) => setVignette(v ?? 0)}
          aria-label="暗角"
        />
      </Field>
      <Field label="颗粒" value={grain.toFixed(2)}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[grain]}
          onValueChange={([v]) => setGrain(v ?? 0)}
          aria-label="颗粒"
        />
      </Field>
    </>
  );
}

export function StudioPanel() {
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
  const [busy, setBusy] = useState(false);

  const size = SIZES.find((item) => item.id === sizeId) ?? SIZES[1];

  async function download(withLock: boolean) {
    setBusy(true);
    try {
      const state = useStudio.getState();
      const blob = await exportWallpaper(
        {
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
          now: new Date(),
        },
        size.w,
        size.h,
        withLock,
      );
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

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col border-t border-line bg-surface md:h-full md:border-t-0 md:border-l">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
        <p className="font-serif-sc text-lg text-fg">氛围</p>
        <p className="mt-1 text-sm text-muted">
          七种夜色，同一位墨渊。点选后可微调站位与光。
        </p>

        <div className="theme-rail mt-4">
          {THEMES.map((theme) => {
            const active = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "theme-chip group relative overflow-hidden rounded-md transition-transform duration-150 ease-out active:scale-[0.98]",
                  active ? "theme-thumb-active" : "theme-thumb",
                )}
                aria-pressed={active}
                aria-label={theme.name}
              >
                <img
                  src={theme.thumb}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <img
                  src="/character.webp"
                  alt=""
                  className="absolute bottom-0 left-1/2 h-4/5 -translate-x-1/2 object-contain"
                />
                <span className="theme-thumb-label">{theme.name}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 font-serif-sc text-sm tracking-wide text-muted">
          {THEMES.find((item) => item.id === themeId)?.caption}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          <Field label="锁定画面">
            <Segment value={clockStyle} options={CLOCKS} onChange={setClock} />
          </Field>

          <Field label="题字">
            <div className="flex flex-wrap gap-1.5">
              {QUOTES.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuote(q.id)}
                  className={cn(
                    "h-9 rounded-md px-3 font-serif-sc text-sm transition-colors duration-150 ease-out",
                    quoteId === q.id
                      ? "bg-accent text-accent-fg"
                      : "bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {q.text}
                </button>
              ))}
            </div>
          </Field>

          <div className="hidden flex-col gap-6 md:flex">
            <AtmosphereSliders />
          </div>

          <details className="group rounded-lg bg-surface-2 md:hidden">
            <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-3 text-sm text-fg">
              站位与光影
              <ChevronDown className="size-4 text-muted transition-transform duration-150 group-open:rotate-180" />
            </summary>
            <div className="flex flex-col gap-5 px-3 pb-4">
              <AtmosphereSliders />
            </div>
          </details>

          <Field label="导出尺寸">
            <Segment value={sizeId} options={SIZES} onChange={setSize} />
            <p className="text-xs text-subtle tabular-nums">
              {size.w} × {size.h}
            </p>
          </Field>

          <label className="flex h-11 cursor-pointer items-center justify-between gap-3">
            <span className="text-xs font-medium tracking-wide text-muted">
              预览手电筒与相机
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showButtons}
              onClick={() => setShowButtons(!showButtons)}
              className={cn(
                "relative h-6 w-10 rounded-full transition-colors duration-150 ease-out",
                showButtons ? "bg-accent" : "bg-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-bg transition-transform duration-150 ease-out",
                  showButtons && "translate-x-4",
                )}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-line bg-surface px-5 py-4 md:px-6">
        <Button
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={() => void download(false)}
        >
          <Download className="size-4" />
          {busy ? "导出中…" : "下载壁纸"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => void download(true)}
          >
            带锁屏画面
          </Button>
          <Button variant="ghost" size="icon" onClick={reset} aria-label="重置">
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <p className="text-center text-xs leading-relaxed text-subtle">
          保存到相册后，在系统设置里设为屏保或壁纸。
        </p>
      </div>
    </aside>
  );
}
