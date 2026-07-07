import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Animals } from './pages/Animals';
import { Lots } from './pages/Lots';
import { Lands } from './pages/Lands';
import { Confinement } from './pages/Confinement';
import { Sales } from './pages/Sales';
import { Settings } from './pages/Settings';
import { StoreContext, useStoreState } from './store/useStore';

function AppProviders({ children }: { children: React.ReactNode }) {
  const store = useStoreState();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="animais" element={<Animals />} />
            <Route path="lotes" element={<Lots />} />
            <Route path="terrenos" element={<Lands />} />
            <Route path="confinamento" element={<Confinement />} />
            <Route path="vendas" element={<Sales />} />
            <Route path="configuracoes" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
