import React from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";

const SwapPage = () => {
  return (
    <Wrapper>
      <Header />
      <div>SwapPage</div>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

export default SwapPage;
