import tw from "twin.macro";
import { Header } from "../../components/header";

import logo from "../../assets/logo.png";
import main1 from "../../assets/main-1.png";

const MainPage = () => {
  return (
    <Wrapper>
      <Header />

      <ServiceDescription>
        <LogoImage src={logo} />
        <TextBox>
          <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
          <ServiceDescriptionSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ServiceDescriptionSubTitle>
        </TextBox>
      </ServiceDescription>

      <ServiceDescription>
        <TextBox>
          <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
          <ServiceDescriptionSubTitle>
            Fugazi is the first fully on-chain dark pool on Fhenix
          </ServiceDescriptionSubTitle>
        </TextBox>
        <LogoImage src={main1} />
      </ServiceDescription>
    </Wrapper>
  );
};

export default MainPage;

const Wrapper = tw.div`
  flex flex-col
`;

const ServiceDescription = tw.div`
  flex w-full justify-center items-center gap-48
`;

const LogoImage = tw.img`
  w-400
`;

const TextBox = tw.div`
  flex flex-col gap-24
`;

const ServiceDescriptionTitle = tw.div`
  font-xxxl-b 
`;

const ServiceDescriptionSubTitle = tw.div`
  font-xxl-l 
`;
