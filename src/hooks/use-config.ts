import { useState, useEffect } from "react";
import { createConfig, http } from "wagmi";
import { fhenix } from "../configs/fhenix-config";

export function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function loadConfig() {
      const config = createConfig({
        chains: [fhenix],
        transports: {
          [fhenix.id]: http(),
        },
      });
      setConfig(config);
    }

    loadConfig();
  }, []);

  return config;
}
