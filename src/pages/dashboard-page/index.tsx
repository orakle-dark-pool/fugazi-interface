import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import Loading from "../../components/loading";
import { useFugazi } from "../../contract/fugazi";
import { useViewer } from "../../contract/viewer";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import {
  ADDRESSES,
  EUR_ADDRESS,
  FUGAZI_ADDRESS,
  USD_ADDRESS,
} from "../../assets/address";
import { useAccountContract } from "../../contract/account";
import usdLogo from "../../assets/usd.png";
import fgzLogo from "../../assets/logo.png";
import eurLogo from "../../assets/eur.png";
import styled from "@emotion/styled";
import { useDistributor } from "../../contract/distributor";

const dummyLiquidity = [
  {
    token1: "FGZ",
    token2: "USD",
    token1Logo: fgzLogo,
    token2Logo: usdLogo,
    amount: 0,
  },
  {
    token1: "FGZ",
    token2: "EUR",
    token1Logo: fgzLogo,
    token2Logo: eurLogo,
    amount: 1,
  },
  {
    token1: "USD",
    token2: "EUR",
    token1Logo: usdLogo,
    token2Logo: eurLogo,
    amount: 1,
  },
];

const dummyOrders = [
  {
    Pair: "FGZ-USD",
    Epoch: 1,
    Time: "2021-01-01 12:00:00",
  },
  {
    Pair: "FGZ-USD",
    Epoch: 2,
    Time: "2021-01-01 12:00:00",
  },
];

