import { useWriteContract } from "wagmi";
import { ACCOUNT_ABI } from "../abi/account";
import { EncryptedUint32, FhenixClient, EncryptionTypes } from "fhenixjs";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import { useState } from "react";
import { DIAMOND_ADDRESS, FUGAZI_ADDRESS } from "../assets/address";

export const useAccountContract = () => {
  const provider = new JsonRpcProvider("https://api.helium.fhenix.zone/");
  const client = new FhenixClient({ provider });

  const [isPending, setIsPending] = useState(false);
  const { writeContract } = useWriteContract();

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

  const withdraw = async () => {
    const { signer } = await getProviderAndSigner();
    const recipient = await signer.getAddress();
    const contract = new ethers.Contract(DIAMOND_ADDRESS, ACCOUNT_ABI, signer);

    const encrypted: EncryptedUint32 = await client.encrypt(
      100,
      EncryptionTypes.uint32
    );
    const result = await contract.withdraw(
      recipient,
      FUGAZI_ADDRESS,
      encrypted
    );
    console.log("Result", result);
    return result;
  };

  return {
    isPending,
    withdraw,
  };
};
