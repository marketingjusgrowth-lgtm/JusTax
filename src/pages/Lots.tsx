import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { getCurrentWeight, getGMDGeneral, formatDate, formatCurrency } from '../utils/calculations';
import type { Lot } from '../types';

function LotForm({ onClose, lot }: { onClose: () => void; lot?: Lot }) {
  const { lots, addLot, updateLot } = useStore();
  const [form, setForm] = useState({
    code: lot?.code ?? `L${String(lots.length + 1).padStart(2,'0')}`,
    name: lot?.name ?? '',
    entryDate: lot?.entryDate ?? new Date().toISOString().slice(0,10),
    purchaseTotalCost: lot?.purchaseTotalCost ?? 0,
    origin: lot?.origin ?? '',
    notes: lot?.notes ?? '',
    status: lot?.status ?? 'Ativo' as 'Ativo' | 'Encerrado',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lot) updateLot(lot.id, { ...form, purchaseTotalCost: Number(form.purchaseTotalCost) });
    else addLot({ ...form, purchaseTotalCost: Number(form.purchaseTotalCost) });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Código *" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value}))} placeholder="Ex: L01" required />
        <Input label="Nome" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Ex: Lote Novembro" />
        <Input label="Data de Entrada" type="date" value={form.entryDate} onChange={e => setForm(f => ({...f, entryDate: e.target.value}))} />
        <Input label="Custo Total de Compra (R$)" type="number" step="0.01" value={form.purchaseTotalCost || ''} onChange={e => setForm(f => ({...f, purchaseTotalCost: Number(e.target.value)}))} placeholder="0" />
        <Input label="Origem" value={form.origin} onChange={e => setForm(f => ({...f, origin: e.target.value}))} placeholder="Ex: Mato Grosso" />
        <Select label="Status" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as 'Ativo' | 'Encerrado'}))}>
          <option>Ativo</option><option>Encerrado</option>
        </Select>
        <div className="col-span-2">
          <Textarea label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2} />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{lot ? 'Salvar' : 'Criar Lote'}</Button>
      </div>
    </form>
  );
}

