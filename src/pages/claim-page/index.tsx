import React from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";

const ClaimPage = () => {
  return (
    <Wrapper>
      <Header />
      <div>ClaimPage</div>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

export default ClaimPage;
