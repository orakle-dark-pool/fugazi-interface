import { useWriteContract } from "wagmi";
import { FUGAZI_ABI } from "../abi/fugazi";
import {
  Permit,
  EncryptedUint32,
  getPermit,
  FhenixClient,
  EncryptionTypes,
} from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

export const useFugazi = () => {
  const fugaziAddress = "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77";
  const diamondAddress = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //Diamond address
  const [isPending, setIsPending] = useState(false);
  const { writeContract } = useWriteContract();

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
    const contract = new ethers.Contract(fugaziAddress, FUGAZI_ABI, signer);
    const encrypted: EncryptedUint32 = await client.encrypt(
      1,
      EncryptionTypes.uint32
    );
    const result = await contract.approveEncrypted(diamondAddress, encrypted);
    console.log("Result", result);
    return result;
  };

  const getBalanceOfEncryptedFugazi = async () => {
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(fugaziAddress, FUGAZI_ABI, signer);

    const permit = await getPermit(fugaziAddress, provider);
    if (!permit) {
      const permit = await client.generatePermit(
        fugaziAddress,
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
      const unsealed = client.unseal(fugaziAddress, result);
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
