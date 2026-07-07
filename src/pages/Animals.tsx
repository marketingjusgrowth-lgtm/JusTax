import React, { useState } from 'react';
import { Plus, Search, Eye, Scale, MoveRight, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge, StatusBadge, SexBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { getCurrentWeight, getGMDGeneral, getGMDLastWeighing, getDaysInSystem, formatDate, formatCurrency } from '../utils/calculations';
import type { Animal, Location, Sex, Category } from '../types';

const LOCATIONS: Location[] = ['Terreno 1','Terreno 2','Terreno 3','Terreno 4','Terreno 5','Terreno 6','Terreno 7','Terreno 8','Confinamento'];
const CATEGORIES: Category[] = ['Boi Gordo','Vaca Gorda','Novilha','Garrote','Bezerro','Terneiro','Misto','Outro'];

function AnimalForm({ onClose, animal }: { onClose: () => void; animal?: Animal }) {
  const { lots, animals, addAnimal, updateAnimal } = useStore();
  const [form, setForm] = useState({
    tagNumber: animal?.tagNumber ?? '',
    lotId: animal?.lotId ?? lots[0]?.id ?? '',
    sex: animal?.sex ?? 'Macho' as Sex,
    category: animal?.category ?? 'Boi Gordo' as Category,
    entryDate: animal?.entryDate ?? new Date().toISOString().slice(0,10),
    entryWeight: animal?.entryWeight ?? 0,
    currentLocation: animal?.currentLocation ?? 'Terreno 1' as Location,
    notes: animal?.notes ?? '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tagNumber.trim()) { setError('Brinco obrigatório'); return; }
    if (!animal) {
      const exists = animals.find(a => a.tagNumber.toLowerCase() === form.tagNumber.toLowerCase());
      if (exists) { setError('Brinco já cadastrado'); return; }
    }
    if (animal) {
      updateAnimal(animal.id, { ...form, entryWeight: Number(form.entryWeight) });
    } else {
      addAnimal({ ...form, entryWeight: Number(form.entryWeight), status: 'Ativo' });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Brinco *" value={form.tagNumber} onChange={e => setForm(f => ({...f, tagNumber: e.target.value}))} placeholder="Ex: 087506 ou SB-01" />
        <Select label="Lote *" value={form.lotId} onChange={e => setForm(f => ({...f, lotId: e.target.value}))}>
          {lots.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
        </Select>
        <Select label="Sexo" value={form.sex} onChange={e => setForm(f => ({...f, sex: e.target.value as Sex}))}>
          <option>Macho</option><option>Fêmea</option>
        </Select>
        <Select label="Categoria" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as Category}))}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Input label="Data de Entrada" type="date" value={form.entryDate} onChange={e => setForm(f => ({...f, entryDate: e.target.value}))} />
        <Input label="Peso de Entrada (kg)" type="number" step="0.1" value={form.entryWeight || ''} onChange={e => setForm(f => ({...f, entryWeight: Number(e.target.value)}))} placeholder="Ex: 320" />
        <div className="col-span-2">
          <Select label="Local Atual" value={form.currentLocation} onChange={e => setForm(f => ({...f, currentLocation: e.target.value as Location}))}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </Select>
        </div>
        <div className="col-span-2">
          <Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Opcional" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{animal ? 'Salvar' : 'Cadastrar Animal'}</Button>
      </div>
    </form>
  );
}

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
      <Input label="Peso (kg) *" type="number" step="0.1" value={form.weight} onChange={e => setForm(f => ({...f, weight: e.target.value}))} placeholder="Ex: 385" required />
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
      <p className="text-sm text-gray-500">Animal: <strong>{animal.tagNumber}</strong> — Local atual: <strong>{animal.currentLocation}</strong></p>
      <Select label="Destino" value={form.toLocation} onChange={e => setForm(f => ({...f, toLocation: e.target.value as Location}))}>
        {LOCATIONS.filter(l => l !== animal.currentLocation).map(l => <option key={l}>{l}</option>)}
      </Select>
      <Input label="Data da Movimentação" type="date" value={form.movementDate} onChange={e => setForm(f => ({...f, movementDate: e.target.value}))} />
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
        <Input label="Preço por kg (R$)" type="number" step="0.01" value={form.pricePerKg} onChange={e => setForm(f => ({...f, pricePerKg: e.target.value}))} placeholder="Ex: 14.50" required />
        <Input label="Frigorífico" value={form.slaughterhouse} onChange={e => setForm(f => ({...f, slaughterhouse: e.target.value}))} placeholder="Ex: JBS" />
        <div className="col-span-2">
          {grossRevenue > 0 && <p className="text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg">Receita bruta: {formatCurrency(grossRevenue)}</p>}
        </div>
        <div className="col-span-2"><Input label="Observações" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Registrar Venda</Button>
      </div>
    </form>
  );
}

