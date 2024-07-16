import { useWriteContract } from "wagmi";
import { VIEWER_ABI } from "../abi/viewer";
import { getPermit, FhenixClient } from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";
import { DIAMOND_ADDRESS } from "../assets/address";

export const useViewer = () => {
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

  const getViewerPermission = async () => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    let permit = await getPermit(DIAMOND_ADDRESS, provider);
    client.storePermit(permit);
    console.log("Permit", permit);
    return permit;
  };

  const getViewerDepositBalance = async (tokenAddress: string) => {
    const { signer } = await getProviderAndSigner();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    const contract = new ethers.Contract(DIAMOND_ADDRESS, VIEWER_ABI, signer);
    const permit = await getPermit(DIAMOND_ADDRESS, provider);
    console.log("Permit", permit);
    client.storePermit(permit); // store 안해주면 에러남
    const permission = client.extractPermitPermission(permit);
    try {
      const viewBalanceResult = await contract.getBalance(
        tokenAddress,
        permission
      );
      console.log("Counter", viewBalanceResult);
      const unsealed = await client.unseal(DIAMOND_ADDRESS, viewBalanceResult);
      console.log("Unsealed", unsealed);
      return unsealed;
    } catch (error) {
      console.error("Error during contract interaction", error);
      throw error;
    }
  };

  return {
    isPending,
    getViewerPermission,
    getViewerDepositBalance,
  };
};
