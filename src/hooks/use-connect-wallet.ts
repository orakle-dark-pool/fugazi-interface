import { useAccount, useConnect, useDisconnect } from "wagmi";

const DEFAULT_CHAIN_ID = "42069";

import { truncateAddress } from "../utils/string";

export const useConnectWallet = () => {
  const chainId = DEFAULT_CHAIN_ID;
  const { address, isConnected, isConnecting } = useAccount();

  //   const config = createConfig({
  //     chains: [chainId],
  //   });
  const { connect, error, isPending } = useConnect({
    // config,
  });

  const { disconnect } = useDisconnect();

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting: isConnecting || isPending,
    isConnectError: error,

    address,
    truncatedAddress: truncateAddress(address),
  };
};
