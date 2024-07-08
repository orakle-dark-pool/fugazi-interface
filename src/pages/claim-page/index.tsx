import { Header } from "../../components/header";
import tw from "twin.macro";
import claim1 from "../../assets/claim-1.png";

const ClaimPage = () => {
  return (
    <Wrapper>
      <Header />
      <Container>
        <div>ClaimPage</div>
        <ClaimWrapper>
          <ClaimText>
            <ClaimTitle>Claim Your Balance</ClaimTitle>
            <ClaimSubTitle>
              Please claim your balance by clicking the button below
            </ClaimSubTitle>
            <ClaimButton>Claim</ClaimButton>
          </ClaimText>
          <ClaimImage src={claim1} alt="claim-1" />
        </ClaimWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const Container = tw.div`
  flex flex-col items-center gap-16
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

export default ClaimPage;
