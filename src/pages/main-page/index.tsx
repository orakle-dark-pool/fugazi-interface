import tw from "twin.macro";
import { BrowserProvider, ethers, JsonRpcProvider } from "ethers";
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

const MainPage = () => {
  //const { isItFhenixNetwork, balance, address, fnxConnect } = useChain();

  const [encrypted, setEncrypted] = useState<any | undefined>(undefined);
  const [permit, setPermit] = useState<Permit | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  //const provider = new BrowserProvider(window.ethereum);
  const provider = new JsonRpcProvider("https://api.helium.fhenix.zone/");
  const client = new FhenixClient({ provider });

  const { isPending, getMintEncrypted, getBalanceOfEncrypted } = useFhErc20({
    permit,
    encrypted,
    walletAddress: address,
  });

  const {
    isPending: isPendingCounter,
    addCounter,
    getCounter,
    getCounterPermission,
  } = useCounter({
    permit,
    encrypted,
  });

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

  const handleGetEncryptedBalance = async () => {
    console.log("Getting encrypted balance");
    const balance = await getBalanceOfEncrypted();
    setEncrypted(balance);
    console.log("encrypted", balance);
  };

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

  const handleAddCounter = async () => {
    const result = await addCounter();
    console.log("Result", result);
  };

  const handleGetCounter = async () => {
    const result = await getCounter();
    console.log("Result", result);
  };

  const getPermitfromWallet = async () => {
    setIsLoading(true);
    const contractAddress = "0x100371Fe4B99492a6AEE453FFa46AB8074aae8e4";
    //const signer = await provider.getSigner();
    console.log(`loaded permit for ${contractAddress}`);
    const provider = new BrowserProvider(window.ethereum);
    let permit = await getPermit(contractAddress, provider);
    client.storePermit(permit);
    console.log(permit);
    // if (!permit) {
    //   let permit = await client.generatePermit(
    //     contractAddress,
    //     undefined,
    //     signer
    //   );
    //   client.storePermit(permit);
    // }
    setIsLoading(false);
    setPermit(permit);
  };

  const handleGetCounterPermission = async () => {
    setIsLoading(true);
    const result = await getCounterPermission();
    console.log("Result", result);
    setIsLoading(false);
  };

  return (
    <Wrapper>
      {isPending || isPendingCounter || (isLoading && <Loading />)}
      <Header />

      <StyledDiv>Is Pending: {isPending.toString()}</StyledDiv>
      {/* <StyledDiv>Hash: {hash ? hash : "Loading..."}</StyledDiv> */}
      <StyledButton onClick={getPermitfromWallet}>Get Permit</StyledButton>
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
      <StyledButton onClick={handleGetCounter}>Get Counter</StyledButton>

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
  font-xxxl-b text-green-7
`;

const ServiceDescriptionSubTitle = tw.div`
  font-xxl-l text-green-6
`;
