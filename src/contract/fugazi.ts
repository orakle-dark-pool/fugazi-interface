import { FUGAZI_ABI } from "../abi/fugazi";
import {
  EncryptedUint32,
  getPermit,
  FhenixClient,
  EncryptionTypes,
} from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";
import { FUGAZI_ADDRESS, DIAMOND_ADDRESS } from "../assets/address";

export const useFugazi = () => {
  const [isPending, setIsPending] = useState(false);

  const provider = new BrowserProvider(window.ethereum);
  const client = new FhenixClient({ provider });

  const getProviderAndSigner = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    throw error;
  };

  const approveFugazi = async () => {
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(FUGAZI_ADDRESS, FUGAZI_ABI, signer);
    const encrypted: EncryptedUint32 = await client.encrypt(
      1,
      EncryptionTypes.uint32
    );
    const result = await contract.approveEncrypted(DIAMOND_ADDRESS, encrypted);
    console.log("Result", result);
    return result;
  };

  const getBalanceOfEncryptedFugazi = async ({ tokenAddress }) => {
    const { signer } = await getProviderAndSigner();
    let address = await signer.getAddress();
    try {
      address = await signer.getAddress();
    } catch (error) {
      console.error("can't get address", error);
    }
    const contract = new ethers.Contract(tokenAddress, FUGAZI_ABI, signer);

    const permit = await getPermit(tokenAddress, provider);
    if (!permit) {
      const permit = await client.generatePermit(
        tokenAddress,
        undefined,
        signer
      );
      console.log("Permit", permit);
      client.storePermit(permit);
    }
    client.storePermit(permit); // store 안해주면 에러남

    const permission = client.extractPermitPermission(permit);

    console.log("Permission", permission);
    try {
      const result = await contract.balanceOfEncrypted(address, permission);
      const unsealed = client.unseal(tokenAddress, result);
      return unsealed;
    } catch (error) {
      console.error("Error1", error);
      return "error";
    }
  };

  return {
    isPending,
    approveFugazi,
    getBalanceOfEncryptedFugazi,
  };
};
