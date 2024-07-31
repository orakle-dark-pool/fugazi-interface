import { useEffect, useState } from "react";
import tw from "twin.macro";
import { formatEther } from "viem";
import { switchChain } from "@wagmi/core";
import { useConnect, useAccount, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { newTestFhenixConfig } from "../configs/fhenix-config";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import styled from "@emotion/styled/macro";
import { truncateAddress } from "../utils/string";

export const Header = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [isItFhenixNetwork, setIsItFhenixNetwork] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const checkChain = async () => {
      if (isConnected) {
        console.log("Connected");
      }
      try {
        //const isFhenix = await switchChain(config, { chainId: 42069 });
        const isFhenix = await switchChain(newTestFhenixConfig, {
          chainId: 8008135,
        });
        setIsItFhenixNetwork(isFhenix);
      } catch (error) {
        console.error("Chain switching failed", error);
      }
    };

    checkChain();
  }, [isConnected]);

  return (
    <Wrapper>
      <ForwardContainer>
        <LogoBox>
          <Logo src={logo} />
          <Title onClick={() => navigate("/")}>FuGazi</Title>
        </LogoBox>

        <NavItem
          onClick={() => navigate("/swap")}
          active={pathname === "/swap"}
        >
          Swap
        </NavItem>
        <NavItem
          onClick={() => navigate("/pool")}
          active={pathname === "/pool"}
        >
          Pool
        </NavItem>
        <NavItem
          onClick={() => navigate("/dashboard")}
          active={pathname === "/dashboard"}
        >
          Dashboard
        </NavItem>
      </ForwardContainer>
      <BackwardContainer>
        {isConnected && (
          <>
            <StyledDiv>Address: {truncateAddress(address)}</StyledDiv>
            <StyledDiv>symbol: {balance?.symbol}</StyledDiv>
            <StyledDiv>
              Balance:{" "}
              {balance?.value ? formatEther(balance.value) : "Loading..."}
            </StyledDiv>
          </>
        )}
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
      </BackwardContainer>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex items-center justify-between px-16
  gap-16 bg-green-1 h-64
`;

const ForwardContainer = tw.div`
  flex items-center gap-16
`;

const BackwardContainer = tw.div`
  flex items-center gap-16
`;

const LogoBox = tw.div`
  flex items-center  gap-8
`;

const Logo = tw.img`
  w-30
`;

const Title = tw.h1`
  text-2xl font-semibold text-white cursor-pointer
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.div<NavItemProps>(({ active }) => [
  tw`
  text-white font-semibold bg-none
  border-solid border-2 border-green-2 cursor-pointer
  hover:bg-green-3 px-16 py-8 rounded-md
`,
  active && tw`bg-green-3`,
]);

const ConnectButton = tw.button`
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-none
`;

const StyledDiv = tw.div`
  font-l-b text-white
`;
