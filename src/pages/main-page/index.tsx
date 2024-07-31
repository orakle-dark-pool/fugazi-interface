import tw from "twin.macro";
import { Header } from "../../components/header";

import logo from "../../assets/logo.png";
import main1 from "../../assets/main-1.png";

const MainPage = () => {
  return (
    <Wrapper>
      <Header />
      <Body>
        <ServiceDescription>
          <LogoImage src={logo} />
          <TextBox>
            <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
            <ServiceDescriptionSubTitle>
              We are the Most Authentic and the Most Secure Dark Pool
            </ServiceDescriptionSubTitle>
          </TextBox>
        </ServiceDescription>

        {/* <ServiceDescription>
        <TextBox>
          <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
          <ServiceDescriptionSubTitle>
            Fugazi is the first fully on-chain dark pool on Fhenix
          </ServiceDescriptionSubTitle>
        </TextBox>
        <LogoImage src={main1} />
      </ServiceDescription> */}
      </Body>
    </Wrapper>
  );
};

export default MainPage;

const Wrapper = tw.div`
  flex flex-col h-screen gap-48
`;

const Body = tw.div`
  flex flex-col h-full justify-center items-center
`;

const ServiceDescription = tw.div`
  flex flex-col w-full justify-center items-center gap-12
`;

const LogoImage = tw.img`
  w-300 object-contain
`;

const TextBox = tw.div`
  flex flex-col gap-24 text-center
`;

const ServiceDescriptionTitle = tw.div`
  text-80 font-bold
`;

const ServiceDescriptionSubTitle = tw.div`
  text-40 font-semibold
`;
