export type Sex = 'Macho' | 'Fêmea';
export type AnimalStatus = 'Ativo' | 'Vendido';
export type LotStatus = 'Ativo' | 'Encerrado';
export type OccupancyStatus = 'OK' | 'Atenção' | 'Lotado';

export type Location =
  | 'Terreno 1' | 'Terreno 2' | 'Terreno 3' | 'Terreno 4'
  | 'Terreno 5' | 'Terreno 6' | 'Terreno 7' | 'Terreno 8'
  | 'Confinamento';

export type Category =
  | 'Boi Gordo' | 'Vaca Gorda' | 'Novilha' | 'Garrote'
  | 'Bezerro' | 'Terneiro' | 'Misto' | 'Outro';

export interface Land {
  id: string;
  name: Location;
  maxCapacity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lot {
  id: string;
  code: string;
  name: string;
  entryDate: string;
  purchaseTotalCost: number;
  origin?: string;
  notes?: string;
  status: LotStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Animal {
  id: string;
  tagNumber: string;
  lotId: string;
  sex: Sex;
  category: Category;
  entryDate: string;
  entryWeight: number;
  currentLocation: Location;
  status: AnimalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Weighing {
  id: string;
  animalId: string;
  weighingDate: string;
  weight: number;
  notes?: string;
  createdAt: string;
}

export interface Movement {
  id: string;
  animalId: string;
  fromLocation: Location | null;
  toLocation: Location;
  movementDate: string;
  notes?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  animalId: string;
  saleDate: string;
  saleWeight: number;
  pricePerKg: number;
  grossRevenue: number;
  slaughterhouse?: string;
  notes?: string;
  createdAt: string;
}

export interface AppStore {
  lands: Land[];
  lots: Lot[];
  animals: Animal[];
  weighings: Weighing[];
  movements: Movement[];
  sales: Sale[];

  // Lands
  updateLand: (id: string, data: Partial<Land>) => void;

  // Lots
  addLot: (lot: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLot: (id: string, data: Partial<Lot>) => void;

  // Animals
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnimal: (id: string, data: Partial<Animal>) => void;

  // Weighings
  addWeighing: (weighing: Omit<Weighing, 'id' | 'createdAt'>) => void;

  // Movements
  addMovement: (movement: Omit<Movement, 'id' | 'createdAt'>) => void;

  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
}