const DashBoard = () => {
  const [balance, setBalance] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [canSettle, setCanSettle] = useState(true);
  const [tokenName, setTokenName] = useState<string>("FGZ");
  const [tokenAddress, setTokenAddress] = useState<string>(FUGAZI_ADDRESS);
  const [lpBalance, setLpBalance] = useState<number[]>([]);
  const [unclaimedOrders, setUnclaimedOrders] = useState<any[]>([]);

  const { isPending: isPendingFugazi, getBalanceOfEncryptedFugazi } =
    useFugazi();

  const {
    isPending: isPendingViewer,
    getViewerDepositBalance,
    getViewerLpBalance,
    getUnclaimedOrders,
  } = useViewer();

  const {
    isPending: isPendingAction,
    claimOrder,
    removeLiquidity,
  } = usePoolActionFacet();

  const {
    isPending: isPendingAccount,
    withdraw,
    deposit,
  } = useAccountContract();

  const { isPending: isPendingGetPoolId, settleSwapBatch } =
    usePoolActionFacet();

  const handleGetBalanceOfEncryptedToken = async () => {
    const result = await getBalanceOfEncryptedFugazi({
      tokenAddress: tokenAddress,
    });
    setBalance(Number(result));
  };

  const {
    isPending: isPendingDistributor,
    claimTestToken,
    handleError,
  } = useDistributor();

  const handleGetViewerDepositTokenBalance = async () => {
    const result = await getViewerDepositBalance(tokenAddress);
    setDepositBalance(Number(result));
  };

  const handleClaimOrder = async () => {
    const result = await claimOrder();
    console.log("Claim Order", result);
  };

  const handleSettle = async () => {
    const result = await settleSwapBatch();
    console.log("result", result);
  };

  const handleWithdrawAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(e.target.value);
  };

  const handleDepositAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
  };

  const handleWithdraw = async () => {
    const result = await withdraw(Number(withdrawAmount), tokenAddress);
    console.log("Withdraw", result);
  };

  const handleDeposit = async () => {
    const result = await deposit(Number(depositAmount), tokenAddress);
    console.log("Deposit", result);
  };

  const handleGetLpBalance = async (
    tokenAddress1: string,
    tokenAddress2: string
  ) => {
    const result = await getViewerLpBalance(tokenAddress1, tokenAddress2);
    console.log("LP Balance", result);
    return result;
  };

  const handleRemoveLiquidity = async (
    tokenAddress1: string,
    tokenAddress2: string
  ) => {
    const result = await removeLiquidity(tokenAddress1, tokenAddress2);
    console.log("Remove Liquidity", result);
  };

  const handleClaimTestToken = async (tokenAddress: string) => {
    const result = await claimTestToken(tokenAddress);

    console.log("Claim Test Token", result);
  };

  const handleGetUnclaimedOrders = async () => {
    const result = await getUnclaimedOrders();
    setUnclaimedOrders(result);
    console.log("Unclaimed Orders", result);
  };

  useEffect(() => {
    handleGetBalanceOfEncryptedToken();
    handleGetViewerDepositTokenBalance();
    handleGetUnclaimedOrders();
    const fetchLpBalances = async () => {
      const balances = [];
      for (const liquidity of dummyLiquidity) {
        const result = await handleGetLpBalance(
          ADDRESSES[liquidity.token1],
          ADDRESSES[liquidity.token2]
        );
        console.log("LP Balance", result);
        balances.push(result);
      }
      setLpBalance(balances);
      console.log("LP Balances", balances);
    };
    fetchLpBalances();
  }, [tokenAddress]);

  return (
    <Wrapper>
      {(isPendingFugazi ||
        isPendingViewer ||
        isPendingAction ||
        isPendingGetPoolId ||
        isPendingDistributor ||
        isPendingAccount) && <Loading />}

      <Header />
      <Container>
        {/* <BalanceWrapper>
          <TextWrapper>
            <BalanceDescription>
              <ContentTitle>Check My Balance at FuGazi</ContentTitle>
              <ContentSubTitle>
                FuGazi is a service that allows you to swap tokens on the Helium
                network.
              </ContentSubTitle>
            </BalanceDescription>

            <BalanceButtonWrapper>
              <StyledButton onClick={handleGetBalanceOfEncryptedFugazi}>
                Check My Balance at Account
              </StyledButton>

              <MyBalance>My Balance : {balance}</MyBalance>
            </BalanceButtonWrapper>

            <BalanceButtonWrapper>
              <StyledButton onClick={handleGetViewerDepositFugaziBalance}>
                Check My FGZ Balance at Deposit
              </StyledButton>

              <MyBalance>My Balance : {depositBalance}</MyBalance>
            </BalanceButtonWrapper>

            <BalanceButtonWrapper>
              <StyledButton onClick={handleGetViewerDepositUsdBalance}>
                Check My USD Balance at Deposit
              </StyledButton>
              <MyBalance>My Balance : {usdBalance}</MyBalance>
            </BalanceButtonWrapper>
          </TextWrapper>
          <ClaimImageWrapper>
            <ClaimImage src={claim1} alt="claim" />
            <ClaimButton onClick={handleClaimOrder}>Claim</ClaimButton>
          </ClaimImageWrapper>
        </BalanceWrapper> */}

        <ContentWrapper>
          <ContentTitle>Token Balance</ContentTitle>
          <TokenBalanceContainer>
            <BalanceBox>
              <TokenSelect
                value={tokenName}
                onChange={(e) => {
                  setTokenAddress(
                    e.target.value === "FGZ"
                      ? FUGAZI_ADDRESS
                      : e.target.value === "USD"
                      ? USD_ADDRESS
                      : EUR_ADDRESS
                  );
                  setTokenName(e.target.value);
                }}
              >
                <TokenSelectOption value="FGZ">FGZ</TokenSelectOption>
                <TokenSelectOption value="USD">USD</TokenSelectOption>
                <TokenSelectOption value="EUR">EUR</TokenSelectOption>
              </TokenSelect>
              <TokenBalanceText>My Balance : {balance}</TokenBalanceText>
              <TokenBalanceText>
                Deposit Balance : {depositBalance}
              </TokenBalanceText>
            </BalanceBox>

            <WithdrawInputWrapper>
              <StyledInput
                type="text"
                value={withdrawAmount}
                onChange={handleWithdrawAmount}
                placeholder={`Withdraw ${tokenName} Amount`}
              />
              <TokenBalanceButton
                disabled={withdrawAmount === ""}
                onClick={handleWithdraw}
              >
                Withdraw {tokenName} from Deposit
              </TokenBalanceButton>
            </WithdrawInputWrapper>
            <WithdrawInputWrapper>
              <StyledInput
                type="text"
                value={depositAmount}
                onChange={handleDepositAmount}
                placeholder={`Deposit ${tokenName} Amount`}
              />
              <TokenBalanceButton
                disabled={depositAmount === ""}
                onClick={handleDeposit}
              >
                Deposit {tokenName} to Deposit
              </TokenBalanceButton>
            </WithdrawInputWrapper>
          </TokenBalanceContainer>
        </ContentWrapper>

        <LiquidityWrapper>
          <ContentTitle>LP Balances</ContentTitle>

          {dummyLiquidity.map((liquidity, index) => (
            <Liquidity key={index}>
              <LiquidityPair>
                <TokenLogo src={liquidity.token1Logo} alt="token-logo" />
                <TokenLogo src={liquidity.token2Logo} alt="token-logo" />
              </LiquidityPair>
              <LiquidityTitle>
                {liquidity.token1} - {liquidity.token2}
              </LiquidityTitle>
              <LiquidityAmount>
                LP Token Balance :{" "}
                {lpBalance.length > 0 ? Number(lpBalance[index]) : "loading..."}
              </LiquidityAmount>

              <WithdrawButton
                onClick={() =>
                  handleRemoveLiquidity(
                    ADDRESSES[liquidity.token1],
                    ADDRESSES[liquidity.token2]
                  )
                }
              >
                Remove Liquidity
              </WithdrawButton>
            </Liquidity>
          ))}
        </LiquidityWrapper>

        <ContentWrapper>
          <ContentTitle>UnClaimed Orders</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
          {dummyOrders.map((order, index) => (
            <Order key={index}>
              <OrderText>Pair : {order.Pair}</OrderText>
              <OrderText>Epoch : {order.Epoch}</OrderText>
              <OrderText>Time : {order.Time}</OrderText>
              <OrderButton disabled={canSettle} onClick={handleSettle}>
                {canSettle ? "Settle" : "Can't settle yet"}
              </OrderButton>
              <OrderButton>Claim</OrderButton>
            </Order>
          ))}
        </ContentWrapper>

        <ContentWrapper>
          <ContentTitle>Claim Test Token</ContentTitle>
          <TestContainer>
            <TestButton onClick={() => handleClaimTestToken(FUGAZI_ADDRESS)}>
              Claim Test FGZ
            </TestButton>
            <TestButton onClick={() => handleClaimTestToken(USD_ADDRESS)}>
              Claim Test USD
            </TestButton>
            <TestButton onClick={() => handleClaimTestToken(EUR_ADDRESS)}>
              Claim Test EUR
            </TestButton>
          </TestContainer>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col
`;

const Container = tw.div`
  flex items-center justify-center flex-col
  p-48 gap-24
`;

const BalanceWrapper = tw.div`
  flex gap-8 p-16 w-800
  bg-green-1
`;

const TextWrapper = tw.div`
  flex flex-col gap-16 justify-center
`;

const BalanceDescription = tw.div`
  flex flex-col gap-16
`;

interface TokenBalanceButtonProps {
  disabled?: boolean;
}

const TokenBalanceButton = styled.button<TokenBalanceButtonProps>(
  ({ disabled }) => [
    tw`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-48 w-300
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-3 cursor-pointer
`,
    disabled &&
      tw`bg-green-1 hover:bg-green-1 cursor-not-allowed text-gray-400`,
  ]
);

const MyBalance = tw.div`
  font-l-m
`;

const BalanceButtonWrapper = tw.div`
  flex items-center gap-8
`;

const TokenBalanceContainer = tw.div`
  flex flex-col items-center justify-between p-8 gap-8 bg-green-2
`;

const BalanceBox = tw.div`
  flex items-center justify-between p-8 gap-8 bg-green-2
`;

const TokenSelect = tw.select`
  bg-green-2
  border-solid border-2 border-green-3
  focus:(border-solid border-2 border-green-3)
  focus-visible:outline-none
  font-xl-m text-green-7
  placeholder:(text-green-1)
`;

const TokenSelectOption = tw.option`
  w-100 bg-green-2
`;

const TokenBalanceText = tw.div`
  font-xl-m  text-white
`;

const WithdrawInputWrapper = tw.div`
  flex items-center gap-8
`;

const StyledInput = tw.input`
  text-center w-250 h-40
  border-solid border-2 border-green-3
  bg-green-2
  focus:(border-solid border-2 border-green-3)
  focus-visible:outline-none
  font-xl-m text-green-7
`;

const ClaimImageWrapper = tw.div`
  flex flex-col items-center gap-8
`;

const ClaimButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36 w-150
  px-16 py-2 rounded-md 
  border-none
`;

const LiquidityWrapper = tw.div`
  flex flex-col gap-8 p-16 w-800
  bg-green-1
`;

const Liquidity = tw.div`
  flex items-center justify-between p-8 gap-8 bg-green-2
`;

const LiquidityPair = tw.div`
  flex items-center gap-8
`;

const TokenLogo = tw.img`
  w-30 h-30
`;

const LiquidityTitle = tw.div`
  font-l-m
`;

const WithdrawButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36 w-150
  px-16 py-2 rounded-md 
  border-solid border-green-3 border-2
`;

const LiquidityAmount = tw.div`
  font-l-m
`;

const ContentWrapper = tw.div`
  flex flex-col gap-16 p-16 w-800
  bg-green-1
`;

const ContentTitle = tw.div`
  font-xxl-b
`;

const ContentSubTitle = tw.div`
  font-l-m 
`;

const ClaimWrapper = tw.div`
  flex w-700 bg-green-1 items-center justify-center
  gap-16 p-48
`;

const ClaimImage = tw.img`
  w-300 h-300
`;

const Order = tw.div`
  flex items-center justify-between p-8 gap-8 bg-green-2
`;
interface orderButtonInterface {
  disabled?: boolean;
}

const OrderButton = styled.button<orderButtonInterface>(({ disabled }) => [
  tw`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-36 w-150
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-3 cursor-pointer
`,
  disabled && tw`bg-green-1 hover:bg-green-1 cursor-not-allowed text-gray-400`,
]);

const OrderText = tw.div`
  font-l-m
`;

const OrderEpoch = tw.div`
  font-l-m
`;

const TestContainer = tw.div`
  flex items-center justify-center gap-8
`;

const TestButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-48 w-200
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-3 cursor-pointer
`;

export default DashBoard;
