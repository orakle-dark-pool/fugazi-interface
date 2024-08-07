import { useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import { DISTRIBUTOR_ABI } from "../abi/distributor";
import { ADDRESSES } from "../assets/address";

export const useDistributor = () => {
  const distributorAddress = "0x27c3C020FD2A88b50Ae66292a4119943cBBE3c92";
  const [isPending, setIsPending] = useState(false);
  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    throw error;
  };

  const getProviderAndSigner = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const claimTestToken = async (tokenAddress: string) => {
    const { provider, signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(
      distributorAddress,
      DISTRIBUTOR_ABI,
      signer
    );
    setIsPending(true);
    try {
      const result = await contract.claim(tokenAddress);

      console.log("result", `claim`, result);
      return result;
    } catch (error) {
      handleError(error, `claim`);
    } finally {
      setIsPending(false);
    }
  };

  return {
    claimTestToken,
    isPending,
    handleError,
  };
};
