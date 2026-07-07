import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beef, Package, MapPin, Building2, ShoppingCart, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/animais', label: 'Animais', icon: Beef },
  { to: '/lotes', label: 'Lotes', icon: Package },
  { to: '/terrenos', label: 'Terrenos', icon: MapPin },
  { to: '/confinamento', label: 'Confinamento', icon: Building2 },
  { to: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col flex-shrink-0">
      <div className="px-5 py-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-base">J</div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">JJP Pecuária</p>
            <p className="text-gray-400 text-xs">Gestão de Animais</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">v1.0.0</p>
      </div>
    </aside>
  );
}
