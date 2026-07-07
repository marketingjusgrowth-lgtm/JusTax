import React from 'react';
import { Beef, Users, Building2, TrendingUp, ShoppingCart, Weight, BarChart3, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/ui/Card';
import { getCurrentWeight, getGMDGeneral, formatDate, formatCurrency } from '../utils/calculations';
import { StatusBadge, SexBadge } from '../components/ui/Badge';

export function Dashboard() {
  const { animals, lots, weighings, movements, sales, lands } = useStore();

  const activeAnimals = animals.filter(a => a.status === 'Ativo');
  const activeMales = activeAnimals.filter(a => a.sex === 'Macho');
  const activeFemales = activeAnimals.filter(a => a.sex === 'Fêmea');
  const activeLots = lots.filter(l => l.status === 'Ativo');
  const confinementAnimals = activeAnimals.filter(a => a.currentLocation === 'Confinamento');
  const soldAnimals = animals.filter(a => a.status === 'Vendido');

  const avgWeight = activeAnimals.length > 0
    ? activeAnimals.reduce((sum, a) => sum + getCurrentWeight(a, weighings), 0) / activeAnimals.length
    : 0;

  const avgGMD = activeAnimals.length > 0
    ? activeAnimals.reduce((sum, a) => sum + getGMDGeneral(a, weighings), 0) / activeAnimals.length
    : 0;

  const totalSoldWeight = sales.reduce((sum, s) => sum + s.saleWeight, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.grossRevenue, 0);

  // Gráfico animais por local
  const locationData = [
    ...lands.map(l => ({
      name: l.name.replace('Terreno ', 'T'),
      value: activeAnimals.filter(a => a.currentLocation === l.name).length,
    })),
    { name: 'Conf.', value: confinementAnimals.length },
  ].filter(d => d.value > 0);

  // Gráfico animais por lote
  const lotData = activeLots.map(l => ({
    name: l.code,
    animais: animals.filter(a => a.lotId === l.id && a.status === 'Ativo').length,
  }));

  // Gráfico sexo
  const sexData = [
    { name: 'Machos', value: activeMales.length },
    { name: 'Fêmeas', value: activeFemales.length },
  ];
  const COLORS = ['#3b82f6', '#a855f7'];

  const recentAnimals = [...animals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da JJP Pecuária</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Cabeças Ativas" value={activeAnimals.length} icon={<Beef className="w-5 h-5" />} color="green" />
        <StatCard title="Machos Ativos" value={activeMales.length} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard title="Fêmeas Ativas" value={activeFemales.length} icon={<Users className="w-5 h-5" />} color="purple" />
        <StatCard title="Lotes Ativos" value={activeLots.length} icon={<BarChart3 className="w-5 h-5" />} color="yellow" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="No Confinamento" value={confinementAnimals.length} icon={<Building2 className="w-5 h-5" />} color="red" />
        <StatCard title="Peso Médio Atual" value={`${avgWeight.toFixed(0)} kg`} icon={<Weight className="w-5 h-5" />} color="gray" />
        <StatCard title="GMD Médio" value={`${avgGMD.toFixed(3)} kg/dia`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
        <StatCard title="Animais Vendidos" value={soldAnimals.length} subtitle={`${totalSoldWeight.toFixed(0)} kg vendidos`} icon={<ShoppingCart className="w-5 h-5" />} color="gray" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Receita Bruta Total" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="w-5 h-5" />} color="green" subtitle={`${soldAnimals.length} animais`} />
        <StatCard title="Ticket Médio" value={soldAnimals.length > 0 ? formatCurrency(totalRevenue / soldAnimals.length) : '—'} icon={<ShoppingCart className="w-5 h-5" />} color="blue" />
        <StatCard title="Peso Médio Venda" value={soldAnimals.length > 0 ? `${(totalSoldWeight / soldAnimals.length).toFixed(0)} kg` : '—'} icon={<Weight className="w-5 h-5" />} color="gray" />
        <StatCard title="Total no Pasto" value={activeAnimals.filter(a => a.currentLocation !== 'Confinamento').length} icon={<MapPin className="w-5 h-5" />} color="green" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Animais por Local</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={locationData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="Animais" fill="#16a34a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Machos × Fêmeas</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sexData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {sexData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Animais por Lote</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={lotData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="animais" name="Animais" fill="#3b82f6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabelas resumidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Últimos Cadastros</h2>
          <div className="space-y-2">
            {recentAnimals.map(a => {
              const lot = lots.find(l => l.id === a.lotId);
              return (
                <div key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{a.tagNumber}</span>
                    <span className="text-gray-400 ml-2 text-xs">{lot?.code}</span>
                  </div>
                  <SexBadge sex={a.sex} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Últimas Movimentações</h2>
          <div className="space-y-2">
            {recentMovements.map(m => {
              const animal = animals.find(a => a.id === m.animalId);
              return (
                <div key={m.id} className="text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{animal?.tagNumber ?? '—'}</span>
                    <span className="text-gray-400 text-xs">{formatDate(m.movementDate)}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {m.fromLocation ? `${m.fromLocation} → ` : ''}{m.toLocation}
                  </p>
                </div>
              );
            })}
            {recentMovements.length === 0 && <p className="text-gray-400 text-sm">Nenhuma movimentação</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Últimas Vendas</h2>
          <div className="space-y-2">
            {recentSales.map(s => {
              const animal = animals.find(a => a.id === s.animalId);
              return (
                <div key={s.id} className="text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{animal?.tagNumber ?? '—'}</span>
                    <span className="text-green-600 font-medium">{formatCurrency(s.grossRevenue)}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{formatDate(s.saleDate)} · {s.saleWeight} kg</p>
                </div>
              );
            })}
            {recentSales.length === 0 && <p className="text-gray-400 text-sm">Nenhuma venda</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
