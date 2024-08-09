import { Header } from "../../components/header";
import tw from "twin.macro";
import { useState } from "react";
import { usePoolActionFacet } from "../../contract/pool-action-facet";
import Loading from "../../components/loading";

const PoolPage = () => {
  const [tokenXAmount, setTokenXAmount] = useState("");
  const [tokenXToken, setTokenXToken] = useState("FGZ");
  const [tokenYAmount, setTokenYAmount] = useState("");
  const [tokenYToken, setTokenYToken] = useState("USD");

  const {
    isPending: isPendingGetPoolId,
    submitSwapOrder,
    settleSwapBatch,
    addLiquidity,
  } = usePoolActionFacet();

  const handleAddLiquidity = async () => {
    await addLiquidity(
      Number(tokenXAmount),
      tokenXToken,
      Number(tokenYAmount),
      tokenYToken
    );
  };

  return (
    <Wrapper>
      {isPendingGetPoolId && <Loading />}
      <Header />
      <Container>
        <Title>Add Liquidity to Pool</Title>
        <Contents>
          <InputWrapper>
            <InputBox>
              <InputContainer>
                <InputTitle>Token X Amount</InputTitle>

                <InputDiv>
                  <StyledInput
                    type="text"
                    value={tokenXAmount}
                    onChange={(e) => setTokenXAmount(e.target.value)}
                    placeholder="Input amount"
                  />

                  <SelectedToken>{tokenXToken}</SelectedToken>
                  <TokenSelect
                    value={tokenXToken}
                    onChange={(e) => setTokenXToken(e.target.value)}
                  >
                    <TokenSelectOption value="FGZ">FGZ</TokenSelectOption>
                  </TokenSelect>
                </InputDiv>
              </InputContainer>
            </InputBox>

            <InputBox>
              <InputContainer>
                <InputTitle>Token Y Amount</InputTitle>

                <InputDiv>
                  <StyledInput
                    type="text"
                    value={tokenYAmount}
                    onChange={(e) => setTokenYAmount(e.target.value)}
                    placeholder="Input amount"
                  />

                  <SelectedToken>{tokenYToken}</SelectedToken>
                  <TokenSelect
                    value={tokenYToken}
                    onChange={(e) => setTokenYToken(e.target.value)}
                  >
                    <TokenSelectOption value="USD">USD</TokenSelectOption>
                  </TokenSelect>
                </InputDiv>
              </InputContainer>
            </InputBox>
          </InputWrapper>

          <StyledButton onClick={handleAddLiquidity}>
            Add Liquidity
          </StyledButton>
        </Contents>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const Container = tw.div`
  flex flex-col items-center p-48 gap-16
`;

const Title = tw.h1`
  text-2xl font-bold mb-4
`;

const Contents = tw.div`
  flex gap-64 items-center
`;

const InputWrapper = tw.div`
  flex flex-col gap-16
`;

const InputContainer = tw.div`
  flex flex-col gap-24 
`;

const InputDiv = tw.div`
  flex w-380 items-center justify-between
`;

const InputTitle = tw.div`
  font-xxl-b
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

const StyledButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-xl-m h-48 w-200
  px-16 py-2 rounded-md 
  border-solid border-4 border-green-3 cursor-pointer
`;

export default PoolPage;
