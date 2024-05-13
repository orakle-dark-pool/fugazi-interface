import { useWriteContract } from "wagmi";
import { COUNTER_ABI } from "../abi/counter";
import { Permit, EncryptedUint32 } from "fhenixjs";
import { readContract } from "@wagmi/core";
import { config } from "../main";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

interface counterProps {
  permit: Permit;
  encrypted: EncryptedUint32;
}

export const useCounter = ({ permit, encrypted }: counterProps) => {
  const address = "0x7B03c89642a9286Dcae52caB419D4ce46Cc39583";
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

  const addCounter = async () => {
    return executeContractCall(async () => {
      const { signer } = await getProviderAndSigner();
      const contract = new ethers.Contract(address, COUNTER_ABI, signer);
      const result = await contract.add(encrypted);
      console.log("add", result);
      return result;
    });
  };

  const addCounterByWagmi = async () => {
    return executeContractCall(async () => {
      const result = await writeContract({
        abi: COUNTER_ABI,
        address,
        functionName: "add",
        args: [encrypted],
      });
      console.log("add", result);
      return result;
    });
  };

  const getCounterPermission = async () => {
    return executeContractCall(async () => {
      const { signer } = await getProviderAndSigner();
      const contract = new ethers.Contract(address, COUNTER_ABI, signer);
      const counterPermission = await contract.getCounterPermit(permit);
      console.log("Counter Permission", counterPermission);
      return counterPermission;
    });
  };

  const getCounter = async () => {
    return executeContractCall(async () => {
      const counterResult = await readContract(config, {
        abi: COUNTER_ABI,
        address,
        functionName: "getCounter",
      });
      console.log("Counter", counterResult);
      return counterResult;
    });
  };

  return {
    isPending,
    getCounterPermission,
    getCounter,
    addCounter,
    addCounterByWagmi,
  };
};
