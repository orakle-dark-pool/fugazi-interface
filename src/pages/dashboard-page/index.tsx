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
            <ClaimImage src={claim1} alt="claim-1" />
            <ClaimButton onClick={handleClaimOrder}>Claim</ClaimButton>
          </ClaimImageWrapper>
        </BalanceWrapper>

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
          <ContentTitle>Transaction History</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
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
  flex flex-col gap-16 p-16 w-600
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

export default DashBoard;
