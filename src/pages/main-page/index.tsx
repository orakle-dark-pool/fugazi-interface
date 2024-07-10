import tw from "twin.macro";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { Header } from "../../components/header";
import {
  EncryptedUint32,
  EncryptionTypes,
  FhenixClient,
  Permit,
  getPermit,
} from "fhenixjs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Loading from "../../components/loading.tsx";
import { useFhErc20 } from "../../contract/fh-erc20.ts";
import { useCounter } from "../../contract/counter.ts";
import logo from "../../assets/logo.png";
import main1 from "../../assets/main-1.png";
import { useViewer } from "../../contract/viewer.ts";
import { useFugazi } from "../../contract/fugazi.ts";
import { useAccountContract } from "../../contract/account.ts";

const MainPage = () => {
  //const { isItFhenixNetwork, balance, address, fnxConnect } = useChain();

  const [encrypted, setEncrypted] = useState<any | undefined>(undefined);
  const [permit, setPermit] = useState<Permit | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  //const provider = new BrowserProvider(window.ethereum);
  const provider = new JsonRpcProvider("https://api.helium.fhenix.zone/");
  const client = new FhenixClient({ provider });

  const [balanceOfEncryptedFugazi, setBalanceOfEncryptedFugazi] = useState<
    number | undefined
  >(undefined);

  const {
    isPending: isPendingViewer,
    getViewerPermission,
    getViewerBalance,
  } = useViewer({
    encrypted,
  });

  const {
    isPending: isPendingFugazi,
    approveFugazi,
    getBalanceOfEncryptedFugazi,
  } = useFugazi({
    encrypted,
  });

  const { isPending: isPendingAccount, withdraw } = useAccountContract();

  useEffect(() => {
    if (isConnected) {
      console.log("Connected");
    }
    const encrypt = async () => {
      const result: EncryptedUint32 = await client.encrypt(
        1,
        EncryptionTypes.uint32
      );
      const decoder = new TextDecoder("utf-8");
      const decrypted = decoder.decode(result.data);
      setEncrypted(decrypted);
      console.log("Encrypted", result);
      setEncrypted(result);
    };
    encrypt();
  }, []);

  const handleDecryptBalance = async () => {
    if (!encrypted) {
      console.error("Encrypted data is not available");
      return;
    }
    try {
      const plaintext = await client.unseal(address, encrypted);
      console.log("Decrypted", plaintext.toString());
    } catch (error) {
      console.error("Error during decryption", error);
    }
  };

  const handleGetViewerPermission = async () => {
    const result = await getViewerPermission();
    console.log("Result", result);
  };

  const handleGetViewerBalance = async () => {
    const result = await getViewerBalance();
    console.log("Result", result);
  };

  const handleApproveFugazi = async () => {
    const result = await approveFugazi();
    console.log("Result", result);
  };

  const handleWithdraw = async () => {
    const result = await withdraw();
    console.log("Result", result);
  };

  const handleGetBalanceOfEncryptedFugazi = async () => {
    const result = await getBalanceOfEncryptedFugazi();
    console.log("Result", result);
    const unsealed = client.unseal(
      "0x0E3EaCFB2a7b171913840Cb66DE455FCD982FD77",
      result
    );
    console.log("Unsealed", unsealed);
    setBalanceOfEncryptedFugazi(Number(unsealed));
  };

  return (
    <Wrapper>
      {/* {isPending || isPendingCounter || (isLoading && <Loading />)} */}
      <Header />

      {/* <StyledDiv>Is Pending: {isPending.toString()}</StyledDiv> */}
      {/* <StyledDiv>Hash: {hash ? hash : "Loading..."}</StyledDiv> */}
      {/* <StyledButton onClick={getPermitfromWallet}>Get Permit</StyledButton>
      <StyledButton onClick={handleGetCounterPermission}>
        Get Counter Permission
      </StyledButton>
      <StyledButton onClick={() => getMintEncrypted()}>
        Mint Encrypted
      </StyledButton>
      <StyledButton onClick={() => handleGetEncryptedBalance()}>
        Get Balance Of Encrypted
      </StyledButton>
      <StyledButton onClick={handleDecryptBalance}>
        decrypt Balance
      </StyledButton>
      <StyledButton onClick={handleAddCounter}>Add Counter</StyledButton>
      <StyledButton onClick={handleGetCounter}>Get Counter</StyledButton> */}
      <StyledButton onClick={handleGetViewerPermission}>
        Get Viewer Permission
      </StyledButton>
      <StyledButton onClick={handleGetViewerBalance}>
        Get Viewer Balance
      </StyledButton>
      <StyledButton onClick={handleApproveFugazi}>Approve Fugazi</StyledButton>
      <StyledButton onClick={handleWithdraw}>Withdraw</StyledButton>
      <StyledButton onClick={handleGetBalanceOfEncryptedFugazi}>
        Get Balance Of Encrypted Fugazi
      </StyledButton>
      <StyledDiv>
        Balance Of Encrypted Fugazi: {balanceOfEncryptedFugazi}
      </StyledDiv>
      <ServiceDescription>
        <LogoImage src={logo} />
        <TextBox>
          <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
          <ServiceDescriptionSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ServiceDescriptionSubTitle>
        </TextBox>
      </ServiceDescription>

      <ServiceDescription>
        <TextBox>
          <ServiceDescriptionTitle>FuGazi</ServiceDescriptionTitle>
          <ServiceDescriptionSubTitle>
            FuGazi is a service that allows you to swap tokens on the Helium
            network.
          </ServiceDescriptionSubTitle>
        </TextBox>
        <LogoImage src={main1} />
      </ServiceDescription>
    </Wrapper>
  );
};

// const encrypt = async () => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const client = new FhenixClient({ provider });
//     const contract = new ethers.Contract(
//       "0x0165878A594ca255338adfa4d48449f69242Ee9d",
//       NFT_ABI,
//       provider.getSigner()
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

export default MainPage;

const Wrapper = tw.div`
  flex flex-col
`;

const StyledDiv = tw.div`
  text-lg p-32
`;

const StyledButton = tw.button`
  w-200
  bg-green-2 hover:bg-green-3 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-2
`;

const ServiceDescription = tw.div`
  flex w-full justify-center items-center gap-48
`;

const LogoImage = tw.img`
  w-400
`;

const TextBox = tw.div`
  flex flex-col gap-24
`;

const ServiceDescriptionTitle = tw.div`
  font-xxxl-b 
`;

const ServiceDescriptionSubTitle = tw.div`
  font-xxl-l 
`;
