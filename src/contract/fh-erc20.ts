import { FHERC20_ABI } from "../abi/fherc20";
import { Permit, EncryptedUint32, FhenixClient } from "fhenixjs";
import { config } from "../configs/fhenix-config";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

interface fhErc20Props {
  permit: Permit;
  encrypted: EncryptedUint32;
  walletAddress: any;
}

export const useFhErc20 = ({
  permit,
  encrypted,
  walletAddress,
}: fhErc20Props) => {
  const address = "0x100371Fe4B99492a6AEE453FFa46AB8074aae8e4";
  const provider = new ethers.JsonRpcProvider(
    "https://api.helium.fhenix.zone/"
  );
  const client = new FhenixClient({ provider });
  const [isPending, setIsPending] = useState(false);

  const getProviderAndSigner = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    throw error;
  };

  const executeContractCall = async (callback: () => Promise<any>) => {
    setIsPending(true);
    try {
      return await callback();
    } catch (error) {
      handleError(error, "Error during contract interaction");
    } finally {
      setIsPending(false);
    }
  };

  const getMintEncrypted = async () => {
    const { provider, signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(address, FHERC20_ABI, signer);

    try {
      const balance = await contract.mintEncrypted();
      console.log(balance);
      return balance;
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanceOfEncrypted = async () => {
    const { provider, signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(address, FHERC20_ABI, signer);
    const permission = client.extractPermitPermission(permit);

    try {
      const encryptedBalance = await contract.balanceOf(permit);

      console.log(encryptedBalance);

      return encryptedBalance;
    } catch (error) {
      throw error;
    }
  };

  return {
    isPending,
    getMintEncrypted,
    getBalanceOfEncrypted,
  };
};
