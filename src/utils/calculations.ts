import { differenceInDays, parseISO } from 'date-fns';
import type { Animal, Weighing, Movement } from '../types';

export function getDaysInSystem(entryDate: string): number {
  return Math.max(0, differenceInDays(new Date(), parseISO(entryDate)));
}

export function getCurrentWeight(animal: Animal, weighings: Weighing[]): number {
  const animalWeighings = weighings
    .filter(w => w.animalId === animal.id)
    .sort((a, b) => new Date(b.weighingDate).getTime() - new Date(a.weighingDate).getTime());
  return animalWeighings.length > 0 ? animalWeighings[0].weight : animal.entryWeight;
}

export function getGMDGeneral(animal: Animal, weighings: Weighing[]): number {
  const days = getDaysInSystem(animal.entryDate);
  if (days === 0) return 0;
  const currentWeight = getCurrentWeight(animal, weighings);
  return parseFloat(((currentWeight - animal.entryWeight) / days).toFixed(3));
}

export function getGMDLastWeighing(animal: Animal, weighings: Weighing[]): number {
  const animalWeighings = weighings
    .filter(w => w.animalId === animal.id)
    .sort((a, b) => new Date(a.weighingDate).getTime() - new Date(b.weighingDate).getTime());
  if (animalWeighings.length < 2) return 0;
  const last = animalWeighings[animalWeighings.length - 1];
  const prev = animalWeighings[animalWeighings.length - 2];
  const days = differenceInDays(parseISO(last.weighingDate), parseISO(prev.weighingDate));
  if (days === 0) return 0;
  return parseFloat(((last.weight - prev.weight) / days).toFixed(3));
}

export function getConfinementEntryDate(animal: Animal, movements: Movement[]): string {
  const confinementMovements = movements
    .filter(m => m.animalId === animal.id && m.toLocation === 'Confinamento')
    .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime());
  if (confinementMovements.length > 0) return confinementMovements[0].movementDate;
  if (animal.currentLocation === 'Confinamento') return animal.entryDate;
  return animal.entryDate;
}

export function getDaysInConfinement(animal: Animal, movements: Movement[]): number {
  const entryDate = getConfinementEntryDate(animal, movements);
  return Math.max(0, differenceInDays(new Date(), parseISO(entryDate)));
}

export function getOccupancyStatus(current: number, max: number): 'OK' | 'Atenção' | 'Lotado' {
  const pct = max > 0 ? current / max : 0;
  if (pct > 0.9) return 'Lotado';
  if (pct > 0.7) return 'Atenção';
  return 'OK';
}

export function kgToArrobas(kg: number): number {
  return parseFloat((kg / 15).toFixed(2));
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
