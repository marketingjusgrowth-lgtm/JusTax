import React, { useState } from 'react';
import { Plus, ShoppingCart, Weight, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/Card';
import { SexBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { getCurrentWeight, formatDate, formatCurrency } from '../utils/calculations';
import type { Animal } from '../types';

function NewSaleForm({ onClose }: { onClose: () => void }) {
  const { animals, lots, weighings, addSale } = useStore();
  const activeAnimals = animals.filter(a => a.status === 'Ativo');
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [form, setForm] = useState({
    saleDate: new Date().toISOString().slice(0,10),
    saleWeight: '',
    pricePerKg: '',
    slaughterhouse: '',
    notes: '',
  });

  const animal = activeAnimals.find(a => a.id === selectedAnimalId);
  const lot = lots.find(l => l.id === animal?.lotId);
  const currentWeight = animal ? getCurrentWeight(animal, weighings) : 0;
  const grossRevenue = Number(form.saleWeight) * Number(form.pricePerKg);

  const handleAnimalChange = (id: string) => {
    setSelectedAnimalId(id);
    const a = activeAnimals.find(x => x.id === id);
    if (a) setForm(f => ({ ...f, saleWeight: String(getCurrentWeight(a, weighings) || '') }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId) return;
    addSale({ animalId: selectedAnimalId, saleDate: form.saleDate, saleWeight: Number(form.saleWeight), pricePerKg: Number(form.pricePerKg), grossRevenue, slaughterhouse: form.slaughterhouse, notes: form.notes });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Select label="Animal *" value={selectedAnimalId} onChange={e => handleAnimalChange(e.target.value)} required>
        <option value="">Selecione um animal</option>
        {activeAnimals.map(a => {
          const l = lots.find(x => x.id === a.lotId);
          return <option key={a.id} value={a.id}>{a.tagNumber} — {l?.code} — {a.sex} — {a.currentLocation}</option>;
        })}
      </Select>

      {animal && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm grid grid-cols-3 gap-2">
          <div><p className="text-gray-400 text-xs">Lote</p><p className="font-medium">{lot?.code ?? '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Sexo</p><p className="font-medium">{animal.sex}</p></div>
          <div><p className="text-gray-400 text-xs">Peso Atual</p><p className="font-medium">{currentWeight} kg</p></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Data da Venda" type="date" value={form.saleDate} onChange={e => setForm(f => ({...f, saleDate: e.target.value}))} />
        <Input label="Peso de Venda (kg) *" type="number" step="0.1" value={form.saleWeight} onChange={e => setForm(f => ({...f, saleWeight: e.target.value}))} required />
        <Input label="Preço por kg (R$) *" type="number" step="0.01" value={form.pricePerKg} onChange={e => setForm(f => ({...f, pricePerKg: e.target.value}))} placeholder="Ex: 14.50" required />
        <Input label="Frigorífico" value={form.slaughterhouse} onChange={e => setForm(f => ({...f, slaughterhouse: e.target.value}))} placeholder="Ex: JBS" />
        {grossRevenue > 0 && (
          <div className="col-span-2">
            <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              Receita bruta: {formatCurrency(grossRevenue)}
            </p>
          </div>
        )}
        <div className="col-span-2"><Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={!selectedAnimalId}>Registrar Venda</Button>
      </div>
    </form>
  );
}

export function Sales() {
  const { sales, animals, lots } = useStore();
  const [modal, setModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterLot, setFilterLot] = useState('');
  const [filterSlaughter, setFilterSlaughter] = useState('');

  const totalSold = sales.length;
  const totalWeight = sales.reduce((s, x) => s + x.saleWeight, 0);
  const totalRevenue = sales.reduce((s, x) => s + x.grossRevenue, 0);
  const avgTicket = totalSold > 0 ? totalRevenue / totalSold : 0;
  const avgWeight = totalSold > 0 ? totalWeight / totalSold : 0;

  const slaughterhouses = [...new Set(sales.map(s => s.slaughterhouse).filter(Boolean))];

  const filtered = sales.filter(s => {
    const animal = animals.find(a => a.id === s.animalId);
    if (filterLot && animal?.lotId !== filterLot) return false;
    if (filterSlaughter && s.slaughterhouse !== filterSlaughter) return false;
    if (filterPeriod) {
      const month = s.saleDate.slice(0, 7);
      if (month !== filterPeriod) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Vendas</h1><p className="text-gray-500 text-sm mt-1">{sales.length} registros</p></div>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" />Nova Venda</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Animais Vendidos" value={totalSold} icon={<ShoppingCart className="w-5 h-5" />} color="gray" />
        <StatCard title="Peso Total Vendido" value={`${totalWeight.toFixed(0)} kg`} icon={<Weight className="w-5 h-5" />} color="gray" />
        <StatCard title="Receita Bruta Total" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="w-5 h-5" />} color="green" />
        <StatCard title="Ticket Médio" value={formatCurrency(avgTicket)} icon={<DollarSign className="w-5 h-5" />} color="blue" />
        <StatCard title="Peso Médio de Venda" value={`${avgWeight.toFixed(0)} kg`} icon={<Weight className="w-5 h-5" />} color="gray" />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Input type="month" label="" placeholder="Mês" value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} />
          <Select value={filterLot} onChange={e => setFilterLot(e.target.value)}>
            <option value="">Todos os lotes</option>
            {lots.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
          </Select>
          <Select value={filterSlaughter} onChange={e => setFilterSlaughter(e.target.value)}>
            <option value="">Todos os frigoríficos</option>
            {slaughterhouses.map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Data','Brinco','Lote','Sexo','Categoria','Peso Venda','Preço/kg','Receita Bruta','Frigorífico','Obs.'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => {
                const animal = animals.find(a => a.id === s.animalId);
                const lot = lots.find(l => l.id === animal?.lotId);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(s.saleDate)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{animal?.tagNumber ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{lot?.code ?? '—'}</td>
                    <td className="px-4 py-3">{animal && <SexBadge sex={animal.sex} />}</td>
                    <td className="px-4 py-3 text-gray-600">{animal?.category ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{s.saleWeight} kg</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(s.pricePerKg)}/kg</td>
                    <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(s.grossRevenue)}</td>
                    <td className="px-4 py-3 text-gray-500">{s.slaughterhouse || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{s.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState title="Nenhuma venda registrada" description="Registre vendas diretamente por aqui ou pela tela de Animais." action={<Button onClick={() => setModal(true)}><Plus className="w-4 h-4" />Nova Venda</Button>} />}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Registrar Venda" size="lg">
        <NewSaleForm onClose={() => setModal(false)} />
      </Modal>
    </div>
  );
}
