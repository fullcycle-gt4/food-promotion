import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthCard from '../../layouts/AuthCard.jsx';
import { Button, Checkbox, Input } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import { homeFor } from '../../components/RequireAuth.jsx';

const SHOW_DEMO = import.meta.env.VITE_USE_MOCKS !== 'false';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '', keep: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(form.email, form.password, form.keep);
      navigate(homeFor(u), { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthCard
      headline="Bem-vindo de volta."
      text="Entre para ver as ofertas do dia e acompanhar seus pedidos."
      eyebrow="Acesso"
      title="Entrar"
      subtitle="Use o e-mail e a senha cadastrados."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-semibold">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="maria@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          extra={
            <button type="button" onClick={() => toast('Recuperação de senha em breve.')} className="text-[11px] font-semibold text-brand hover:text-brand-600">
              Esqueci minha senha
            </button>
          }
        />
        <Checkbox checked={form.keep} onChange={(e) => setForm({ ...form, keep: e.target.checked })}>
          Manter conectado
        </Checkbox>
        {error && <p className="text-[11px] text-danger">{error}</p>}
        <Button type="submit" size="lg" className="mt-1.5" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
        {SHOW_DEMO && (
          <p className="text-[10px] leading-relaxed text-muted">
            Demonstração · cliente: maria@email.com / cliente123 · admin: admin@foodpromotion.com / admin123
          </p>
        )}
      </form>
    </AuthCard>
  );
}
