import React, { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import { IconDown } from "../../components/icon";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import Loading from "../../components/loading";
import { useViewer } from "../../contract/viewer";

const SwapPage = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [inputToken, setInputToken] = useState("ETH");

  const { isPending: isPendingGetPoolId, submitSwapOrder } =
    usePoolActionFacet();

  const handleSwap = async () => {
    const result = await submitSwapOrder();
    console.log("result", result);
  };

  return (
    <Wrapper>
      {isPendingGetPoolId && <Loading />}
      <Header />
      <Container>
        <Title>Swap Encrypted Tokens</Title>
        <InputWrapper>
          <InputBox>
            <InputContainer>
              <InputTitle>Sell Amount</InputTitle>

              <InputDiv>
                <StyledInput
                  type="text"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Input amount"
                />

                <SelectedToken>{inputToken}</SelectedToken>
                <TokenSelect
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                >
                  <TokenSelectOption value="ETH">ETH</TokenSelectOption>
                  <TokenSelectOption value="DAI">DAI</TokenSelectOption>
                  <TokenSelectOption value="USDC">USDC</TokenSelectOption>
                </TokenSelect>
              </InputDiv>
            </InputContainer>
          </InputBox>
        </InputWrapper>
        <SwapButton onClick={handleSwap}>Swap</SwapButton>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const Container = tw.div`
  flex flex-col items-center justify-center p-48 gap-12
`;

const Title = tw.h1`
  text-2xl font-bold mb-4
`;

const InputWrapper = tw.div`
  flex flex-col items-center gap-12
  
`;

const InputContainer = tw.div`
  flex flex-col gap-24 
`;

const InputDiv = tw.div`
  flex w-380 items-center justify-between
`;

const InputTitle = tw.div`
  font-xxl-l 
`;

const InputBox = tw.div`
  flex items-center w-400 p-48
  border-solid border-5 border-green-3 rounded-lg p-2
  bg-green-1
`;

const StyledInput = tw.input`
  text-center w-250 h-60
  border-solid border-2 border-green-2
  bg-green-2
  focus:(border-solid border-2 border-green-3)
  focus-visible:outline-none
  font-xl-m text-green-7
  
`;

const TokenSelect = tw.select`
  bg-green-2
  border-solid border-2 border-green-2
  focus:(border-solid border-2 border-green-3)
  focus-visible:outline-none
  font-xl-m text-green-7
  placeholder:(text-green-1)
`;

const TokenSelectOption = tw.option`
  w-100 bg-green-2
`;

const SelectedToken = tw.div`
  flex font-xxl-l text-green-1 p-2
`;

const SwitchButton = tw.button`
  p-2 rounded-full bg-green-2 hover:bg-green-3 border-none
`;

const SwapButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-48 w-200
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-3 cursor-pointer
`;

const OutputText = tw.div`
  mt-4 text-lg
`;

export default SwapPage;