function LotDetail({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const { animals, weighings, sales } = useStore();
  const lotAnimals = animals.filter(a => a.lotId === lot.id);
  const activeAnimals = lotAnimals.filter(a => a.status === 'Ativo');
  const soldAnimals = lotAnimals.filter(a => a.status === 'Vendido');

  const totalEntryWeight = activeAnimals.reduce((s, a) => s + (a.entryWeight || 0), 0);
  const avgEntryWeight = activeAnimals.length > 0 ? totalEntryWeight / activeAnimals.length : 0;
  const costPerHead = lot.purchaseTotalCost > 0 && activeAnimals.length > 0 ? lot.purchaseTotalCost / activeAnimals.length : 0;
  const costPerKg = lot.purchaseTotalCost > 0 && totalEntryWeight > 0 ? lot.purchaseTotalCost / totalEntryWeight : 0;

  const lotSales = sales.filter(s => lotAnimals.some(a => a.id === s.animalId));
  const totalRevenue = lotSales.reduce((s, sale) => s + sale.grossRevenue, 0);

  const locationCounts: Record<string, number> = {};
  activeAnimals.forEach(a => { locationCounts[a.currentLocation] = (locationCounts[a.currentLocation] ?? 0) + 1; });

  const avgCurrentWeight = activeAnimals.length > 0
    ? activeAnimals.reduce((s, a) => s + getCurrentWeight(a, weighings), 0) / activeAnimals.length
    : 0;

  const avgGMD = activeAnimals.length > 0
    ? activeAnimals.reduce((s, a) => s + getGMDGeneral(a, weighings), 0) / activeAnimals.length
    : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3 text-sm">
        {[
          ['Código', lot.code], ['Status', lot.status], ['Data Entrada', formatDate(lot.entryDate)],
          ['Total Animais', lotAnimals.length], ['Ativos', activeAnimals.length], ['Vendidos', soldAnimals.length],
          ['Machos', activeAnimals.filter(a => a.sex === 'Macho').length], ['Fêmeas', activeAnimals.filter(a => a.sex === 'Fêmea').length], ['Origem', lot.origin || '—'],
          ['Custo Total', formatCurrency(lot.purchaseTotalCost)], ['Custo/Cabeça', costPerHead > 0 ? formatCurrency(costPerHead) : '—'], ['Custo/kg Ent.', costPerKg > 0 ? `${formatCurrency(costPerKg)}/kg` : '—'],
          ['Peso Médio Ent.', avgEntryWeight > 0 ? `${avgEntryWeight.toFixed(0)} kg` : '—'], ['Peso Médio Atual', avgCurrentWeight > 0 ? `${avgCurrentWeight.toFixed(0)} kg` : '—'], ['GMD Médio', avgGMD !== 0 ? `${avgGMD.toFixed(3)} kg/dia` : '—'],
        ].map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs">{k}</p>
            <p className="font-medium text-gray-800">{v}</p>
          </div>
        ))}
      </div>

      {totalRevenue > 0 && (
        <div className="bg-green-50 rounded-lg px-4 py-3 text-sm">
          <p className="text-green-600 font-semibold">Receita por vendas: {formatCurrency(totalRevenue)}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Distribuição por Local</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(locationCounts).map(([loc, count]) => (
            <div key={loc} className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-gray-500">{loc}: </span><span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Animais do Lote ({lotAnimals.length})</h3>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 text-xs border-b"><th className="text-left py-1">Brinco</th><th className="text-left py-1">Sexo</th><th className="text-left py-1">Local</th><th className="text-right py-1">Peso Atual</th><th className="text-left py-1">Status</th></tr></thead>
            <tbody>{lotAnimals.map(a => (
              <tr key={a.id} className="border-b border-gray-50">
                <td className="py-1.5 font-medium">{a.tagNumber}</td>
                <td className="py-1.5 text-gray-500">{a.sex}</td>
                <td className="py-1.5 text-gray-500">{a.currentLocation}</td>
                <td className="py-1.5 text-right">{getCurrentWeight(a, weighings)} kg</td>
                <td className="py-1.5"><StatusBadge status={a.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Lots() {
  const { lots, animals, weighings, updateLot } = useStore();
  const [modal, setModal] = useState<null | 'new' | 'edit' | 'detail'>(null);
  const [selected, setSelected] = useState<Lot | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const open = (type: typeof modal, lot?: Lot) => { setSelected(lot ?? null); setModal(type); };
  const close = () => { setModal(null); setSelected(null); };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Lotes</h1><p className="text-gray-500 text-sm mt-1">{lots.length} lotes cadastrados</p></div>
        <Button onClick={() => open('new')}><Plus className="w-4 h-4" />Novo Lote</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lots.map(lot => {
          const lotAnimals = animals.filter(a => a.lotId === lot.id);
          const active = lotAnimals.filter(a => a.status === 'Ativo');
          const males = active.filter(a => a.sex === 'Macho').length;
          const females = active.filter(a => a.sex === 'Fêmea').length;
          const sold = lotAnimals.filter(a => a.status === 'Vendido').length;
          const totalEntry = active.reduce((s, a) => s + (a.entryWeight || 0), 0);
          const avgEntry = active.length > 0 ? totalEntry / active.length : 0;
          const costPerHead = lot.purchaseTotalCost > 0 && active.length > 0 ? lot.purchaseTotalCost / active.length : 0;
          const isExpanded = expanded === lot.id;

          return (
            <div key={lot.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center font-bold text-sm">{lot.code}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lot.name || lot.code}</h3>
                      <p className="text-sm text-gray-500">{lot.origin ? `${lot.origin} · ` : ''}{formatDate(lot.entryDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lot.status} />
                    <button onClick={() => open('detail', lot)} className="text-xs text-blue-600 hover:underline px-2">Ver detalhes</button>
                    <button onClick={() => open('edit', lot)} className="text-xs text-gray-500 hover:underline px-2">Editar</button>
                  </div>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
                  {[
                    ['Animais', active.length], ['Machos', males], ['Fêmeas', females], ['Vendidos', sold],
                    ['Custo Total', formatCurrency(lot.purchaseTotalCost)], ['Custo/Cabeça', costPerHead > 0 ? formatCurrency(costPerHead) : '—'],
                    ['Peso Médio Ent.', avgEntry > 0 ? `${avgEntry.toFixed(0)} kg` : '—'], ['Peso Total Ent.', totalEntry > 0 ? `${totalEntry} kg` : '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="text-center">
                      <p className="text-xs text-gray-400">{k}</p>
                      <p className="font-semibold text-gray-800 text-sm">{v}</p>
                    </div>
                  ))}
                </div>

                {lot.notes && <p className="text-xs text-gray-400 mt-3 italic">"{lot.notes}"</p>}
              </div>
            </div>
          );
        })}
        {lots.length === 0 && <EmptyState title="Nenhum lote cadastrado" description="Crie o primeiro lote para começar a cadastrar animais." action={<Button onClick={() => open('new')}><Plus className="w-4 h-4" />Criar Lote</Button>} />}
      </div>

      <Modal isOpen={modal === 'new'} onClose={close} title="Novo Lote"><LotForm onClose={close} /></Modal>
      <Modal isOpen={modal === 'edit'} onClose={close} title="Editar Lote">{selected && <LotForm onClose={close} lot={selected} />}</Modal>
      <Modal isOpen={modal === 'detail'} onClose={close} title={`Lote: ${selected?.code}`} size="xl">{selected && <LotDetail lot={selected} onClose={close} />}</Modal>
    </div>
  );
}
