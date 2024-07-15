import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { newTestFhenix } from "./configs/fhenix-config.ts";

const MainPage = lazy(() => import("./pages/main-page"));
const SwapPage = lazy(() => import("./pages/swap-page"));
const PoolPage = lazy(() => import("./pages/pool-page/index.tsx"));
const DashBoard = lazy(() => import("./pages/dashboard-page"));

export const config = createConfig({
  chains: [newTestFhenix],
  transports: {
    [newTestFhenix.id]: http(),
  },
});
const queryClient = new QueryClient();

const App = () => {
  return (
    <Suspense fallback={<></>}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/swap" element={<SwapPage />} />
              <Route path="/pool" element={<PoolPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </Suspense>
  );
};

export default App;
