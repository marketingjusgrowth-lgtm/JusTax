import React, { useState } from 'react';
import { Scale, MoveRight, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/ui/Modal';
import { SexBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Building2, Weight, TrendingUp, Users } from 'lucide-react';
import {
  getCurrentWeight, getGMDGeneral, getGMDLastWeighing,
  getDaysInConfinement, getConfinementEntryDate, formatDate
} from '../utils/calculations';
import type { Animal, Location } from '../types';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const OTHER_LOCATIONS: Location[] = ['Terreno 1','Terreno 2','Terreno 3','Terreno 4','Terreno 5','Terreno 6','Terreno 7','Terreno 8'];

function WeighingForm({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const { addWeighing } = useStore();
  const [form, setForm] = useState({ weighingDate: new Date().toISOString().slice(0,10), weight: '', notes: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWeighing({ animalId: animal.id, weighingDate: form.weighingDate, weight: Number(form.weight), notes: form.notes });
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <p className="text-sm text-gray-500">Animal: <strong>{animal.tagNumber}</strong></p>
      <Input label="Data da Pesagem" type="date" value={form.weighingDate} onChange={e => setForm(f => ({...f, weighingDate: e.target.value}))} />
      <Input label="Peso (kg) *" type="number" step="0.1" value={form.weight} onChange={e => setForm(f => ({...f, weight: e.target.value}))} required />
      <Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Registrar Pesagem</Button>
      </div>
    </form>
  );
}

function MovementForm({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const { addMovement } = useStore();
  const [form, setForm] = useState({ toLocation: 'Terreno 1' as Location, movementDate: new Date().toISOString().slice(0,10), notes: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovement({ animalId: animal.id, fromLocation: animal.currentLocation, toLocation: form.toLocation, movementDate: form.movementDate, notes: form.notes });
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <p className="text-sm text-gray-500">Mover <strong>{animal.tagNumber}</strong> do Confinamento</p>
      <Select label="Destino" value={form.toLocation} onChange={e => setForm(f => ({...f, toLocation: e.target.value as Location}))}>
        {OTHER_LOCATIONS.map(l => <option key={l}>{l}</option>)}
      </Select>
      <Input label="Data" type="date" value={form.movementDate} onChange={e => setForm(f => ({...f, movementDate: e.target.value}))} />
      <Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Mover Animal</Button>
      </div>
    </form>
  );
}

function SaleForm({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const { weighings, addSale } = useStore();
  const currentWeight = getCurrentWeight(animal, weighings);
  const [form, setForm] = useState({
    saleDate: new Date().toISOString().slice(0,10),
    saleWeight: currentWeight || '',
    pricePerKg: '',
    slaughterhouse: '',
    notes: '',
  });
  const grossRevenue = Number(form.saleWeight) * Number(form.pricePerKg);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSale({ animalId: animal.id, saleDate: form.saleDate, saleWeight: Number(form.saleWeight), pricePerKg: Number(form.pricePerKg), grossRevenue, slaughterhouse: form.slaughterhouse, notes: form.notes });
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <p className="text-sm text-gray-500">Animal: <strong>{animal.tagNumber}</strong> · Peso atual: <strong>{currentWeight} kg</strong></p>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Data da Venda" type="date" value={form.saleDate} onChange={e => setForm(f => ({...f, saleDate: e.target.value}))} />
        <Input label="Peso de Venda (kg)" type="number" step="0.1" value={form.saleWeight} onChange={e => setForm(f => ({...f, saleWeight: e.target.value}))} required />
        <Input label="Preço por kg (R$)" type="number" step="0.01" value={form.pricePerKg} onChange={e => setForm(f => ({...f, pricePerKg: e.target.value}))} required />
        <Input label="Frigorífico" value={form.slaughterhouse} onChange={e => setForm(f => ({...f, slaughterhouse: e.target.value}))} />
        {grossRevenue > 0 && <div className="col-span-2"><p className="text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg">Receita bruta: R$ {grossRevenue.toFixed(2)}</p></div>}
        <div className="col-span-2"><Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Registrar Venda</Button>
      </div>
    </form>
  );
}

export function Confinement() {
  const { animals, lots, weighings, movements } = useStore();
  const [modal, setModal] = useState<null | 'weigh' | 'move' | 'sell'>(null);
  const [selected, setSelected] = useState<Animal | null>(null);

  const confined = animals.filter(a => a.status === 'Ativo' && a.currentLocation === 'Confinamento');
  const males = confined.filter(a => a.sex === 'Macho');
  const females = confined.filter(a => a.sex === 'Fêmea');

  const totalWeight = confined.reduce((s, a) => s + getCurrentWeight(a, weighings), 0);
  const avgWeight = confined.length > 0 ? totalWeight / confined.length : 0;
  const avgGMD = confined.length > 0
    ? confined.reduce((s, a) => s + getGMDGeneral(a, weighings), 0) / confined.length
    : 0;
  const avgDays = confined.length > 0
    ? confined.reduce((s, a) => s + getDaysInConfinement(a, movements), 0) / confined.length
    : 0;

  const open = (type: typeof modal, animal: Animal) => { setSelected(animal); setModal(type); };
  const close = () => { setModal(null); setSelected(null); };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Confinamento</h1>
        <p className="text-gray-500 text-sm mt-1">Animais em terminação</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total no Confinamento" value={confined.length} icon={<Building2 className="w-5 h-5" />} color="red" />
        <StatCard title="Machos" value={males.length} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard title="Fêmeas" value={females.length} icon={<Users className="w-5 h-5" />} color="purple" />
        <StatCard title="Peso Total Atual" value={`${totalWeight.toFixed(0)} kg`} icon={<Weight className="w-5 h-5" />} color="gray" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Peso Médio Atual" value={`${avgWeight.toFixed(0)} kg`} icon={<Weight className="w-5 h-5" />} color="gray" />
        <StatCard title="GMD Médio" value={`${avgGMD.toFixed(3)} kg/dia`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
        <StatCard title="Dias Médios no Conf." value={`${avgDays.toFixed(0)} dias`} icon={<Building2 className="w-5 h-5" />} color="yellow" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Brinco','Lote','Sexo','Categoria','Ent. Conf.','Peso Ent.','Peso Atual','Dias Conf.','GMD Geral','GMD Ult. Pes.','Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {confined.map(a => {
                const lot = lots.find(l => l.id === a.lotId);
                const cw = getCurrentWeight(a, weighings);
                const gmd = getGMDGeneral(a, weighings);
                const gmdLast = getGMDLastWeighing(a, weighings);
                const confEntry = getConfinementEntryDate(a, movements);
                const daysConf = getDaysInConfinement(a, movements);
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{a.tagNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{lot?.code ?? '—'}</td>
                    <td className="px-4 py-3"><SexBadge sex={a.sex} /></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.category}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(confEntry)}</td>
                    <td className="px-4 py-3 text-gray-600">{a.entryWeight > 0 ? `${a.entryWeight} kg` : '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{cw > 0 ? `${cw} kg` : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{daysConf}</td>
                    <td className="px-4 py-3 text-gray-600">{gmd !== 0 ? gmd : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{gmdLast !== 0 ? gmdLast : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => open('weigh', a)} title="Pesar" className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Scale className="w-4 h-4" /></button>
                        <button onClick={() => open('move', a)} title="Mover" className="p-1.5 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-600"><MoveRight className="w-4 h-4" /></button>
                        <button onClick={() => open('sell', a)} title="Vender" className="p-1.5 rounded hover:bg-green-50 text-gray-400 hover:text-green-600"><ShoppingCart className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {confined.length === 0 && <EmptyState title="Nenhum animal no confinamento" description="Mova animais para o Confinamento na tela de Animais." />}
        </div>
      </div>

      <Modal isOpen={modal === 'weigh'} onClose={close} title="Nova Pesagem">{selected && <WeighingForm animal={selected} onClose={close} />}</Modal>
      <Modal isOpen={modal === 'move'} onClose={close} title="Mover do Confinamento">{selected && <MovementForm animal={selected} onClose={close} />}</Modal>
      <Modal isOpen={modal === 'sell'} onClose={close} title="Registrar Venda">{selected && <SaleForm animal={selected} onClose={close} />}</Modal>
    </div>
  );
}
