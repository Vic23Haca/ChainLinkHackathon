import { ethers } from "ethers";
import React, {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
} from "react";

import { Web3Provider, ExternalProvider } from "@ethersproject/providers";

declare global {
    interface Window {
        ethereum?: ExternalProvider;
    }
}
type Provider = Web3Provider | null;

const BlockchainContextReader = createContext<Provider>(null);
const BlockchainContextWriter = createContext<Provider>(null);

interface BlockchainProviderProps {
    children: ReactNode;
}

const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new Web3Provider(window.ethereum);
    // const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      window.ethereum
        .request?.({ method: 'eth_requestAccounts' }) //in case ethereum is undefined
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }, []);
  
  
  return (
    <BlockchainContextWriter.Provider value={provider}>
      <BlockchainContextReader.Provider value={provider}>
        {children}
      </BlockchainContextReader.Provider>
    </BlockchainContextWriter.Provider>
  );
};

export { BlockchainProvider, BlockchainContextReader, BlockchainContextWriter };
