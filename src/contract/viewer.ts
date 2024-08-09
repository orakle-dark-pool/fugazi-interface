import { VIEWER_ABI } from "../abi/viewer";
import { getPermit, FhenixClient } from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";
import {
  DIAMOND_ADDRESS,
  FUGAZI_ADDRESS,
  USD_ADDRESS,
} from "../assets/address";
import { POOL_REGISTRY_FACET_ABI } from "../abi/pool-registry-facet";

export const useViewer = () => {
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

  const getViewerLpBalance = async (
    tokenAddress1: string,
    tokenAddress2: string
  ) => {
    const { signer } = await getProviderAndSigner();
    const viewerContract = new ethers.Contract(
      DIAMOND_ADDRESS,
      VIEWER_ABI,
      signer
    );
    const registryContract = new ethers.Contract(
      DIAMOND_ADDRESS,
      POOL_REGISTRY_FACET_ABI,
      signer
    );
    const permit = await getPermit(DIAMOND_ADDRESS, provider);
    console.log("Permit", permit);
    client.storePermit(permit);
    setIsPending(true);
    try {
      const poolId = await registryContract.getPoolId(
        tokenAddress1,
        tokenAddress2
      );
      const lpBalance = await viewerContract.getLPBalance(poolId, permit);
      const unsealed = await client.unseal(DIAMOND_ADDRESS, lpBalance);
      console.log("Lp Balance", lpBalance);
      return unsealed;
    } catch (error) {
      handleError(error, "Error during contract interaction");
    } finally {
      setIsPending(false);
    }
  };

  const getUnclaimedOrders = async () => {
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(DIAMOND_ADDRESS, VIEWER_ABI, signer);

    try {
      setIsPending(true);
      const unclaimedOrders = await contract.getUnclaimedOrders();

      const results = unclaimedOrders.map((order) => {
        const timestamp = BigInt(order[3]);
        const date = new Date(Number(timestamp) * 1000); // Convert to milliseconds
        const settlable =
          timestamp < BigInt(Math.floor(Date.now() / 1000) + 30) &&
          order[1] == order[2];
        console.log(`Order ${order[0]} is within 30 seconds:`, settlable);
        console.log(`Order ${order[0]} timestamp:`, date.toISOString());
        return {
          pair: order[0], // Pool Id
          claimable: order[1] < order[2], // can claim
          time: date.toISOString(),
          settleable: settlable, //can settle
          epoch: order[1],
        };
      });

      console.log("Unclaimed Orders", results);
      return results;
    } catch (error) {
      handleError(error, "Error during contract interaction");
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    getViewerPermission,
    getViewerDepositBalance,
    getViewerLpBalance,
    getUnclaimedOrders,
  };
};
