import tw from "twin.macro";
import Logo from "../assets/logo-color.jpeg";

export const Loading = () => {
  return (
    <Wrapper>
      <ErrorBox>
        <LogoImg src={Logo} alt="logo" />
        <ErrorText>Loading...</ErrorText>
      </ErrorBox>
    </Wrapper>
  );
};

export default Loading;

const Wrapper = tw.div`
  w-screen h-screen
  flex-center absolute
  bg-gray-400 bg-opacity-50

`;

const ErrorBox = tw.div`
  absolute absolute-center w-full h-full flex-center flex-col
`;

const LogoImg = tw.img`
  w-300 h-300 animate-bounce
`;

const ErrorText = tw.div`
 w-200 font-xxl-b text-white text-center
`;