function AnimalDetail({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const { lots, weighings, movements, sales } = useStore();
  const lot = lots.find(l => l.id === animal.lotId);
  const animalWeighings = weighings.filter(w => w.animalId === animal.id).sort((a,b) => new Date(b.weighingDate).getTime() - new Date(a.weighingDate).getTime());
  const animalMovements = movements.filter(m => m.animalId === animal.id).sort((a,b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime());
  const animalSale = sales.find(s => s.animalId === animal.id);
  const currentWeight = getCurrentWeight(animal, weighings);
  const gmd = getGMDGeneral(animal, weighings);
  const gmdLast = getGMDLastWeighing(animal, weighings);
  const days = getDaysInSystem(animal.entryDate);

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ['Brinco', animal.tagNumber], ['Lote', lot?.name ?? '—'],
          ['Sexo', animal.sex], ['Categoria', animal.category],
          ['Data Entrada', formatDate(animal.entryDate)], ['Local Atual', animal.currentLocation],
          ['Peso Entrada', `${animal.entryWeight} kg`], ['Peso Atual', `${currentWeight} kg`],
          ['Dias no Sistema', `${days} dias`], ['GMD Geral', `${gmd} kg/dia`],
          ['GMD Última Pesagem', `${gmdLast} kg/dia`], ['Status', animal.status],
        ].map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs">{k}</p>
            <p className="font-medium text-gray-800">{v}</p>
          </div>
        ))}
      </div>
      {animal.notes && <p className="text-sm text-gray-500 italic">"{animal.notes}"</p>}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Pesagens ({animalWeighings.length})</h3>
        {animalWeighings.length > 0 ? (
          <table className="w-full text-sm"><thead><tr className="text-gray-400 text-xs border-b"><th className="text-left py-1">Data</th><th className="text-right py-1">Peso</th><th className="text-left py-1 pl-4">Obs</th></tr></thead>
            <tbody>{animalWeighings.map(w => (
              <tr key={w.id} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-600">{formatDate(w.weighingDate)}</td>
                <td className="py-1.5 text-right font-medium">{w.weight} kg</td>
                <td className="py-1.5 pl-4 text-gray-400">{w.notes || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p className="text-gray-400 text-sm">Nenhuma pesagem registrada</p>}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Movimentações</h3>
        {animalMovements.length > 0 ? (
          <div className="space-y-1">{animalMovements.map(m => (
            <div key={m.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
              <span className="text-gray-500">{m.fromLocation ? `${m.fromLocation} → ` : ''}<strong>{m.toLocation}</strong></span>
              <span className="text-gray-400 text-xs">{formatDate(m.movementDate)}</span>
            </div>
          ))}</div>
        ) : <p className="text-gray-400 text-sm">Sem movimentações</p>}
      </div>

      {animalSale && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Venda</h3>
          <div className="bg-green-50 rounded-lg px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-gray-500">Data</span><span>{formatDate(animalSale.saleDate)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Peso</span><span>{animalSale.saleWeight} kg</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Preço/kg</span><span>{formatCurrency(animalSale.pricePerKg)}</span></div>
            <div className="flex justify-between font-semibold"><span>Receita Bruta</span><span className="text-green-700">{formatCurrency(animalSale.grossRevenue)}</span></div>
            {animalSale.slaughterhouse && <div className="flex justify-between"><span className="text-gray-500">Frigorífico</span><span>{animalSale.slaughterhouse}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

export function Animals() {
  const { animals, lots, weighings } = useStore();
  const [search, setSearch] = useState('');
  const [filterLot, setFilterLot] = useState('');
  const [filterSex, setFilterSex] = useState('');
  const [filterStatus, setFilterStatus] = useState('Ativo');
  const [filterLocation, setFilterLocation] = useState('');
  const [modal, setModal] = useState<null | 'new' | 'edit' | 'detail' | 'weigh' | 'move' | 'sell'>(null);
  const [selected, setSelected] = useState<Animal | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = animals.filter(a => {
    if (search && !a.tagNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterLot && a.lotId !== filterLot) return false;
    if (filterSex && a.sex !== filterSex) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterLocation && a.currentLocation !== filterLocation) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let av: any = (a as any)[sortField];
    let bv: any = (b as any)[sortField];
    if (sortField === 'currentWeight') { av = getCurrentWeight(a, weighings); bv = getCurrentWeight(b, weighings); }
    if (sortField === 'gmd') { av = getGMDGeneral(a, weighings); bv = getGMDGeneral(b, weighings); }
    if (sortField === 'days') { av = getDaysInSystem(a.entryDate); bv = getDaysInSystem(b.entryDate); }
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: string }) => sortField === field
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : null;

  const openModal = (type: typeof modal, animal?: Animal) => { setSelected(animal ?? null); setModal(type); };
  const closeModal = () => { setModal(null); setSelected(null); };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animais</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} animais</p>
        </div>
        <Button onClick={() => openModal('new')}><Plus className="w-4 h-4" />Novo Animal</Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Buscar brinco..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Vendido">Vendido</option>
          </Select>
          <Select value={filterLot} onChange={e => setFilterLot(e.target.value)}>
            <option value="">Todos os lotes</option>
            {lots.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
          </Select>
          <Select value={filterSex} onChange={e => setFilterSex(e.target.value)}>
            <option value="">Ambos os sexos</option>
            <option>Macho</option><option>Fêmea</option>
          </Select>
          <Select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
            <option value="">Todos os locais</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  ['tagNumber','Brinco'],['','Lote'],['sex','Sexo'],['category','Categoria'],
                  ['entryDate','Entrada'],['entryWeight','Peso Ent.'],['currentWeight','Peso Atual'],
                  ['days','Dias'],['gmd','GMD'],['currentLocation','Local'],['status','Status'],['','Ações'],
                ].map(([field, label]) => (
                  <th key={label} onClick={field ? () => toggleSort(field) : undefined}
                    className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${field ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}>
                    <span className="flex items-center gap-1">{label}{field && <SortIcon field={field} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map(a => {
                const lot = lots.find(l => l.id === a.lotId);
                const cw = getCurrentWeight(a, weighings);
                const gmd = getGMDGeneral(a, weighings);
                const days = getDaysInSystem(a.entryDate);
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.tagNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{lot?.code ?? '—'}</td>
                    <td className="px-4 py-3"><SexBadge sex={a.sex} /></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.category}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(a.entryDate)}</td>
                    <td className="px-4 py-3 text-gray-600">{a.entryWeight > 0 ? `${a.entryWeight} kg` : '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{cw > 0 ? `${cw} kg` : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{days}</td>
                    <td className="px-4 py-3 text-gray-600">{gmd !== 0 ? `${gmd}` : '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={a.currentLocation === 'Confinamento' ? 'red' : 'green'}>{a.currentLocation}</Badge>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openModal('detail', a)} title="Detalhes" className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Eye className="w-4 h-4" /></button>
                        {a.status === 'Ativo' && <>
                          <button onClick={() => openModal('weigh', a)} title="Pesar" className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Scale className="w-4 h-4" /></button>
                          <button onClick={() => openModal('move', a)} title="Mover" className="p-1.5 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-600"><MoveRight className="w-4 h-4" /></button>
                          <button onClick={() => openModal('sell', a)} title="Vender" className="p-1.5 rounded hover:bg-green-50 text-gray-400 hover:text-green-600"><ShoppingCart className="w-4 h-4" /></button>
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length === 0 && <EmptyState title="Nenhum animal encontrado" description="Ajuste os filtros ou cadastre um novo animal." />}
        </div>
      </div>

      <Modal isOpen={modal === 'new'} onClose={closeModal} title="Novo Animal"><AnimalForm onClose={closeModal} /></Modal>
      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Editar Animal">{selected && <AnimalForm onClose={closeModal} animal={selected} />}</Modal>
      <Modal isOpen={modal === 'detail'} onClose={closeModal} title={`Animal: ${selected?.tagNumber}`} size="lg">{selected && <AnimalDetail animal={selected} onClose={closeModal} />}</Modal>
      <Modal isOpen={modal === 'weigh'} onClose={closeModal} title="Nova Pesagem">{selected && <WeighingForm animal={selected} onClose={closeModal} />}</Modal>
      <Modal isOpen={modal === 'move'} onClose={closeModal} title="Mover Animal">{selected && <MovementForm animal={selected} onClose={closeModal} />}</Modal>
      <Modal isOpen={modal === 'sell'} onClose={closeModal} title="Registrar Venda">{selected && <SaleForm animal={selected} onClose={closeModal} />}</Modal>
    </div>
  );
}
