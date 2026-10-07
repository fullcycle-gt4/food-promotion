import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import { Badge, Button, Input, PageHeader, SectionTitle } from '../../components/ui.jsx';
import { isEmail, maskPhone } from '../../utils/masks';

export default function AdminProfile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({ name: user.name, email: user.email, phone: user.phone || '', password: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const e = {};
    if (!data.name.trim()) e.name = 'Informe o nome.';
    if (!isEmail(data.email)) e.email = 'E-mail inválido.';
    if (data.password && data.password.length < 8) e.password = 'Mínimo de 8 caracteres.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const { password, ...rest } = data;
    const u = await userService.updateProfile(user.id, password ? data : rest);
    setUser({ ...user, ...u });
    setData((d) => ({ ...d, password: '' }));
    setSaving(false);
    toast('Dados atualizados');
  };

  const exit = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title="Perfil do administrador"
        subtitle="Gerencie seus dados e os administradores do sistema."
        action={
          <button type="button" onClick={exit} className="flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-600">
            Sair da conta <span aria-hidden>—</span>
          </button>
        }
      />

      <SectionTitle title="Dados do administrador" subtitle="Informações de acesso à conta." action={<Badge>Administrador</Badge>} />
      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
        <Input label="Nome" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} error={errors.name} />
        <Input label="E-mail" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} error={errors.email} />
        <Input label="Telefone" value={data.phone} onChange={(e) => setData({ ...data, phone: maskPhone(e.target.value) })} />
        <Input
          label="Nova senha"
          type="password"
          placeholder="Deixe em branco para manter"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          error={errors.password}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </div>
    </>
  );
}
