import { ethers, BigNumberish } from "ethers";
import { FhenixClient } from "fhenixjs";
import type { SupportedProvider } from "fhenixjs";
import { useState } from "react";

type ExtendedProvider = SupportedProvider & {
  getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt>;
  send(method: string, params: any[] | Record<string, any>): Promise<any>;
  getSigner(): Promise<ethers.Signer>;
  getBalance(address: string): Promise<BigNumberish>;
};

export const useChain = () => {
  let provider = null as ExtendedProvider | ethers.BrowserProvider | null;
  const [fheClient, setFheClient] = useState<FhenixClient | null>(null);
  const [mmChainId, setMmChainId] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [isItFhenixNetwork, setIsItFhenixNetwork] = useState<boolean>(false);
  const [eventWasAdded, setEventWasAdded] = useState<boolean>(false);

  const fnxChainId = "8008135";
  const networkRPC = "https://api.helium.fhenix.zone";
  const explorerURL = "https://explorer.helium.fhenix.zone";
  const ERROR_CHAIN_DOES_NOT_EXIST = "4902";

  const initFHEClient = async () => {
    setFheClient(new FhenixClient({ provider: provider as SupportedProvider }));
  };

  const getFheClient = () => {
    return fheClient;
  };

  const fnxConnect = async () => {
    try {
      if (provider === null) {
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      if (provider === null) return;
      const chainId = await provider.send("eth_chainId", []);
      if (Number(chainId) !== Number(fnxChainId)) {
        await addFhenixChain();
      }
      setMmChainId(Number(chainId));
      await switchEthereumChain(Number(chainId));
      if (!eventWasAdded) {
        setEventWasAdded(true);
        await setupMetaMaskListeners();
      }
      localStorage.setItem("isConnected", "1");
      setBalance(await getBalance());
      initFHEClient();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const addFhenixChain = async () => {
    try {
      if (provider !== null) {
        const chainData = [
          {
            chainId: "0x" + Number(fnxChainId).toString(16),
            chainName: "Fhenix Helium",
            nativeCurrency: { name: "FHE Token", symbol: "tFHE", decimals: 18 },
            rpcUrls: [networkRPC],
            blockExplorerUrls: [explorerURL],
          },
        ];
        await provider.send("wallet_addEthereumChain", chainData);
        console.log("Custom network added");
      }
    } catch (addError) {
      console.error("Error adding custom network:", addError);
    }
  };

  const switchEthereumChain = async (chainId: number) => {
    try {
      if (!provider) {
        return;
      }

      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0x" + chainId.toString(16) },
      ]);
      console.log("Switched to network:", chainId);
      setIsItFhenixNetwork(Number(chainId) === Number(fnxChainId));
    } catch (switchError: unknown) {
      console.error("Error switching networks:", switchError);
      if (switchError instanceof Error) {
        const errorDetails = (switchError as any).error; // Using any to access nested properties

        if (errorDetails && errorDetails.code === ERROR_CHAIN_DOES_NOT_EXIST) {
          addFhenixChain();
        }
      }
    }
  };

  const setupMetaMaskListeners = async () => {
    window.ethereum?.on("accountsChanged", async (accounts: string[]) => {
      console.log("Account changed:", accounts[0]);
      provider = new ethers.BrowserProvider(window.ethereum);
    });

    // Listen for chain changes
    window.ethereum?.on("chainChanged", async (chainId: number) => {
      console.log("Network changed to:", chainId);
      setMmChainId(Number(chainId));
      provider = new ethers.BrowserProvider(window.ethereum);
      setIsItFhenixNetwork(Number(chainId) === Number(fnxChainId));
    });
  };

  const getBalance = async () => {
    try {
      let returnBalance = "0";
      if (provider !== null) {
        const signer = await provider.getSigner();
        setAddress(await signer.getAddress());
        const currentAddress = await signer.getAddress();
        const balance = await provider.getBalance(currentAddress);

        if (balance) {
          returnBalance = `${Number(ethers.formatEther(balance))} ETH`;
        }
        console.log(`Balance: ${returnBalance}`);
      }
      return returnBalance;
    } catch (err) {
      console.error("Error:", err);
      return "0";
    }
  };

  return {
    isItFhenixNetwork,
    balance,
    address,

    fnxConnect,
    initFHEClient,
    getFheClient,
    getBalance,
  };
};
