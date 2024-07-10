import { useWriteContract } from "wagmi";
import { ACCOUNT_ABI } from "../abi/account";
import {
  Permit,
  EncryptedUint32,
  getPermit,
  FhenixClient,
  EncryptionTypes,
} from "fhenixjs";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import { useState } from "react";

export const useAccountContract = () => {
  const diamondAddress = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //Diamond address
  const fugaziAddress = "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77";
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

  // const getCounterPermission = async () => {
  //   return executeContractCall(async () => {
  //     const { signer } = await getProviderAndSigner();
  //     const contract = new ethers.Contract(address, COUNTER_ABI, signer);
  //     const counterPermission = await contract.getCounterPermit(permit);
  //     console.log("Counter Permission", counterPermission);
  //     return counterPermission;
  //   });
  // };

  const withdraw = async () => {
    const { signer } = await getProviderAndSigner();
    const recipient = await signer.getAddress();
    const contract = new ethers.Contract(diamondAddress, ACCOUNT_ABI, signer);

    const encrypted: EncryptedUint32 = await client.encrypt(
      100,
      EncryptionTypes.uint32
    );
    const result = await contract.withdraw(recipient, fugaziAddress, encrypted);
    console.log("Result", result);
    return result;
  };

  return {
    isPending,
    withdraw,
  };
};
