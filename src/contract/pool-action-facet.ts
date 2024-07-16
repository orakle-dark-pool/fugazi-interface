import { POOL_ACTION_FACET_ABI } from "../abi/pool-action-facet";
import { POOL_REGISTRY_FACET_ABI } from "../abi/pool-registry-facet";
import {
  Permit,
  EncryptedUint32,
  getPermit,
  FhenixClient,
  EncryptionTypes,
} from "fhenixjs";
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

export const usePoolActionFacet = () => {
  const poolActionFacetAddress = "0x69b7D2a0A2F68084f0cEd1E7186f1A99e47FB8ac";
  const poolRegistryFacetAddress = "0x0182871b59d421aAF40d7f204F4142ce939485c2";
  const diamondAddress = "0xF5F16b5951901BF386C53c992656eEC8038384e3"; //Diamond address

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

  const submitSwapOrder = async () => {
    const { signer } = await getProviderAndSigner();

    const registryContract = new ethers.Contract(
      diamondAddress,
      POOL_REGISTRY_FACET_ABI,
      signer
    );

    const poolId = await registryContract.getPoolId(
      fugaziAddress,
      fakeUsdAddress
    );

    console.log("poolId", poolId);

    const actionContract = new ethers.Contract(
      diamondAddress,
      POOL_ACTION_FACET_ABI,
      signer
    );
    const inputTokenAddress = fugaziAddress;
    const outputTokenAddress = fakeUsdAddress;
    const amountIn = 40;
    const inputAmount =
      inputTokenAddress < outputTokenAddress // is inputToken == tokenX?
        ? (2 << 30) * 0 + (amountIn << 15)
        : (2 << 30) * 0 + amountIn;

    const encryptedAmountIn = await client.encrypt(
      inputAmount,
      EncryptionTypes.uint32
    );

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
    }
  };

  return {
    isPending,

    submitSwapOrder,
  };
};
