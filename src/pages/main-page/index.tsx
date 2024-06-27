import tw from "twin.macro";
import { BrowserProvider } from "ethers";
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

const MainPage = () => {
  //const { isItFhenixNetwork, balance, address, fnxConnect } = useChain();

  const [encrypted, setEncrypted] = useState<any | undefined>(undefined);
  const [permit, setPermit] = useState<Permit | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const provider = new BrowserProvider(window.ethereum);
  const client = new FhenixClient({ provider });

  const { isPending, getMintEncrypted, getBalanceOfEncrypted } = useFhErc20({
    permit,
    encrypted,
    walletAddress: address,
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
      // const decoder = new TextDecoder("utf-8");
      // const decrypted = decoder.decode(result.data);
      // setEncrypted(decrypted);
      console.log("Encrypted", result);
      setEncrypted(result);
    };
    encrypt();
  }, []);

  const decryptBalance = async () => {
    const contractAddress = "0x100371Fe4B99492a6AEE453FFa46AB8074aae8e4";
    const balance = await getBalanceOfEncrypted();

    // Ensure the client has the necessary permit for the contract address
    let permit = client.getPermit(contractAddress);
    if (!permit) {
      // Fetch or initialize the permit here
      permit = await client.generatePermit(contractAddress, provider);
      client.storePermit(permit);
    }

    const decrypted = client.unseal(contractAddress, balance);
    console.log("Decrypted", decrypted.toString());
  };

  const getPermitfromWallet = async () => {
    setIsLoading(true);
    const contractAddress = "0x100371Fe4B99492a6AEE453FFa46AB8074aae8e4";
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const fhenixClient = new FhenixClient({ provider });

    console.log(`loaded permit for ${contractAddress}`);
    let permit = await getPermit(contractAddress, provider);
    fhenixClient.storePermit(permit);
    if (!permit) {
      let permit = await fhenixClient.generatePermit(
        contractAddress,
        undefined,
        signer
      );
      fhenixClient.storePermit(permit);
    }
    setIsLoading(false);
    setPermit(permit);
  };

  return (
    <Wrapper>
      {isPending || (isLoading && <Loading />)}
      <Header />

      <StyledDiv>Is Pending: {isPending.toString()}</StyledDiv>
      {/* <StyledDiv>Hash: {hash ? hash : "Loading..."}</StyledDiv> */}
      <StyledButton onClick={getPermitfromWallet}>Get Permit</StyledButton>

      <StyledButton onClick={() => getMintEncrypted()}>
        Mint Encrypted
      </StyledButton>
      <StyledButton onClick={() => getBalanceOfEncrypted()}>
        Get Balance Of Encrypted
      </StyledButton>
      <StyledButton onClick={() => decryptBalance()}>
        decrypt Balance
      </StyledButton>
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
  flex flex-col h-screen
`;

const StyledDiv = tw.div`
  text-lg p-32
`;

const StyledButton = tw.button`
  w-200
  bg-green-300 hover:bg-green-100 text-white font-semibold h-36
  px-16 py-2 rounded-md 
  border-solid border-2 border-green-200
`;
