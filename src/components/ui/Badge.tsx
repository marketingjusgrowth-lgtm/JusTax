import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-800',
};

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === 'Ativo') return <Badge variant="green">Ativo</Badge>;
  if (status === 'Vendido') return <Badge variant="gray">Vendido</Badge>;
  if (status === 'Encerrado') return <Badge variant="gray">Encerrado</Badge>;
  return <Badge>{status}</Badge>;
}

export function OccupancyBadge({ status }: { status: 'OK' | 'Atenção' | 'Lotado' }) {
  if (status === 'OK') return <Badge variant="green">OK</Badge>;
  if (status === 'Atenção') return <Badge variant="yellow">Atenção</Badge>;
  return <Badge variant="red">Lotado</Badge>;
}

export function SexBadge({ sex }: { sex: string }) {
  if (sex === 'Macho') return <Badge variant="blue">Macho</Badge>;
  return <Badge variant="purple">Fêmea</Badge>;
}
