import { useState, useEffect, createContext, useContext } from 'react';
import { initialLands, initialLots, initialAnimals, initialWeighings, initialMovements, initialSales } from '../data/mockData';
import type { Land, Lot, Animal, Weighing, Movement, Sale } from '../types';

const STORAGE_KEY = 'jjp-pecuaria-data';

interface StoreData {
  lands: Land[];
  lots: Lot[];
  animals: Animal[];
  weighings: Weighing[];
  movements: Movement[];
  sales: Sale[];
}

function loadFromStorage(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    lands: initialLands,
    lots: initialLots,
    animals: initialAnimals,
    weighings: initialWeighings,
    movements: initialMovements,
    sales: initialSales,
  };
}

function saveToStorage(data: StoreData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function useStoreState() {
  const [data, setData] = useState<StoreData>(loadFromStorage);

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updateLand = (id: string, updates: Partial<Land>) => {
    setData(d => ({
      ...d,
      lands: d.lands.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
    }));
  };

  const addLot = (lot: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setData(d => ({ ...d, lots: [...d.lots, { ...lot, id: generateId(), createdAt: now, updatedAt: now }] }));
  };

  const updateLot = (id: string, updates: Partial<Lot>) => {
    setData(d => ({
      ...d,
      lots: d.lots.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
    }));
  };

  const addAnimal = (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = generateId();
    setData(d => ({
      ...d,
      animals: [...d.animals, { ...animal, id, createdAt: now, updatedAt: now }],
      movements: [...d.movements, {
        id: generateId(), animalId: id,
        fromLocation: null, toLocation: animal.currentLocation,
        movementDate: animal.entryDate, createdAt: now,
      }],
    }));
  };

  const updateAnimal = (id: string, updates: Partial<Animal>) => {
    setData(d => ({
      ...d,
      animals: d.animals.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a),
    }));
  };

  const addWeighing = (weighing: Omit<Weighing, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    setData(d => ({ ...d, weighings: [...d.weighings, { ...weighing, id: generateId(), createdAt: now }] }));
  };

  const addMovement = (movement: Omit<Movement, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const id = generateId();
    setData(d => ({
      ...d,
      movements: [...d.movements, { ...movement, id, createdAt: now }],
      animals: d.animals.map(a =>
        a.id === movement.animalId ? { ...a, currentLocation: movement.toLocation, updatedAt: now } : a
      ),
    }));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    setData(d => ({
      ...d,
      sales: [...d.sales, { ...sale, id: generateId(), createdAt: now }],
      animals: d.animals.map(a =>
        a.id === sale.animalId ? { ...a, status: 'Vendido', updatedAt: now } : a
      ),
    }));
  };

  const resetData = () => {
    const fresh: StoreData = {
      lands: initialLands,
      lots: initialLots,
      animals: initialAnimals,
      weighings: initialWeighings,
      movements: initialMovements,
      sales: initialSales,
    };
    setData(fresh);
  };

  return { ...data, updateLand, addLot, updateLot, addAnimal, updateAnimal, addWeighing, addMovement, addSale, resetData };
}

export type Store = ReturnType<typeof useStoreState>;

import React from 'react';
export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
