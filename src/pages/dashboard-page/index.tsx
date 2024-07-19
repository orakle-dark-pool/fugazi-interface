import { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import claim1 from "../../assets/claim-1.png";
import Loading from "../../components/loading";
import { useFugazi } from "../../contract/fugazi";
import { useViewer } from "../../contract/viewer";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import { FUGAZI_ADDRESS, USD_ADDRESS } from "../../assets/address";

const DashBoard = () => {
  const [balance, setBalance] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [testLoading, setTestLoading] = useState(false);

  const {
    isPending: isPendingFugazi,
    approveFugazi,
    getBalanceOfEncryptedFugazi,
  } = useFugazi();

  const { isPending: isPendingViewer, getViewerDepositBalance } = useViewer();

  const { isPending: isPendingAction, claimOrder } = usePoolActionFacet();

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

  const dummyLiquidity = [
    {
      token: "FGZ",
      amount: 0,
    },
    {
      token: "USD",
      amount: 0,
    },
  ];

  return (
    <Wrapper>
      {isPendingFugazi || isPendingViewer || (isPendingAction && <Loading />)}
      {testLoading && <Loading />}
      <Header />
      <Container>
        <BalanceWrapper>
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
              Check My Deposit Balance at Fugazi
            </StyledButton>

            <MyBalance>My Balance : {depositBalance}</MyBalance>
          </BalanceButtonWrapper>

          <BalanceButtonWrapper>
            <StyledButton onClick={handleGetViewerDepositUsdBalance}>
              Check My Deposit Balance at USD
            </StyledButton>
            <MyBalance>My Balance : {usdBalance}</MyBalance>
          </BalanceButtonWrapper>
        </BalanceWrapper>
        <LiquidityWrapper>
          <ContentTitle>My Liquidity Pool</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>

          {dummyLiquidity.map((liquidity, index) => (
            <Liquidity key={index}>
              <LiquidityTitle>{liquidity.token}</LiquidityTitle>
              <LiquidityAmount>{liquidity.amount}</LiquidityAmount>
            </Liquidity>
          ))}
        </LiquidityWrapper>
        <ContentWrapper>
          <ContentTitle>Claimed Balance</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
        </ContentWrapper>
        <ContentWrapper>
          <ContentTitle>Transaction History</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
        </ContentWrapper>

        <ClaimWrapper>
          <ClaimText>
            <ClaimTitle>Claim Your Balance</ClaimTitle>
            <ClaimSubTitle>
              Please claim your balance by clicking the button below
            </ClaimSubTitle>
            <ClaimButton onClick={handleClaimOrder}>Claim</ClaimButton>
          </ClaimText>
          <ClaimImage src={claim1} alt="claim-1" />
        </ClaimWrapper>
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
  flex flex-col gap-8 p-16 w-600
  bg-green-1
`;

const BalanceDescription = tw.div`
  flex flex-col gap-4
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

const LiquidityWrapper = tw.div`
  flex flex-col gap-8 p-16 w-600
  bg-green-1
`;

const Liquidity = tw.div`
  flex items-center p-8 gap-8 bg-green-2
`;

const LiquidityTitle = tw.div`
  font-l-m
`;

const LiquidityAmount = tw.div`
  font-l-m
`;

const ContentWrapper = tw.div`
  flex flex-col gap-8 p-16 w-600
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

const ClaimText = tw.div`
  flex flex-col gap-16
`;

const ClaimTitle = tw.div`
  font-xl-m 
`;

const ClaimSubTitle = tw.div`
  font-l-m 
`;

const ClaimButton = tw.button`
  w-200
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-2
`;

export default DashBoard;
