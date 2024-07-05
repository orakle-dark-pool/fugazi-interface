import { Header } from "../../components/header";
import tw from "twin.macro";
import claim1 from "../../assets/claim-1.png";

const ClaimPage = () => {
  return (
    <Wrapper>
      <Header />
      <div>ClaimPage</div>
      <ClaimWrapper>
        <ClaimImage src={claim1} alt="claim-1" />
        <ClaimText>
          <ClaimTitle>Claim Your Balance</ClaimTitle>
          <ClaimSubTitle>
            Please claim your balance by clicking the button below
          </ClaimSubTitle>
          <ClaimButton>Claim</ClaimButton>
        </ClaimText>
      </ClaimWrapper>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const ClaimWrapper = tw.div`
  flex w-full bg-green-1 items-center justify-center
`;

const ClaimImage = tw.img`
  w-300 h-300
`;

const ClaimText = tw.div`
  flex flex-col gap-4
`;

const ClaimTitle = tw.div`
  font-xl-m text-green-6
`;

const ClaimSubTitle = tw.div`
  font-l-m text-green-4
`;

const ClaimButton = tw.button`
  w-200
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-2
`;

export default ClaimPage;
