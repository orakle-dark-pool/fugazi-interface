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
    getViewerDepositBalance,
  } = useViewer();

  const {
    isPending: isPendingFugazi,
    approveFugazi,
    getBalanceOfEncryptedFugazi,
  } = useFugazi();

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
    setBalanceOfEncryptedFugazi(Number(result));
  };

  return (
    <Wrapper>
      <Header />

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

export default MainPage;

const Wrapper = tw.div`
  flex flex-col
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
