import { useWriteContract } from "wagmi";
import { VIEWER_ABI } from "../abi/viewer";
import { Permit, EncryptedUint32, getPermit, FhenixClient } from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

export const useViewer = () => {
  const address = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //Diamond address
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
  const getViewerPermission = async () => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    let permit = await getPermit(address, provider);
    client.storePermit(permit);
    console.log("Permit", permit);
    return permit;
  };

  const getViewerDepositBalance = async () => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    const contract = new ethers.Contract(address, VIEWER_ABI, signer);

    //const permit = await getPermit(address, provider);
    const permit = await getPermit(address, provider);
    console.log("Permit", permit);
    client.storePermit(permit); // store 안해주면 에러남
    const permission = client.extractPermitPermission(permit);
    try {
      const viewBalanceResult = await contract.getBalance(
        "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77",
        permission
      );
      console.log("Counter", viewBalanceResult);
      const unsealed = await client.unseal(address, viewBalanceResult);
      console.log("Unsealed", unsealed);
      return unsealed;
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
    getViewerPermission,
    getViewerDepositBalance,
  };
};
