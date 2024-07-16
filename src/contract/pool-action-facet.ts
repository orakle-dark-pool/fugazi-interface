import { POOL_ACTION_FACET_ABI } from "../abi/pool-action-facet";
import { POOL_REGISTRY_FACET_ABI } from "../abi/pool-registry-facet";
import { VIEWER_ABI } from "../abi/viewer";
import { FhenixClient, EncryptionTypes } from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

export const usePoolActionFacet = () => {
  const diamondAddress = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //전체에 사용

  const fugaziAddress = "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77";
  const fakeUsdAddress = "0xFb289cdE54cBC7B227607912f472c7f6449f6a69";
  const [isPending, setIsPending] = useState(false);

  const provider = new BrowserProvider(window.ethereum);
  const client = new FhenixClient({ provider });

  const getProviderAndSigner = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const submitSwapOrder = async (typedAmount: number, inputToken: string) => {
    const { signer } = await getProviderAndSigner();
    let poolId;
    let inputTokenAddress;
    let outputTokenAddress;
    const registryContract = new ethers.Contract(
      diamondAddress,
      POOL_REGISTRY_FACET_ABI,
      signer
    );
    setIsPending(true);
    try {
      poolId = await registryContract.getPoolId(fugaziAddress, fakeUsdAddress);
      console.log("poolId", poolId);
    } catch (error) {
      console.error("Error", error);
      return "error";
    } finally {
      setIsPending(false);
    }

    const actionContract = new ethers.Contract(
      diamondAddress,
      POOL_ACTION_FACET_ABI,
      signer
    );
    if (inputToken === "FGZ") {
      inputTokenAddress = fugaziAddress;
      outputTokenAddress = fakeUsdAddress;
    } else {
      inputTokenAddress = fakeUsdAddress;
      outputTokenAddress = fugaziAddress;
    }
    const amountIn = typedAmount;
    const inputAmount =
      inputTokenAddress < outputTokenAddress // is inputToken == tokenX?
        ? (2 << 30) * 0 + (amountIn << 15)
        : (2 << 30) * 0 + amountIn;

    const encryptedAmountIn = await client.encrypt(
      inputAmount,
      EncryptionTypes.uint32
    );

    setIsPending(true);
    try {
      const result = await actionContract.submitOrder(
        poolId,
        encryptedAmountIn
      );
      console.log("swap order result", result);
      return result;
    } catch (error) {
      console.error("Error", error);
      return "error";
    } finally {
      setIsPending(false);
    }
  };

  const settleSwapBatch = async () => {
    const { signer } = await getProviderAndSigner();
    let poolId;
    const registryContract = new ethers.Contract(
      diamondAddress,
      POOL_REGISTRY_FACET_ABI,
      signer
    );
    setIsPending(true);
    try {
      poolId = await registryContract.getPoolId(fugaziAddress, fakeUsdAddress);
      console.log("poolId", poolId);
    } catch (error) {
      console.error("Error", error);
      return "error";
    } finally {
      setIsPending(false);
    }

    const actionContract = new ethers.Contract(
      diamondAddress,
      POOL_ACTION_FACET_ABI,
      signer
    );

    setIsPending(true);
    try {
      const result = await actionContract.settleBatch(poolId);
      console.log("settle order result", result);
      return result;
    } catch (error) {
      console.error("Error", error);
      return "error";
    } finally {
      setIsPending(false);
    }
  };

  const claimOrder = async () => {
    const { signer } = await getProviderAndSigner();
    let unlaimedOrdersLength;
    let unclaimedOrder;
    const actionContract = new ethers.Contract(
      diamondAddress,
      POOL_ACTION_FACET_ABI,
      signer
    );
    const viewerContract = new ethers.Contract(
      diamondAddress,
      VIEWER_ABI,
      signer
    );

    setIsPending(true);
    try {
      unlaimedOrdersLength = Number(
        await viewerContract.getUnclaimedOrdersLength()
      );
      console.log("unlaimedOrdersLength", unlaimedOrdersLength);
      unclaimedOrder = await viewerContract.getUnclaimedOrder(
        unlaimedOrdersLength - 1
      );
      console.log("unclaimedOrder", unclaimedOrder);
    } catch (error) {
      console.error("Error in get unclaimed order", error);
      return "error";
    } finally {
      setIsPending(false);
    }

    setIsPending(true);
    try {
      const result = await actionContract.claim(
        unclaimedOrder[0],
        unclaimedOrder[1]
      );
      console.log("claim order result", result);
      return result;
    } catch (error) {
      console.error(" Claim Error", error);
      return "error";
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    submitSwapOrder,
    settleSwapBatch,
    claimOrder,
  };
};
