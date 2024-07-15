import { Header } from "../../components/header";
import tw from "twin.macro";
import { useState } from "react";

const PoolPage = () => {
  const [tokenXAmount, setTokenXAmount] = useState("");
  const [tokenXToken, setTokenXToken] = useState("ETH");
  const [tokenYAmount, setTokenYAmount] = useState("");
  const [tokenYToken, setTokenYToken] = useState("ETH");

  return (
    <Wrapper>
      <Header />
      <Container>
        <Title>Add Liquidity to Pool</Title>
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
                <TokenSelectOption value="ETH">ETH</TokenSelectOption>
                <TokenSelectOption value="DAI">DAI</TokenSelectOption>
                <TokenSelectOption value="USDC">USDC</TokenSelectOption>
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
                <TokenSelectOption value="ETH">ETH</TokenSelectOption>
                <TokenSelectOption value="DAI">DAI</TokenSelectOption>
                <TokenSelectOption value="USDC">USDC</TokenSelectOption>
              </TokenSelect>
            </InputDiv>
          </InputContainer>
        </InputBox>
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

export default PoolPage;
