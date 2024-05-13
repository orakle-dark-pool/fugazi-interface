import { isAddress } from "viem";
import { useBalance } from "wagmi";

import { formatNumber } from "../utils/number";

interface Balance {
  value: bigint;
  formatted: string;
  formattedNumber: string;

  decimals: number;
  symbol: string;
  isLoading: boolean;
}

export const useNativeTokenBalances = (address?: `0x${string}`): Balance => {
  const enabled = isAddress(address ?? "0x");

  const { data, isLoading } = useBalance({
    address: address ?? "0x",
    // enabled,
    // suspense: true,
  });

  const formattedNumber = formatNumber(Number(data?.formatted ?? 0), 4);

  return {
    value: data?.value ?? 0n,
    formatted: data?.formatted ?? "",
    formattedNumber,

    decimals: data?.decimals ?? 0,
    symbol: data?.symbol ?? "",

    isLoading,
  };
};

export const useTokenBalances = (
  address?: `0x${string}`,
  token?: `0x${string}`
): Balance => {
  const enabled = isAddress(address ?? "0x") && isAddress(token ?? "0x");

  const { data, isLoading } = useBalance({
    address: address ?? "0x",
    token: token ?? "0x",
    // enabled,
  });

  const formattedNumber = formatNumber(Number(data?.formatted ?? 0), 4);

  return {
    value: data?.value ?? 0n,
    formatted: data?.formatted ?? "",
    formattedNumber,

    decimals: data?.decimals ?? 0,
    symbol: data?.symbol ?? "",
    isLoading,
  };
};
