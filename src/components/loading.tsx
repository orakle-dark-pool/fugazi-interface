import tw from "twin.macro";
import loading from "../assets/loading-circle.json";
import Lottie from "lottie-react";

const Loading = () => {
  return (
    <Wrapper>
      <Lottie
        animationData={loading}
        style={{ width: "100px", height: "100px" }}
      />
    </Wrapper>
  );
};

const Wrapper = tw.div`
  fixed flex min-h-screen w-full h-full absolute-center bg-black bg-opacity-50
  flex-center
`;

export default Loading;
