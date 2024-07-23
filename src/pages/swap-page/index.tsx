import { useState } from "react";
import { Header } from "../../components/header";
import tw from "twin.macro";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import Loading from "../../components/loading";
import styled from "@emotion/styled/macro";

const SwapPage = () => {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("FGZ");

  const {
    isPending: isPendingGetPoolId,
    submitSwapOrder,
    settleSwapBatch,
  } = usePoolActionFacet();

  const handleSwap = async () => {
    const result = await submitSwapOrder(Number(inputAmount), inputToken);
    console.log("result", result);
  };

  const handleSettle = async () => {
    const result = await settleSwapBatch();
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
                  <TokenSelectOption value="FGZ">FGZ</TokenSelectOption>
                  <TokenSelectOption value="USD">USD</TokenSelectOption>
                </TokenSelect>
              </InputDiv>
            </InputContainer>
          </InputBox>
        </InputWrapper>
        <SwapButton disabled={!inputAmount} onClick={handleSwap}>
          {!inputAmount
            ? "Type Amount First"
            : inputToken === "FGZ"
            ? "Swap FGZ -> USD"
            : "Swap USD -> FGZ"}
        </SwapButton>
        <SwapButton onClick={handleSettle}>Settle Batch FGZ - USD</SwapButton>
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
