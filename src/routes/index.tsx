import { createFileRoute } from "@tanstack/react-router";
import { PhonePreview } from "@/components/phone-preview";
import { StudioPanel } from "@/components/studio-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <span
            className="grid size-8 place-items-center rounded-sm bg-accent font-serif-sc text-sm text-accent-fg"
            aria-hidden
          >
            渊
          </span>
          <div className="leading-tight">
            <h1 className="brand-title">墨渊</h1>
            <p className="brand-kicker">Lock studio</p>
          </div>
        </div>
        <p className="hidden max-w-xs text-right text-xs leading-relaxed text-subtle md:block">
          用这张立绘，做成你的手机屏保。
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <PhonePreview />
        <div className="flex min-h-0 flex-1 md:h-full md:w-[380px] md:flex-none lg:w-[420px]">
          <StudioPanel />
        </div>
      </div>
    </main>
  );
}
