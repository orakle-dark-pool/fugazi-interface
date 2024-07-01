import { useWriteContract } from "wagmi";
import { COUNTER_ABI } from "../abi/counter";
import { Permit, EncryptedUint32, getPermit, FhenixClient } from "fhenixjs";
import { config } from "../configs/fhenix-config";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

interface counterProps {
  permit: Permit;
  encrypted: EncryptedUint32;
}

export const useCounter = ({ permit, encrypted }: counterProps) => {
  const address = "0xc5205B400619E87939617096A8385331076C397c";
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

  // const getCounterPermission = async () => {
  //   return executeContractCall(async () => {
  //     const { signer } = await getProviderAndSigner();
  //     const contract = new ethers.Contract(address, COUNTER_ABI, signer);
  //     const counterPermission = await contract.getCounterPermit(permit);
  //     console.log("Counter Permission", counterPermission);
  //     return counterPermission;
  //   });
  // };
  const getCounterPermission = async () => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    let permit = await getPermit(address, provider);
    client.storePermit(permit);
    console.log("Permit", permit);
  };

  const getCounter = async () => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    const contract = new ethers.Contract(address, COUNTER_ABI, signer);

    //const permit = await getPermit(address, provider);
    const permit = await getPermit(address, provider);
    console.log("Permit", permit);
    client.storePermit(permit); // store 안해주면 에러남
    const permission = client.extractPermitPermission(permit);
    try {
      const counterResult = await contract.getCounterPermitSealed(permission);
      console.log("Counter", counterResult);
      const unsealed = await client.unseal(address, counterResult);
      console.log("Unsealed", unsealed);
      return counterResult;
    } catch (error) {
      console.error("Error during contract interaction", error);
      throw error;
    }
  };

  // const getCounter = async () => {
  //   return executeContractCall(async () => {
  //     const counterResult = await readContract(config, {
  //       abi: COUNTER_ABI,
  //       address,
  //       functionName: "getCounter",
  //     });
  //     console.log("Counter", counterResult);
  //     return counterResult;
  //   });
  // };

  return {
    isPending,
    getCounterPermission,
    getCounter,
    addCounter,
    addCounterByWagmi,
  };
};
