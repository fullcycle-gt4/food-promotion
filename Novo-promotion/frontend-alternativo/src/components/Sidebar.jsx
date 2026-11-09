import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { cx } from './ui.jsx';

export default function Sidebar({ items, onLogout }) {
  return (
    <aside className="flex flex-col gap-6 bg-brand px-4 py-6 md:sticky md:top-6 md:h-[calc(100vh-24px)] md:w-[220px] md:shrink-0 md:gap-9 md:py-7">
      <div className="pl-2">
        <Logo />
      </div>
      <nav className="flex gap-1 overflow-x-auto text-[13px] md:flex-1 md:flex-col">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              cx(
                'flex shrink-0 items-center gap-3 rounded-[5px] px-3 py-2.5 transition-colors',
                isActive ? 'bg-brand-600 font-semibold text-white' : 'text-sub hover:text-white',
              )
            }
          >
            {it.icon === 'products' ? (
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7M12 11v10" />
              </svg>
            ) : (
              <span className="h-[7px] w-[7px] rounded-sm bg-accent" />
            )}
            {it.label}
            {it.badge ? (
              <span className="ml-auto rounded-full bg-accent px-[7px] py-px text-[11px] font-bold text-brand">{it.badge}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-3 rounded-[5px] px-3 py-2.5 text-left text-sub transition-colors hover:bg-brand-600 hover:text-white"
        >
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5m5 5H3" />
          </svg>
          Sair
        </button>
      )}
    </aside>
  );
}
