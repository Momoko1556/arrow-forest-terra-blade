import { useEffect, useState, type CSSProperties } from "react";
import { Battery, Camera, Flashlight, Signal, Wifi } from "lucide-react";
import { useStudio } from "@/lib/store";
import { CHARACTER_SRC, QUOTES, THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

function useNow(active: boolean) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!active) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const WEEK = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export function PhonePreview() {
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

  useEffect(() => {
    for (const item of THEMES) {
      const img = new Image();
      img.src = item.plate;
    }
  }, []);

  const time = now ? `${now.getHours()}:${pad(now.getMinutes())}` : "9:41";
  const date = now
    ? `${now.getMonth() + 1}月${now.getDate()}日 ${WEEK[now.getDay()]}`
    : "";

  return (
    <div className="studio-stage relative flex shrink-0 items-center justify-center px-4 py-4 md:min-h-0 md:flex-1 md:py-8">
      <div
        className="phone-shell is-ready relative"
        style={
          {
            "--scale": scale,
            "--ox": offsetX,
            "--oy": offsetY,
            "--glow": glow,
            "--vignette": vignette,
            "--grain": grain,
            "--glow-color": theme.glow,
          } as CSSProperties
        }
      >
        <div className="phone-bezel">
          <div className="phone-screen">
            <img
              src={theme.plate}
              alt=""
              className="wallpaper-plate"
            />
            <div className="wallpaper-glow" />
            <img
              src={CHARACTER_SRC}
              alt={theme.name}
              className="wallpaper-char"
            />
            <div className="wallpaper-vignette" />
            <div className="wallpaper-grain" />

            <div className="lock-layer">
              <div className="dynamic-island" />

              {clockStyle !== "none" && (
                <div className="status-icons">
                  <Signal className="size-3" strokeWidth={2.2} />
                  <Wifi className="size-3" strokeWidth={2.2} />
                  <Battery className="size-3.5" strokeWidth={2.2} />
                </div>
              )}

              {clockStyle === "classic" && (
                <div className="lock-clock lock-clock-classic">
                  <div className="lock-time tabular-nums">{time}</div>
                  <div className="lock-date">{date}</div>
                </div>
              )}

              {clockStyle === "editorial" && (
                <div className="lock-clock lock-clock-editorial">
                  <div className="lock-time tabular-nums">{time}</div>
                  <div className="lock-date">{date}</div>
                </div>
              )}

              {quote && quote.id !== "none" && (
                <div
                  className={cn(
                    "lock-quote",
                    clockStyle === "none" && "lock-quote-solo",
                  )}
                >
                  <p>{quote.text}</p>
                  {quote.sub ? <p className="lock-quote-sub">{quote.sub}</p> : null}
                </div>
              )}

              {showButtons && clockStyle !== "none" && (
                <>
                  <div className="lock-btn lock-btn-left" aria-hidden>
                    <Flashlight className="size-5" strokeWidth={1.6} />
                  </div>
                  <div className="lock-btn lock-btn-right" aria-hidden>
                    <Camera className="size-5" strokeWidth={1.6} />
                  </div>
                  <div className="home-bar" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
