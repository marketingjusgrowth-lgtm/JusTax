import React, { useState } from 'react';
import { Edit2, Check, X, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OccupancyBadge } from '../components/ui/Badge';
import { getOccupancyStatus } from '../utils/calculations';

export function Settings() {
  const { lands, animals, updateLand, resetData } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  const startEdit = (landId: string, current: number) => { setEditing(landId); setEditVal(current); };
  const saveEdit = (landId: string) => { updateLand(landId, { maxCapacity: editVal }); setEditing(null); };

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Ajuste as configurações do sistema</p>
      </div>

      {/* Terrenos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Capacidade dos Terrenos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure a capacidade máxima de cada terreno</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Terreno</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ocupação Atual</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cap. Máxima</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lands.map(land => {
              const active = animals.filter(a => a.status === 'Ativo' && a.currentLocation === land.name).length;
              const status = getOccupancyStatus(active, land.maxCapacity);
              const isEditing = editing === land.id;
              return (
                <tr key={land.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3.5 font-medium text-gray-800">{land.name}</td>
                  <td className="px-6 py-3.5 text-center text-gray-600">{active}</td>
                  <td className="px-6 py-3.5 text-center">
                    {isEditing ? (
                      <input type="number" className="w-20 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={editVal} onChange={e => setEditVal(Number(e.target.value))} min={1} />
                    ) : (
                      <span className="font-semibold text-gray-800">{land.maxCapacity}</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center"><OccupancyBadge status={status} /></td>
                  <td className="px-6 py-3.5 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => saveEdit(land.id)} className="p-1.5 rounded hover:bg-green-50 text-green-600"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(land.id, land.maxCapacity)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sobre */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Sobre o Sistema</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium text-gray-700">Sistema:</span> JJP Pecuária — Gestão de Animais</p>
          <p><span className="font-medium text-gray-700">Versão:</span> 1.0.0</p>
          <p><span className="font-medium text-gray-700">Armazenamento:</span> Local (navegador)</p>
          <p><span className="font-medium text-gray-700">Total de animais:</span> {animals.length}</p>
          <p><span className="font-medium text-gray-700">Animais ativos:</span> {animals.filter(a => a.status === 'Ativo').length}</p>
        </div>
      </div>

      {/* Reset */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-semibold text-red-700 mb-2">Resetar Dados</h2>
        <p className="text-sm text-gray-500 mb-4">Isso apagará todos os dados e voltará para os dados de exemplo. Ação irreversível.</p>
        {confirmReset ? (
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-red-600">Tem certeza?</p>
            <Button variant="danger" size="sm" onClick={() => { resetData(); setConfirmReset(false); }}>Sim, resetar</Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirmReset(false)}>Cancelar</Button>
          </div>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}><RotateCcw className="w-4 h-4" />Resetar para Dados de Exemplo</Button>
        )}
      </div>
    </div>
  );
}
