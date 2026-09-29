import { useId } from 'react';
import { Link } from 'react-router-dom';
import { money } from '../utils/format';
import { daysUntil } from '../utils/date';
import { statusLabel, statusTone } from '../utils/labels';

export const cx = (...c) => c.filter(Boolean).join(' ');

/* ---------- Botões ---------- */
const btnVariants = {
  primary: 'bg-brand text-white hover:bg-brand-600',
  outline: 'border border-field bg-white text-ink hover:bg-surface',
  brandOutline: 'border border-brand bg-white text-brand hover:bg-surface',
  danger: 'border border-danger-line bg-white text-danger hover:bg-danger-soft',
};
const btnSizes = {
  sm: 'h-7 px-2.5 text-[11px]',
  md: 'h-[38px] px-[18px] text-xs font-semibold',
  lg: 'h-10 px-[22px] text-xs font-semibold',
};
export const buttonClass = (variant = 'primary', size = 'md', className) =>
  cx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    btnVariants[variant],
    btnSizes[size],
    variant === 'primary' && size === 'sm' && 'font-semibold',
    className,
  );

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function LinkButton({ variant, size, className, ...props }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-brand hover:text-brand-600">
      {children} <span aria-hidden>—</span>
    </Link>
  );
}

/* ---------- Formulário ---------- */
const control =
  'w-full rounded border border-field bg-white px-3 text-xs text-ink outline-none transition-colors placeholder:text-faint focus:border-brand disabled:border-line disabled:bg-zebra disabled:text-muted';

export function Field({ id, label, extra, error, hint, className, children }) {
  return (
    <div className={className}>
      {(label || extra) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor={id} className="text-[11px] font-semibold">
            {label}
          </label>
          {extra}
        </div>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-[11px] text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ label, extra, error, hint, className, inputClassName, suffix, ...props }) {
  const id = useId();
  const input = suffix ? (
    <div className={cx('flex h-[38px] items-center rounded border bg-white focus-within:border-brand', error ? 'border-danger' : 'border-field')}>
      <input id={id} className={cx('h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-faint', inputClassName)} {...props} />
      <span className="px-3 text-xs text-muted">{suffix}</span>
    </div>
  ) : (
    <input id={id} className={cx(control, 'h-[38px]', error && 'border-danger', inputClassName)} {...props} />
  );
  return (
    <Field id={id} label={label} extra={extra} error={error} hint={hint} className={className}>
      {input}
    </Field>
  );
}

export function Select({ label, error, className, children, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} className={className}>
      <select id={id} className={cx(control, 'h-[38px] px-2.5', error && 'border-danger')} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Textarea({ label, error, className, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} className={className}>
      <textarea id={id} className={cx(control, 'h-[70px] resize-none py-2.5')} {...props} />
    </Field>
  );
}

export function Checkbox({ children, ...props }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11px] text-body">
      <input type="checkbox" className="accent-brand" {...props} />
      {children}
    </label>
  );
}

export function QtyStepper({ value, onChange, min = 1, max = Infinity, size = 'md' }) {
  const sm = size === 'sm';
  const btn = cx('h-full text-brand disabled:cursor-not-allowed disabled:text-faint', sm ? 'w-7' : 'w-[38px] text-base');
  return (
    <div className={cx('flex items-center rounded border border-field bg-white', sm ? 'h-[30px] w-[84px]' : 'h-10')}>
      <button type="button" aria-label="Diminuir" className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <span className={cx('text-center font-semibold', sm ? 'flex-1 text-xs' : 'w-[34px] text-[13px]')}>{value}</span>
      <button type="button" aria-label="Aumentar" className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}

export function Chip({ active, className, ...props }) {
  return (
    <button
      type="button"
      className={cx(
        'h-[30px] whitespace-nowrap rounded border px-3.5 text-xs transition-colors',
        active ? 'border-brand bg-brand font-semibold text-white' : 'border-field bg-white text-ink hover:border-brand',
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Estrutura ---------- */
export const Divider = ({ className }) => <div className={cx('h-px bg-line', className)} />;

export const Eyebrow = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-muted">{children}</p>
);

export const Label = ({ children }) => (
  <p className="text-[9px] font-semibold uppercase tracking-[.08em] text-muted">{children}</p>
);

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <header>
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[30px] font-semibold leading-tight text-brand text-pretty">{title}</h1>
          {subtitle && <p className="mt-1.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      <Divider className="my-6" />
    </header>
  );
}

export function SectionTitle({ title, subtitle, action, className }) {
  return (
    <div className={cx('flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="text-[17px] font-semibold text-brand">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Table({ cols, head, children, footer, minWidth = 640 }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-white text-xs">
      <div style={{ minWidth }}>
        <div
          className="grid border-b border-line px-4 py-3 text-[9px] font-semibold uppercase tracking-[.08em] text-muted"
          style={{ gridTemplateColumns: cols }}
        >
          {head.map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

export function Tr({ cols, children, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={cx(
        'grid items-center gap-2 border-b border-zebra px-4 py-3.5 last:border-b-0',
        onClick && 'cursor-pointer hover:bg-[#f8f9f6]',
        active && 'bg-[#f8f9f6]',
      )}
      style={{ gridTemplateColumns: cols }}
    >
      {children}
    </div>
  );
}

export function Card({ className, children }) {
  return <div className={cx('rounded-md border border-line bg-white', className)}>{children}</div>;
}

export const Loading = () => <p className="py-10 text-center text-xs text-muted">Carregando…</p>;

export function EmptyState({ children, className }) {
  return (
    <div className={cx('rounded-md border border-dashed border-field bg-white px-6 py-10 text-center text-xs text-muted', className)}>
      {children}
    </div>
  );
}

/* ---------- Dados ---------- */
const tones = {
  green: 'bg-soft text-soft-ink',
  orange: 'bg-warn text-warn-ink',
  red: 'bg-danger-soft text-danger',
  yellow: 'bg-accent text-brand font-bold',
};

export function Badge({ tone = 'green', className, children }) {
  return (
    <span className={cx('inline-block whitespace-nowrap rounded-[3px] px-2 py-1 text-[10px] font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}

export function ExpiryBadge({ date }) {
  if (!date) return null;
  const d = daysUntil(date);
  if (d < 0) return <Badge tone="red">Vencido</Badge>;
  const text = d === 0 ? 'Vence hoje' : d === 1 ? 'Vence amanhã' : `Vence em ${d} dias`;
  return <Badge tone={d <= 3 ? 'orange' : 'green'}>{text}</Badge>;
}

export const StatusBadge = ({ status }) => <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;

export function Price({ promo, original, size = 'md' }) {
  const lg = size === 'lg';
  return (
    <div className="flex items-baseline gap-2">
      <span className={cx('font-semibold text-brand', lg ? 'text-[34px]' : 'text-[17px]')}>{money(promo)}</span>
      {original > promo && <span className={cx('text-faint line-through', lg ? 'text-sm' : 'text-[11px]')}>{money(original)}</span>}
    </div>
  );
}

export function ImagePlaceholder({ src, label, className }) {
  if (src) return <img src={src} alt="" className={cx('block w-full object-cover', className)} />;
  return (
    <div className={cx('flex w-full items-center justify-center bg-placeholder font-mono text-[10px] text-faint', className)}>
      {label}
    </div>
  );
}
