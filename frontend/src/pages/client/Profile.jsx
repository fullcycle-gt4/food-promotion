import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import { Badge, Button, Divider, Input, PageHeader, SectionTitle } from '../../components/ui.jsx';
import { isEmail, maskPhone } from '../../utils/masks';

export default function ClientProfile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({ name: user.name, email: user.email, phone: user.phone || '', city: user.city || '' });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const saveData = async () => {
    const e = {};
    if (!data.name.trim()) e.name = 'Informe seu nome.';
    if (!isEmail(data.email)) e.email = 'E-mail inválido.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const u = await userService.updateProfile(user.id, data);
    setUser({ ...user, ...u });
    setSaving(false);
    toast('Dados atualizados');
  };

  const savePassword = async () => {
    const e = {};
    if (pwd.next.length < 8) e.next = 'Mínimo de 8 caracteres.';
    if (pwd.confirm !== pwd.next) e.confirm = 'As senhas não conferem.';
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await userService.changePassword(user.id, pwd.current, pwd.next);
      setPwd({ current: '', next: '', confirm: '' });
      toast('Senha atualizada');
    } catch (err) {
      setErrors({ current: err.message });
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Excluir sua conta? Esta ação não pode ser desfeita.')) return;
    await userService.remove(user.id);
    logout();
    navigate('/login', { replace: true });
  };

  const exit = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow="Minha conta"
        title="Meu perfil"
        subtitle="Gerencie seus dados pessoais e de acesso."
        action={
          <button type="button" onClick={exit} className="flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-600">
            Sair da conta <span aria-hidden>—</span>
          </button>
        }
      />

      <SectionTitle title="Dados pessoais" subtitle="Usados para identificar você na retirada." action={<Badge>Cliente</Badge>} />
      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
        <Input label="Nome completo" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} />
        <Input label="E-mail" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} error={errors.email} />
        <Input label="Telefone" value={data.phone} onChange={(e) => setData({ ...data, phone: maskPhone(e.target.value) })} />
        <Input label="CPF" value={user.cpf || ''} disabled />
        <Input label="Cidade" value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={saveData} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </div>

      <Divider className="my-[26px]" />

      <SectionTitle title="Alterar senha" subtitle="Mínimo de 8 caracteres." />
      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3">
        <Input label="Senha atual" type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} error={errors.current} />
        <Input label="Nova senha" type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} error={errors.next} />
        <Input label="Confirmar nova senha" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} error={errors.confirm} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="brandOutline" onClick={savePassword}>
          Atualizar senha
        </Button>
      </div>

      <Divider className="my-[26px]" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-brand">Excluir conta</h2>
          <p className="mt-1 text-[11px] text-muted">Remove seus dados e o histórico de pedidos.</p>
        </div>
        <Button variant="danger" onClick={deleteAccount}>
          Excluir conta
        </Button>
      </div>
    </>
  );
}
