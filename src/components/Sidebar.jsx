import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { cx } from './ui.jsx';

export default function Sidebar({ items }) {
  return (
    <aside className="flex flex-col gap-6 bg-brand px-4 py-6 md:w-[220px] md:shrink-0 md:gap-9 md:py-7">
      <div className="pl-2">
        <Logo />
      </div>
      <nav className="flex gap-1 overflow-x-auto text-[13px] md:flex-col">
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
            <span className="h-[7px] w-[7px] rounded-sm bg-accent" />
            {it.label}
            {it.badge ? (
              <span className="ml-auto rounded-full bg-accent px-[7px] py-px text-[11px] font-bold text-brand">{it.badge}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
