import { useState } from 'react';
import { userService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import {
  Badge, Button, EmptyState, Input, Loading, PageHeader, Select, Table, Tr,
} from '../../components/ui.jsx';
import { isEmail, maskPhone } from '../../utils/masks';

const COLS = '1.2fr 1.5fr 1fr 1fr';
const EMPTY = { name: '', email: '', phone: '', password: '' };

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const { data: users, reload } = useAsync(() => userService.list(), []);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const createAdmin = async (event) => {
    event.preventDefault();
    const validation = {};
    if (!form.name.trim()) validation.name = 'Informe o nome.';
    if (!isEmail(form.email)) validation.email = 'E-mail inválido.';
    if (form.password.length < 8) validation.password = 'Use no mínimo 8 caracteres.';
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSaving(true);
    try {
      await userService.createAdmin(form);
      setForm(EMPTY);
      setErrors({});
      toast('Perfil de administrador criado');
      reload();
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (target, role) => {
    try {
      await userService.updateRole(target.id, role, currentUser.id);
      toast(`Perfil de ${target.name} atualizado`);
      reload();
    } catch (error) {
      toast(error.message);
      reload();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title="Usuários e perfis"
        subtitle="Crie administradores e altere o tipo de acesso das contas."
      />

      <form onSubmit={createAdmin} className="rounded-md border border-line bg-white p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-brand">Criar perfil de administrador</h2>
          <p className="mt-1 text-[11px] text-muted">Este formulário cria diretamente uma conta com acesso administrativo.</p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Input label="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} error={errors.name} />
          <Input label="E-mail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} error={errors.email} />
          <Input label="Telefone" value={form.phone} onChange={(event) => setForm({ ...form, phone: maskPhone(event.target.value) })} />
          <Input label="Senha inicial" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} error={errors.password} hint="Mínimo de 8 caracteres." />
        </div>
        {errors.form && <p role="alert" className="mt-3 text-[11px] text-danger">{errors.form}</p>}
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? 'Criando…' : 'Criar administrador'}</Button>
        </div>
      </form>

      <div className="mt-7">
        <h2 className="mb-3 text-[15px] font-semibold text-brand">Contas cadastradas</h2>
        {!users ? (
          <Loading />
        ) : users.length === 0 ? (
          <EmptyState>Nenhuma conta cadastrada.</EmptyState>
        ) : (
          <Table cols={COLS} minWidth={680} head={['Nome', 'E-mail', 'Perfil', 'Acesso']}>
            {users.map((account) => (
              <Tr key={account.id} cols={COLS}>
                <span className="pr-2 font-semibold text-brand">{account.name}</span>
                <span className="break-all text-body">{account.email}</span>
                <Badge tone={account.role === 'admin' ? 'yellow' : 'green'}>
                  {account.role === 'admin' ? 'Administrador' : 'Cliente'}
                </Badge>
                <Select
                  aria-label={`Perfil de ${account.name}`}
                  value={account.role}
                  disabled={account.id === currentUser.id}
                  onChange={(event) => changeRole(account, event.target.value)}
                >
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </Select>
              </Tr>
            ))}
          </Table>
        )}
        <p className="mt-3 text-[11px] text-muted">
          Para evitar perder o acesso, seu próprio perfil não pode ser alterado por esta tela.
        </p>
      </div>
    </>
  );
}
