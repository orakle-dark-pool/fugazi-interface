import { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import Loading from "../../components/loading";
import styled from "@emotion/styled/macro";
import { IconDown } from "../../components/icon";

const SwapPage = () => {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("FGZ");
  const [outputToken, setOutputToken] = useState<string>("USD");
  const [noiseLevel, setNoiseLevel] = useState<number>(0);

  const {
    isPending: isPendingGetPoolId,
    submitSwapOrder,
    settleSwapBatch,
  } = usePoolActionFacet();

  const handleTokenChange = (token: string) => {
    setInputToken(token);
    setOutputToken(token === "FGZ" ? "USD" : "FGZ");
  };

  const handleSwap = async () => {
    const result = await submitSwapOrder(Number(inputAmount), inputToken);
    console.log("result", result);
  };

  // const handleSettle = async () => {
  //   const result = await settleSwapBatch();
  //   console.log("result", result);
  // };

  return (
    <Wrapper>
      {isPendingGetPoolId && <Loading />}
      <Header />
      <Container>
        <Title>Swap Encrypted Tokens</Title>
        <InputWrapper>
          <InputBox>
            <InputContainer>
              <TokenContainer>
                <TokenBox>
                  <TokenText>
                    Sell Token <strong>{inputToken}</strong>
                  </TokenText>
                </TokenBox>
                <ArrowRight color="white" />
                <TokenBox>
                  <TokenText>
                    Buy Token <strong>{outputToken}</strong>
                  </TokenText>
                </TokenBox>
              </TokenContainer>

              <SwapHeadContainer>
                <InputTitle>Sell Amount</InputTitle>

                <NoiseContainer>
                  <NoiseText>Noise</NoiseText>
                  <Noise
                    type="range"
                    min="0"
                    max="100"
                    value={noiseLevel}
                    onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  />
                  <NoiseLevel>{noiseLevel}</NoiseLevel>
                </NoiseContainer>
              </SwapHeadContainer>

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
                  onChange={(e) => handleTokenChange(e.target.value)}
                >
                  <TokenSelectOption value="FGZ">FGZ</TokenSelectOption>
                  <TokenSelectOption value="USD">USD</TokenSelectOption>
                </TokenSelect>
              </InputDiv>
            </InputContainer>
          </InputBox>
        </InputWrapper>
        <SwapButton disabled={!inputAmount} onClick={handleSwap}>
          {!inputAmount ? "Type Amount First" : "Submit Order"}
        </SwapButton>
        {/* <SwapButton onClick={handleSettle}>Settle Batch FGZ - USD</SwapButton> */}
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

const TokenContainer = tw.div`
  flex items-center justify-between w-full
`;

const TokenBox = tw.div`
  flex flex-col items-center justify-center
  bg-green-2 rounded-lg p-12
`;

const ArrowRight = styled(IconDown)`
  transform: rotate(-90deg);
`;

const TokenText = tw.div`
  font-xl-m text-green-7
`;

const InputContainer = tw.div`
  flex flex-col gap-24 
`;

const InputDiv = tw.div`
  flex w-380 items-center justify-between
`;

const SwapHeadContainer = tw.div`
  flex items-center justify-between 
`;

const InputTitle = tw.div`
  flex font-xxl-b text-green-7 w-full
`;

const NoiseContainer = tw.div`
  flex items-center w-full gap-4
`;

const NoiseText = tw.div`
  flex font-xxl-l text-green-7 
`;

const Noise = styled.input`
  ${tw`h-10`}
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background: ${tw`bg-green-2`};

  &::-webkit-slider-thumb {
    ${tw`bg-green-3`}
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  &::-moz-range-thumb {
    ${tw`bg-green-3`}
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const NoiseLevel = tw.div`
  flex font-xxl-l text-green-7 
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

interface SwapButtonProps {
  disabled?: boolean;
}

const SwapButton = styled.button<SwapButtonProps>(({ disabled }) => [
  tw`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-48 w-300
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-3 cursor-pointer
`,
  disabled && tw`bg-green-1 hover:bg-green-1 cursor-not-allowed text-gray-400`,
]);

export default SwapPage;
