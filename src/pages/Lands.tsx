import React, { useState } from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OccupancyBadge, SexBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getOccupancyStatus, getCurrentWeight } from '../utils/calculations';
import type { Land } from '../types';

function EditLandForm({ land, onClose }: { land: Land; onClose: () => void }) {
  const { updateLand } = useStore();
  const [capacity, setCapacity] = useState(land.maxCapacity);
  const [notes, setNotes] = useState(land.notes ?? '');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLand(land.id, { maxCapacity: Number(capacity), notes });
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Input label="Nome" value={land.name} disabled />
      <Input label="Capacidade Máxima (animais)" type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min={1} required />
      <Input label="Observações" value={notes} onChange={e => setNotes(e.target.value)} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}

function LandAnimals({ land, onClose }: { land: Land; onClose: () => void }) {
  const { animals, lots, weighings } = useStore();
  const here = animals.filter(a => a.status === 'Ativo' && a.currentLocation === land.name);
  return (
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-4">{here.length} animais em {land.name}</p>
      {here.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhum animal neste local.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 text-xs border-b"><th className="text-left py-2">Brinco</th><th className="text-left py-2">Lote</th><th className="text-left py-2">Sexo</th><th className="text-right py-2">Peso Atual</th></tr></thead>
            <tbody>{here.map(a => {
              const lot = lots.find(l => l.id === a.lotId);
              return (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 font-medium">{a.tagNumber}</td>
                  <td className="py-2 text-gray-500">{lot?.code ?? '—'}</td>
                  <td className="py-2"><SexBadge sex={a.sex} /></td>
                  <td className="py-2 text-right">{getCurrentWeight(a, weighings)} kg</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Lands() {
  const { lands, animals } = useStore();
  const [modal, setModal] = useState<null | 'edit' | 'animals'>(null);
  const [selected, setSelected] = useState<Land | null>(null);

  const open = (type: typeof modal, land: Land) => { setSelected(land); setModal(type); };
  const close = () => { setModal(null); setSelected(null); };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Terrenos</h1>
        <p className="text-gray-500 text-sm mt-1">Mapa de ocupação dos pastos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lands.map(land => {
          const activeHere = animals.filter(a => a.status === 'Ativo' && a.currentLocation === land.name);
          const males = activeHere.filter(a => a.sex === 'Macho').length;
          const females = activeHere.filter(a => a.sex === 'Fêmea').length;
          const pct = land.maxCapacity > 0 ? (activeHere.length / land.maxCapacity) * 100 : 0;
          const status = getOccupancyStatus(activeHere.length, land.maxCapacity);
          const barColor = status === 'OK' ? 'bg-green-500' : status === 'Atenção' ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <div key={land.id} className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => open('animals', land)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900">{land.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <OccupancyBadge status={status} />
                  <button onClick={e => { e.stopPropagation(); open('edit', land); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 ml-1">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Ocupação</span>
                    <span className="font-semibold text-gray-800">{activeHere.length} / {land.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(0)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
                    <p className="text-blue-400 text-xs">Machos</p>
                    <p className="font-bold text-blue-700">{males}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-3 py-2 text-center">
                    <p className="text-purple-400 text-xs">Fêmeas</p>
                    <p className="font-bold text-purple-700">{females}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">Clique para ver animais</p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modal === 'edit'} onClose={close} title={`Editar: ${selected?.name}`} size="sm">
        {selected && <EditLandForm land={selected} onClose={close} />}
      </Modal>
      <Modal isOpen={modal === 'animals'} onClose={close} title={`Animais em ${selected?.name}`} size="lg">
        {selected && <LandAnimals land={selected} onClose={close} />}
      </Modal>
    </div>
  );
}
