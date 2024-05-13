import tw from "twin.macro";
import { BrowserProvider } from "ethers";
import { Header } from "./components/header";
import {
  EncryptedUint32,
  EncryptionTypes,
  FhenixClient,
  Permit,
  getPermit,
} from "fhenixjs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useCounter } from "./contract/fh-erc.ts";

function App() {
  //const { isItFhenixNetwork, balance, address, fnxConnect } = useChain();

  const [encrypted, setEncrypted] = useState<any | undefined>(undefined);
  const [permit, setPermit] = useState<Permit | undefined>(undefined);
  const { address, isConnected } = useAccount();
  const provider = new BrowserProvider(window.ethereum);
  const client = new FhenixClient({ provider });

  const {
    isPending,
    getCounterPermission,
    getCounter,
    addCounter,
    addCounterByWagmi,
  } = useCounter({ permit, encrypted });

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

  const getPermitfromWallet = async () => {
    const contractAddress = "0x7B03c89642a9286Dcae52caB419D4ce46Cc39583";
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const fhenixClient = new FhenixClient({ provider });

    console.log(`loading permit for ${contractAddress}`);
    let permit = await getPermit(contractAddress, provider);
    if (!permit) {
      let permit = await fhenixClient.generatePermit(
        contractAddress,
        undefined,
        signer
      );
    }
    setPermit(permit);
  };

  return (
    <Wrapper>
      <Header />

      <StyledDiv>
        Todo1: Swap - Amm 토큰 / 수량 입력 <br />
        입력값 확인 <br />
        암호화
        <br />
        컨트랙트 호출
        <br />
        결과 확인 <br />
      </StyledDiv>
      <StyledDiv>Todo2: Pool</StyledDiv>
      <StyledDiv>Todo3: Farm</StyledDiv>

      <StyledDiv>Is Pending: {isPending.toString()}</StyledDiv>
      {/* <StyledDiv>Hash: {hash ? hash : "Loading..."}</StyledDiv> */}
      <button onClick={getPermitfromWallet}>Get Permit</button>
      <button onClick={() => getCounter()}>Get Counter</button>
      <button onClick={() => getCounterPermission()}>
        Get Counter Permission
      </button>
      {/* <button onClick={() => getCounterPermissionSealed()}>
        Get Counter Permission Sealed
      </button> */}
      <button onClick={() => addCounter()}>Add Counter</button>
      <button onClick={() => addCounterByWagmi()}>Add Counter By Wagmi</button>
    </Wrapper>
  );
}

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

export default App;

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const StyledDiv = tw.div`
  text-lg p-32
`;
