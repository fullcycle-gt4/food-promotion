import Logo from '../components/Logo.jsx';
import { Divider, Eyebrow } from '../components/ui.jsx';

export default function AuthCard({ headline, text, eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-backdrop bg-cover p-4">
      <div className="flex w-full max-w-[800px] flex-col shadow-panel md:min-h-[580px] md:flex-row">
        <aside className="flex flex-col justify-between gap-10 bg-brand px-8 py-9 md:w-[300px] md:shrink-0">
          <Logo />
          <div>
            <p className="text-2xl font-semibold leading-tight text-white text-pretty">{headline}</p>
            <p className="mt-3 text-xs leading-relaxed text-sub">{text}</p>
          </div>
        </aside>
        <main className="flex flex-1 flex-col bg-surface px-8 py-10 md:px-11">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-2 text-[28px] font-semibold text-brand">{title}</h1>
          <p className="mt-1.5 text-xs text-muted">{subtitle}</p>
          <Divider className="my-[22px]" />
          {children}
          {footer && <div className="mt-auto pt-6 text-xs text-muted">{footer}</div>}
        </main>
      </div>
    </div>
  );
}
