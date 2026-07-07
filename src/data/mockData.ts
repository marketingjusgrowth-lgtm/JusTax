import type { Land, Lot, Animal, Weighing, Movement, Sale } from '../types';

export const initialLands: Land[] = [
  { id: 'land-1', name: 'Terreno 1', maxCapacity: 20, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-2', name: 'Terreno 2', maxCapacity: 40, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-3', name: 'Terreno 3', maxCapacity: 35, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-4', name: 'Terreno 4', maxCapacity: 15, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-5', name: 'Terreno 5', maxCapacity: 60, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-6', name: 'Terreno 6', maxCapacity: 30, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-7', name: 'Terreno 7', maxCapacity: 30, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'land-8', name: 'Terreno 8', maxCapacity: 25, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
];

export const initialLots: Lot[] = [
  { id: 'lot-01', code: 'L01', name: 'Lote 01', entryDate: '2026-03-10', purchaseTotalCost: 85000, origin: 'Mato Grosso', notes: 'Lote lado direito conf.', status: 'Ativo', createdAt: '2026-03-10', updatedAt: '2026-03-10' },
  { id: 'lot-02', code: 'L02', name: 'Lote 02', entryDate: '2026-05-16', purchaseTotalCost: 210000, origin: 'Goiás', notes: 'Lote lado esquerdo conf.', status: 'Ativo', createdAt: '2026-05-16', updatedAt: '2026-05-16' },
  { id: 'lot-03', code: 'L03', name: 'Lote 03', entryDate: '2026-04-05', purchaseTotalCost: 45000, origin: 'Minas Gerais', notes: 'Recuperação', status: 'Ativo', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { id: 'lot-04', code: 'L04', name: 'Lote 04', entryDate: '2026-02-20', purchaseTotalCost: 120000, origin: 'Mato Grosso do Sul', notes: '', status: 'Ativo', createdAt: '2026-02-20', updatedAt: '2026-02-20' },
  { id: 'lot-05', code: 'L05', name: 'Lote 05', entryDate: '2026-01-15', purchaseTotalCost: 95000, origin: 'Goiás', notes: '', status: 'Ativo', createdAt: '2026-01-15', updatedAt: '2026-01-15' },
  { id: 'lot-08', code: 'L08', name: 'Lote 08', entryDate: '2026-06-08', purchaseTotalCost: 180000, origin: 'Mato Grosso', notes: 'Lote recente', status: 'Ativo', createdAt: '2026-06-08', updatedAt: '2026-06-08' },
];

const makeAnimal = (
  id: string, tag: string, lotId: string,
  sex: 'Macho' | 'Fêmea', cat: any,
  entryDate: string, entryWeight: number,
  location: any, status: 'Ativo' | 'Vendido' = 'Ativo', notes = ''
): Animal => ({
  id, tagNumber: tag, lotId, sex, category: cat,
  entryDate, entryWeight, currentLocation: location,
  status, notes, createdAt: entryDate, updatedAt: entryDate,
});

export const initialAnimals: Animal[] = [
  // Confinamento - Lote 01 (8 animais)
  makeAnimal('a001','087506','lot-01','Fêmea','Vaca Gorda','2026-03-10',0,'Confinamento'),
  makeAnimal('a002','164102','lot-01','Macho','Boi Gordo','2026-03-10',0,'Confinamento'),
  makeAnimal('a003','348155','lot-01','Macho','Boi Gordo','2026-03-10',0,'Confinamento'),
  makeAnimal('a004','355859','lot-01','Macho','Boi Gordo','2026-03-10',0,'Confinamento'),
  makeAnimal('a005','432734','lot-01','Macho','Boi Gordo','2026-03-10',0,'Confinamento'),
  makeAnimal('a006','963152','lot-01','Fêmea','Vaca Gorda','2026-03-10',0,'Confinamento'),
  makeAnimal('a007','963157','lot-01','Macho','Boi Gordo','2026-03-10',0,'Confinamento'),
  makeAnimal('a008','432735','lot-01','Fêmea','Vaca Gorda','2026-03-10',0,'Confinamento'),

  // Confinamento - Lote 02 (26 animais)
  makeAnimal('a009','348152','lot-02','Macho','Boi Gordo','2026-05-16',320,'Confinamento'),
  makeAnimal('a010','355767','lot-02','Macho','Boi Gordo','2026-05-16',346,'Confinamento'),
  makeAnimal('a011','355797','lot-02','Macho','Boi Gordo','2026-05-16',337,'Confinamento'),
  makeAnimal('a012','355855','lot-02','Macho','Boi Gordo','2026-05-16',250,'Confinamento'),
  makeAnimal('a013','355860','lot-02','Fêmea','Vaca Gorda','2026-05-16',305,'Confinamento'),
  makeAnimal('a014','356004','lot-02','Macho','Boi Gordo','2026-05-16',327,'Confinamento'),
  makeAnimal('a015','360758','lot-02','Macho','Boi Gordo','2026-05-16',225,'Confinamento'),
  makeAnimal('a016','429147','lot-02','Macho','Boi Gordo','2026-05-16',286,'Confinamento'),
  makeAnimal('a017','454681','lot-02','Fêmea','Vaca Gorda','2026-05-16',305,'Confinamento'),
  makeAnimal('a018','662491','lot-02','Macho','Boi Gordo','2026-05-16',300,'Confinamento'),
  makeAnimal('a019','714646','lot-02','Macho','Boi Gordo','2026-05-16',340,'Confinamento'),
  makeAnimal('a020','722495','lot-02','Macho','Boi Gordo','2026-05-16',308,'Confinamento'),
  makeAnimal('a021','725123','lot-02','Macho','Boi Gordo','2026-05-16',325,'Confinamento'),
  makeAnimal('a022','888605','lot-02','Macho','Boi Gordo','2026-05-16',338,'Confinamento'),
  makeAnimal('a023','935761','lot-02','Macho','Boi Gordo','2026-05-16',265,'Confinamento'),
  makeAnimal('a024','941310','lot-02','Macho','Boi Gordo','2026-05-16',303,'Confinamento'),
  makeAnimal('a025','159909','lot-02','Fêmea','Vaca Gorda','2026-05-16',370,'Confinamento','Ativo','Pago 11kg'),
  makeAnimal('a026','348154','lot-02','Fêmea','Vaca Gorda','2026-05-16',304,'Confinamento'),
  makeAnimal('a027','429151','lot-02','Macho','Boi Gordo','2026-05-16',335,'Confinamento'),
  makeAnimal('a028','SB-01','lot-02','Fêmea','Vaca Gorda','2026-05-16',280,'Confinamento','Ativo','Femea Nelore'),
  makeAnimal('a029','SB-02','lot-02','Macho','Boi Gordo','2026-05-16',276,'Confinamento','Ativo','Mocho osco'),
  makeAnimal('a030','SB-03','lot-02','Macho','Boi Gordo','2026-05-16',339,'Confinamento','Ativo','Salino Vermelho'),
  makeAnimal('a031','SB-04','lot-02','Macho','Terneiro','2026-05-16',214,'Confinamento','Ativo','Terneiro Macho'),
  makeAnimal('a032','SB-05','lot-02','Macho','Terneiro','2026-05-16',225,'Confinamento','Ativo','Terneiro macho'),
  makeAnimal('a033','SB-06','lot-02','Macho','Boi Gordo','2026-05-16',321,'Confinamento','Ativo','Touro preto aspado'),
  makeAnimal('a034','SB-07','lot-02','Fêmea','Vaca Gorda','2026-05-16',336,'Confinamento','Ativo','Vaca preta aspada'),

  // Confinamento - Lote 08 (6 animais)
  makeAnimal('a035','644298','lot-08','Fêmea','Vaca Gorda','2026-06-08',310,'Confinamento'),
  makeAnimal('a036','182263','lot-08','Macho','Boi Gordo','2026-06-08',288,'Confinamento'),
  makeAnimal('a037','840813','lot-08','Fêmea','Vaca Gorda','2026-06-08',364,'Confinamento'),
  makeAnimal('a038','852612','lot-08','Fêmea','Vaca Gorda','2026-06-08',439,'Confinamento'),
  makeAnimal('a039','566362','lot-08','Macho','Boi Gordo','2026-06-08',368,'Confinamento'),
  makeAnimal('a040','484732','lot-08','Macho','Boi Gordo','2026-06-08',412,'Confinamento'),

  // Terreno 1 (15 animais) - Lote 03
  makeAnimal('a041','T1-001','lot-03','Macho','Garrote','2026-04-05',280,'Terreno 1'),
  makeAnimal('a042','T1-002','lot-03','Macho','Garrote','2026-04-05',265,'Terreno 1'),
  makeAnimal('a043','T1-003','lot-03','Fêmea','Novilha','2026-04-05',240,'Terreno 1'),
  makeAnimal('a044','T1-004','lot-03','Macho','Garrote','2026-04-05',290,'Terreno 1'),
  makeAnimal('a045','T1-005','lot-03','Fêmea','Novilha','2026-04-05',255,'Terreno 1'),
  makeAnimal('a046','T1-006','lot-03','Macho','Garrote','2026-04-05',275,'Terreno 1'),
  makeAnimal('a047','T1-007','lot-03','Fêmea','Novilha','2026-04-05',248,'Terreno 1'),
  makeAnimal('a048','T1-008','lot-03','Macho','Garrote','2026-04-05',283,'Terreno 1'),
  makeAnimal('a049','T1-009','lot-03','Fêmea','Novilha','2026-04-05',261,'Terreno 1'),
  makeAnimal('a050','T1-010','lot-03','Macho','Garrote','2026-04-05',272,'Terreno 1'),
  makeAnimal('a051','T1-011','lot-03','Fêmea','Novilha','2026-04-05',245,'Terreno 1'),
  makeAnimal('a052','T1-012','lot-03','Macho','Garrote','2026-04-05',288,'Terreno 1'),
  makeAnimal('a053','T1-013','lot-03','Fêmea','Novilha','2026-04-05',252,'Terreno 1'),
  makeAnimal('a054','T1-014','lot-03','Macho','Garrote','2026-04-05',278,'Terreno 1'),
  makeAnimal('a055','T1-015','lot-03','Fêmea','Novilha','2026-04-05',257,'Terreno 1'),

  // Terreno 2 (31 animais) - Lote 04
  ...Array.from({length: 31}, (_, i) => makeAnimal(
    `a${100+i}`, `T2-${String(i+1).padStart(3,'0')}`, 'lot-04',
    i % 2 === 0 ? 'Macho' : 'Fêmea', i % 2 === 0 ? 'Boi Gordo' : 'Vaca Gorda',
    '2026-02-20', 280 + (i * 5) % 80, 'Terreno 2'
  )),

  // Terreno 3 (28 animais) - Lote 05
  ...Array.from({length: 28}, (_, i) => makeAnimal(
    `a${200+i}`, `T3-${String(i+1).padStart(3,'0')}`, 'lot-05',
    i % 3 === 0 ? 'Fêmea' : 'Macho', i % 3 === 0 ? 'Novilha' : 'Garrote',
    '2026-01-15', 230 + (i * 7) % 100, 'Terreno 3'
  )),

  // Terreno 4 (6 animais) - Lote 05
  ...Array.from({length: 6}, (_, i) => makeAnimal(
    `a${300+i}`, `T4-${String(i+1).padStart(3,'0')}`, 'lot-05',
    i % 2 === 0 ? 'Macho' : 'Fêmea', 'Garrote',
    '2026-01-15', 220 + (i * 10), 'Terreno 4'
  )),

  // Terreno 5 (46 animais) - Lote 04
  ...Array.from({length: 46}, (_, i) => makeAnimal(
    `a${400+i}`, `T5-${String(i+1).padStart(3,'0')}`, 'lot-04',
    i % 2 === 0 ? 'Macho' : 'Fêmea', i % 2 === 0 ? 'Boi Gordo' : 'Vaca Gorda',
    '2026-02-20', 300 + (i * 4) % 120, 'Terreno 5'
  )),
];

export const initialWeighings: Weighing[] = [
  // Pesagens Lote 02 - Confinamento
  { id: 'w001', animalId: 'a009', weighingDate: '2026-06-05', weight: 345, createdAt: '2026-06-05' },
  { id: 'w002', animalId: 'a009', weighingDate: '2026-06-25', weight: 370, createdAt: '2026-06-25' },
  { id: 'w003', animalId: 'a010', weighingDate: '2026-06-05', weight: 368, createdAt: '2026-06-05' },
  { id: 'w004', animalId: 'a010', weighingDate: '2026-06-25', weight: 392, createdAt: '2026-06-25' },
  { id: 'w005', animalId: 'a011', weighingDate: '2026-06-05', weight: 360, createdAt: '2026-06-05' },
  { id: 'w006', animalId: 'a011', weighingDate: '2026-06-25', weight: 384, createdAt: '2026-06-25' },
  { id: 'w007', animalId: 'a018', weighingDate: '2026-06-05', weight: 322, createdAt: '2026-06-05' },
  { id: 'w008', animalId: 'a018', weighingDate: '2026-06-25', weight: 347, createdAt: '2026-06-25' },
  // Pesagens Terreno 2
  { id: 'w009', animalId: 'a100', weighingDate: '2026-04-01', weight: 305, createdAt: '2026-04-01' },
  { id: 'w010', animalId: 'a100', weighingDate: '2026-05-15', weight: 345, createdAt: '2026-05-15' },
  { id: 'w011', animalId: 'a101', weighingDate: '2026-04-01', weight: 295, createdAt: '2026-04-01' },
  { id: 'w012', animalId: 'a101', weighingDate: '2026-05-15', weight: 325, createdAt: '2026-05-15' },
];

export const initialMovements: Movement[] = [
  // Entradas no confinamento
  { id: 'm001', animalId: 'a001', fromLocation: null, toLocation: 'Confinamento', movementDate: '2026-03-10', createdAt: '2026-03-10' },
  { id: 'm002', animalId: 'a009', fromLocation: null, toLocation: 'Confinamento', movementDate: '2026-05-16', createdAt: '2026-05-16' },
  { id: 'm003', animalId: 'a035', fromLocation: null, toLocation: 'Confinamento', movementDate: '2026-06-08', createdAt: '2026-06-08' },
  // Animais que foram para terrenos
  { id: 'm004', animalId: 'a041', fromLocation: null, toLocation: 'Terreno 1', movementDate: '2026-04-05', createdAt: '2026-04-05' },
  { id: 'm005', animalId: 'a100', fromLocation: null, toLocation: 'Terreno 2', movementDate: '2026-02-20', createdAt: '2026-02-20' },
  { id: 'm006', animalId: 'a200', fromLocation: null, toLocation: 'Terreno 3', movementDate: '2026-01-15', createdAt: '2026-01-15' },
  // Exemplo de movimentação entre terrenos
  { id: 'm007', animalId: 'a101', fromLocation: 'Terreno 3', toLocation: 'Terreno 2', movementDate: '2026-03-20', notes: 'Transferido para engorda', createdAt: '2026-03-20' },
];

export const initialSales: Sale[] = [
  {
    id: 's001', animalId: 'a300', saleDate: '2026-05-10',
    saleWeight: 480, pricePerKg: 14.50,
    grossRevenue: 480 * 14.50,
    slaughterhouse: 'JBS Frigorífico', notes: '',
    createdAt: '2026-05-10',
  },
  {
    id: 's002', animalId: 'a301', saleDate: '2026-05-10',
    saleWeight: 460, pricePerKg: 14.50,
    grossRevenue: 460 * 14.50,
    slaughterhouse: 'JBS Frigorífico', notes: '',
    createdAt: '2026-05-10',
  },
  {
    id: 's003', animalId: 'a302', saleDate: '2026-06-01',
    saleWeight: 510, pricePerKg: 15.00,
    grossRevenue: 510 * 15.00,
    slaughterhouse: 'Marfrig', notes: 'Boa arroba',
    createdAt: '2026-06-01',
  },
];
