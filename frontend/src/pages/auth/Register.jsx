import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../layouts/AuthCard.jsx';
import { Button, Checkbox, Input } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isEmail, maskCPF, maskPhone, onlyDigits } from '../../utils/masks';

const empty = { name: '', email: '', phone: '', cpf: '', city: '', password: '', confirm: '', terms: false };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, fn = (v) => v) => (e) => setForm({ ...form, [k]: fn(e.target.value) });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Informe seu nome.';
    if (!isEmail(form.email)) e.email = 'E-mail inválido.';
    if (onlyDigits(form.phone).length < 10) e.phone = 'Telefone inválido.';
    if (onlyDigits(form.cpf).length !== 11) e.cpf = 'CPF inválido.';
    if (form.password.length < 8) e.password = 'Mínimo de 8 caracteres.';
    if (form.confirm !== form.password) e.confirm = 'As senhas não conferem.';
    if (!form.terms) e.terms = 'Aceite os termos para continuar.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirm, terms, ...data } = form;
      await register(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthCard
      headline="Produtos bons, perto do vencimento, por menos."
      text="Crie sua conta para reservar ofertas e retirar na loja."
      eyebrow="Novo cliente"
      title="Criar conta"
      subtitle="Preencha seus dados de acesso."
    >
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Input className="sm:col-span-2" label="Nome completo" placeholder="Maria Souza" value={form.name} onChange={set('name')} error={errors.name} />
          <Input label="E-mail" type="email" placeholder="maria@email.com" value={form.email} onChange={set('email')} error={errors.email} />
          <Input label="Telefone" placeholder="(85) 98888-7777" value={form.phone} onChange={set('phone', maskPhone)} error={errors.phone} />
          <Input label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf', maskCPF)} error={errors.cpf} />
          <Input label="Cidade" placeholder="Fortaleza, CE" value={form.city} onChange={set('city')} />
          <Input label="Senha" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set('password')} error={errors.password} />
          <Input label="Confirmar senha" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        </div>
        <div className="mt-[18px]">
          <Checkbox checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })}>
            Aceito os termos de uso e a política de privacidade
          </Checkbox>
          {errors.terms && <p className="mt-1 text-[11px] text-danger">{errors.terms}</p>}
        </div>
        {error && <p className="mt-3 text-[11px] text-danger">{error}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="text-xs text-muted">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold">
              Entrar
            </Link>
          </span>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Criando…' : 'Criar conta'}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
