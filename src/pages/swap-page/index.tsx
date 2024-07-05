import React, { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import { IconDown } from "../../components/icon";

const SwapPage = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [inputToken, setInputToken] = useState("ETH");
  const [outputToken, setOutputToken] = useState("DAI");

  const handleSwap = async () => {};

  const handleTokenSwitch = () => {
    const tempAmount = inputAmount;
    const tempToken = inputToken;
    setInputAmount(outputAmount);
    setOutputAmount(tempAmount);
    setInputToken(outputToken);
    setOutputToken(tempToken);
  };

  return (
    <Wrapper>
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
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </TokenSelect>
              </InputDiv>
            </InputContainer>
          </InputBox>

          <SwitchButton onClick={handleTokenSwitch}>
            <IconDown color="#1BC4C9" style={{ cursor: "pointer" }} />
          </SwitchButton>

          <InputBox>
            <InputContainer>
              <InputTitle>Buy Amount</InputTitle>
              <InputDiv>
                <StyledInput
                  type="text"
                  value={outputAmount}
                  onChange={(e) => setOutputAmount(e.target.value)}
                  placeholder="Output amount"
                />
                <SelectedToken>{outputToken}</SelectedToken>

                <TokenSelect
                  value={outputToken}
                  onChange={(e) => setOutputToken(e.target.value)}
                >
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </TokenSelect>
              </InputDiv>
            </InputContainer>
          </InputBox>
        </InputWrapper>
        <SwapButton onClick={handleSwap}>Swap</SwapButton>
        <OutputText>Output Amount: {outputAmount}</OutputText>
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
  flex flex-col gap-4 p-8
`;

const InputDiv = tw.div`
  flex items-center gap-16
`;

const InputTitle = tw.div`
  font-xl-m text-green-1
`;

const InputBox = tw.div`
  flex items-center w-500 h-150 border-solid border-3 border-green-1 rounded-lg p-2
`;

const StyledInput = tw.input`
  text-center w-250 h-100
  border-solid border-2 border-green-1
  bg-transparent
  focus:(border-solid border-2 border-green-6)
  focus-visible:outline-none
  font-xl-m text-green-7
  placeholder:(text-green-1)
`;

const TokenSelect = tw.select`
  w-100 
  border-solid border-2 border-green-1
  focus:(border-solid border-2 border-green-6)
  focus-visible:outline-none
  bg-transparent
  font-xl-m text-green-7
  placeholder:(text-green-1)
`;

const SelectedToken = tw.div`
  flex font-xxl-l text-green-1 p-2
`;

const SwitchButton = tw.button`
  p-2 rounded-full bg-green-2 hover:bg-green-3 border-none
`;

const SwapButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-none
`;

const OutputText = tw.div`
  mt-4 text-lg
`;

export default SwapPage;
