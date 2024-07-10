import { useWriteContract } from "wagmi";
import { FUGAZI_ABI } from "../abi/fugazi";
import { Permit, EncryptedUint32, getPermit, FhenixClient } from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

interface counterProps {
  encrypted: EncryptedUint32;
}

export const useFugazi = ({ encrypted }: counterProps) => {
  const fugaziAddress = "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77";
  const diamondAddress = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //Diamond address
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

  const approveFugazi = async () => {
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(fugaziAddress, FUGAZI_ABI, signer);
    const result = await contract.approveEncrypted(diamondAddress, encrypted);
    console.log("Result", result);
    return result;
  };

  const getBalanceOfEncryptedFugazi = async () => {
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(fugaziAddress, FUGAZI_ABI, signer);
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    const permit = await getPermit(fugaziAddress, provider);
    if (!permit) {
      const permit = await client.generatePermit(
        fugaziAddress,
        undefined,
        signer
      );
      console.log("Permit", permit);
      client.storePermit(permit); // store 안해주면 에러남
    }
    client.storePermit(permit); // store 안해주면 에러남
    const permission = client.extractPermitPermission(permit);

    console.log("Permission", permission);
    const result = await contract.balanceOfEncrypted(address, permission);
    console.log("Result", result);
    return result;
  };

  return {
    isPending,
    approveFugazi,
    getBalanceOfEncryptedFugazi,
  };
};
