import { Header } from "../../components/header";
import tw from "twin.macro";

const DashBoard = () => {
  return (
    <Wrapper>
      <Header />
      <Container>
        <ContentWrapper>
          <ContentTitle>Check My Balance at FuGazi</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
        </ContentWrapper>
        <ContentWrapper>
          <ContentTitle>My Liquidity Pool</ContentTitle>
          <ContentSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ContentSubTitle>
        </ContentWrapper>
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
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const Container = tw.div`
  flex items-center justify-center flex-col
  p-48 gap-24
`;

const ContentWrapper = tw.div`
  flex flex-col gap-8 p-16 w-600
  bg-green-2
`;

const ContentTitle = tw.div`
  font-xl-m 
`;

const ContentSubTitle = tw.div`
  font-l-m 
`;

export default DashBoard;
