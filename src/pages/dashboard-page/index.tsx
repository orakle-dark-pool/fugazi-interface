import { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import claim1 from "../../assets/claim-1.png";
import Loading from "../../components/loading";
import { useFugazi } from "../../contract/fugazi";
import { useViewer } from "../../contract/viewer";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import { FUGAZI_ADDRESS, USD_ADDRESS } from "../../assets/address";
import { useAccountContract } from "../../contract/account";
import usdLogo from "../../assets/usd.png";
import fgzLogo from "../../assets/logo.png";

const DashBoard = () => {
  const [balance, setBalance] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const { isPending: isPendingFugazi, getBalanceOfEncryptedFugazi } =
    useFugazi();

  const { isPending: isPendingViewer, getViewerDepositBalance } = useViewer();

  const { isPending: isPendingAction, claimOrder } = usePoolActionFacet();

  const { isPending: isPendingAccount, withdraw } = useAccountContract();

  const handleGetBalanceOfEncryptedFugazi = async () => {
    const result = await getBalanceOfEncryptedFugazi();
    setBalance(Number(result));
  };

  const handleGetViewerDepositFugaziBalance = async () => {
    const result = await getViewerDepositBalance(FUGAZI_ADDRESS);
    setDepositBalance(Number(result));
  };

  const handleGetViewerDepositUsdBalance = async () => {
    const result = await getViewerDepositBalance(USD_ADDRESS);
    setUsdBalance(Number(result));
  };

  const handleClaimOrder = async () => {
    const result = await claimOrder();
    console.log("Claim Order", result);
  };

  const handleWithdraw = async () => {
    const result = await withdraw(Number(withdrawAmount));
    console.log("Withdraw", result);
  };

  const handleWithdrawAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(e.target.value);
  };

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
      token2: "USD",
      token1Logo: fgzLogo,
      token2Logo: usdLogo,
      amount: 0,
    },
  ];

  const dummyOrders = [
    {
      Pair: "FGZ-USD",
      Epoch: 1,
      Type: "Buy",
      Time: "2021-01-01 12:00:00",
    },
    {
      Pair: "FGZ-USD",
      Epoch: 2,
      Type: "Sell",
      Time: "2021-01-01 12:00:00",
    },
  ];

  return (
    <Wrapper>
      {isPendingFugazi ||
        isPendingViewer ||
        isPendingAction ||
        (isPendingAccount && <Loading />)}

      <Header />
      <Container>
        <BalanceWrapper>
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
                Check My FGZ Balance at Account
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
        </BalanceWrapper>

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
                {liquidity.amount} {liquidity.token1}
              </LiquidityAmount>
              <LiquidityAmount>
                {liquidity.amount} {liquidity.token2}
              </LiquidityAmount>
              <WithdrawButton>Withdraw</WithdrawButton>
            </Liquidity>
          ))}
        </LiquidityWrapper>

        <ContentWrapper>
          <ContentTitle>Withdraw Balance</ContentTitle>
          <ContentSubTitle>
            Withdraw your FGZ balance from Deposit
          </ContentSubTitle>
          <WithdrawInputWrapper>
            <StyledInput
              type="text"
              value={withdrawAmount}
              onChange={handleWithdrawAmount}
              placeholder="Withdraw FGZ Amount"
            />
            <StyledButton onClick={handleWithdraw}>
              Withdraw FGZ from Deposit
            </StyledButton>
          </WithdrawInputWrapper>
        </ContentWrapper>

        <ContentWrapper>
          <ContentTitle>My Orders</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
          {dummyOrders.map((order, index) => (
            <Order key={index}>
              <OrderText>Pair : {order.Pair}</OrderText>
              <OrderText>Epoch : {order.Epoch}</OrderText>
              <OrderText>Type : {order.Type}</OrderText>
              <OrderText>Time : {order.Time}</OrderText>
              <OrderButton>Settle & Claim</OrderButton>
            </Order>
          ))}
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

const StyledButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-none
`;

const MyBalance = tw.div`
  font-l-m
`;

const BalanceButtonWrapper = tw.div`
  flex items-center gap-8
`;

const WithdrawInputWrapper = tw.div`
  flex items-center gap-8
`;

const WithdrawInputLabel = tw.div`
  font-l-m
`;
const StyledInput = tw.input`
  text-center w-250 h-40
  border-solid border-2 border-green-2
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

const OrderButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36 w-150
  px-16 py-2 rounded-md 
  border-solid border-green-3 border-2
`;

const OrderText = tw.div`
  font-l-m
`;

const OrderEpoch = tw.div`
  font-l-m
`;

export default DashBoard;
