import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

export default function AppShell({ nav }) {
  return (
    <div className="min-h-screen bg-backdrop bg-cover bg-fixed md:px-6 md:pt-6">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col shadow-panel md:min-h-[calc(100vh-24px)] md:flex-row">
        <Sidebar items={nav} />
        <main className="min-w-0 flex-1 bg-surface px-5 py-8 md:px-10 md:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
