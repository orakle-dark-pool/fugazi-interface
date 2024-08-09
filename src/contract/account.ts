import { ACCOUNT_ABI } from "../abi/account";
import { EncryptedUint32, FhenixClient, EncryptionTypes } from "fhenixjs";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import { useState } from "react";
import { DIAMOND_ADDRESS, FUGAZI_ADDRESS } from "../assets/address";
import { FUGAZI_ABI } from "../abi/fugazi";

export const useAccountContract = () => {
  const provider = new JsonRpcProvider("https://api.helium.fhenix.zone/");
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

  const withdraw = async (typedAmount: number, tokenAddress: string) => {
    const { signer } = await getProviderAndSigner();
    const recipient = await signer.getAddress();
    const contract = new ethers.Contract(DIAMOND_ADDRESS, ACCOUNT_ABI, signer);
    setIsPending(true);
    try {
      const encrypted: EncryptedUint32 = await client.encrypt(
        typedAmount,
        EncryptionTypes.uint32
      );
      const result = await contract.withdraw(
        recipient,
        tokenAddress,
        encrypted
      );
      console.log("Result", result);
      return result;
    } catch (error) {
      handleError(error, "Error during contract interaction");
    } finally {
      setIsPending(false);
    }
  };

  const deposit = async (typedAmount: number, tokenAddress: string) => {
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(DIAMOND_ADDRESS, ACCOUNT_ABI, signer);
    const tokenContract = new ethers.Contract(tokenAddress, FUGAZI_ABI, signer);
    console.log("Token Contract", tokenAddress);
    setIsPending(true);
    try {
      const encrypted: EncryptedUint32 = await client.encrypt(
        typedAmount,
        EncryptionTypes.uint32
      );
      const approve = await tokenContract.approveEncrypted(
        DIAMOND_ADDRESS,
        encrypted
      );
      console.log("Approve", approve);
      const result = await contract.deposit(
        signer.getAddress(),
        tokenAddress,
        encrypted
      );
      console.log("Result", result);
      return result;
    } catch (error) {
      handleError(error, "Error during contract interaction");
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    withdraw,
    deposit,
  };
};
