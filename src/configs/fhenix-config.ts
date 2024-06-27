import { http } from "viem";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const fhenix = {
  id: 42069,
  name: "Fhenix",
  nativeCurrency: {
    name: "Fhenix",
    symbol: "FHX",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://api.testnet.fhenix.zone:7747"] },
  },
  blockExplorers: {
    default: { name: "Fhenix Explorer", url: "https://testnet.fhenix.zone" },
  },
};

export const newTestFhenix = {
  id: 8008135,
  name: "Fhenix Helium",
  nativeCurrency: {
    name: "FHE Token",
    symbol: "tFHE",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://api.helium.fhenix.zone"] },
  },
  blockExplorers: {
    default: {
      name: "Fhenix Explorer",
      url: "https://explorer.helium.fhenix.zone",
    },
  },
};

export const config = createConfig({
  chains: [fhenix],
  connectors: [injected()],
  transports: {
    [fhenix.id]: http(),
  },
});

export const newTestFhenixConfig = createConfig({
  chains: [newTestFhenix],
  connectors: [injected()],
  transports: {
    [newTestFhenix.id]: http(),
  },
});
