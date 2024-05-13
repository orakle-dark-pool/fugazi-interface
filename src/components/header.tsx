import { useEffect, useState } from "react";
import tw from "twin.macro";
import { formatEther } from "viem";
import { switchChain } from "@wagmi/core";
import { useConnect, useAccount, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { config } from "../configs/fhenix-config";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [isItFhenixNetwork, setIsItFhenixNetwork] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkChain = async () => {
      if (isConnected) {
        console.log("Connected");
      }
      try {
        const isFhenix = await switchChain(config, { chainId: 42069 });

        setIsItFhenixNetwork(isFhenix);
      } catch (error) {
        console.error("Chain switching failed", error);
      }
    };

    checkChain();
  }, [isConnected]);

  return (
    <Wrapper>
      <Title>FuGazi</Title>
      <NavItem onClick={() => navigate("/swap")}>Swap</NavItem>

      {!isConnected ? (
        <ConnectButton
          onClick={() =>
            connect({
              connector: injected(),
            })
          }
        >
          Connect
        </ConnectButton>
      ) : (
        <ConnectButton onClick={() => disconnect()}>Disconnect</ConnectButton>
      )}
      {isConnected && (
        <>
          <StyledDiv>Address: {address}</StyledDiv>
          <StyledDiv>symbol: {balance?.symbol}</StyledDiv>
          <StyledDiv>
            Balance:{" "}
            {balance?.value ? formatEther(balance.value) : "Loading..."}
          </StyledDiv>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex items-center px-16
  gap-16 bg-green-300 h-64
`;

const Title = tw.h1`
  text-2xl font-semibold text-white
`;

const NavItem = tw.div`
  text-white font-semibold bg-none
  border-none cursor-pointer
`;

const ConnectButton = tw.button`
  bg-green-200 hover:bg-green-100 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-none
`;

const StyledDiv = tw.div`
  font-l-b text-white
`;
