import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { movementTestnet } from "./Config/chains";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  mainnet,
  sepolia,
  base,
  polygon,
  bsc,
  scroll,
  Chain,
  baseSepolia,
  optimism,
  mantle,
  arbitrumSepolia,
  morphSepolia,
  //kakarotSepolia,
  berachainTestnet,
  
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import arbitumlogo from './assets/chains/arbitrum.svg'
import baselogo from './assets/chains/base.svg'
import bsclogo from './assets/chains/bsc.svg'
import ethereumlogo from './assets/chains/ethereum.svg'
import optimismlogo from './assets/chains/optimism.svg'
import polygonlogo from './assets/chains/polygon.svg'
import scrolllogo from './assets/chains/scroll.svg'
import sepolialogo from "./assets/chains/etherum_2.svg";
import mantlelogo from "./assets/chains/mantle.svg"
import karakotlogo from './assets/chains/karokat-logo.svg'
import berachianlogo from './assets/chains/Berachain.svg'
import movementtestnetlogo from './assets/chains/movement-testnet-token.svg'
import morphlogo from './assets/chains/Morph.png'
import abstractlogo from './assets/chains/abstract.png'
import sonieumlogo from './assets/chains/soneium.jpg'
import { ChainJsonData } from "./Config/data";
import { MovementTestnet,BerachainTestnet, MorphHolesky, AbstractTestnet,SoneiumTestnet,kakarotSepolia } from "./Config/config";


// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "b46e700f99389f8e96d969c863bfd0e8";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};



let config;
console.log("HELLO" + process.env.REACT_APP_SERVER)
if (process.env.REACT_APP_SERVER == "testnet") {
  const chains = [
    {
      ...baseSepolia,
      iconUrl: baselogo,
      contractAddress: ChainJsonData["84532"].routerContract,
      explorer:ChainJsonData["84532"].explorer,
      liquidityPool:ChainJsonData["84532"].liquidityPool
    },
    {
      ...arbitrumSepolia,
      iconUrl: arbitumlogo,
      contractAddress: ChainJsonData["421614"].routerContract,
      explorer:ChainJsonData["421614"].explorer,
      liquidityPool:ChainJsonData["421614"].liquidityPool
    },
    {
      ...MorphHolesky,
      iconUrl: morphlogo,
      contractAddress: ChainJsonData["2810"].routerContract,
      explorer:ChainJsonData["2810"].explorer,
      liquidityPool:ChainJsonData["2810"].liquidityPool
    },
    {
      ...kakarotSepolia,
      iconUrl: karakotlogo,
      contractAddress: ChainJsonData["920637907288165"].routerContract,
      explorer:ChainJsonData["920637907288165"].explorer,
      liquidityPool:ChainJsonData["920637907288165"].liquidityPool
    },
    // {
    //   ...berachainTestnet,
    //   iconUrl: berachianlogo,
    //   contractAddress: ChainJsonData["80085"].routerContract,
    //   explorer:ChainJsonData["80085"].explorer
    // }
    {
      ...MovementTestnet,
      iconUrl:movementtestnetlogo,
      contractAddress: ChainJsonData["30732"].routerContract,
      explorer:ChainJsonData["30732"].explorer,
      liquidityPool:ChainJsonData["30732"].liquidityPool
    },
    {
      ...BerachainTestnet,
      iconUrl: berachianlogo,
      contractAddress: ChainJsonData["80084"].routerContract,
      explorer:ChainJsonData["80084"].explorer,
      liquidityPool:ChainJsonData["80084"].liquidityPool
    },
    {
      ...sepolia,
      iconUrl: sepolialogo,
      contractAddress: ChainJsonData["11155111"].routerContract,
      explorer:ChainJsonData["11155111"].explorer,
      liquidityPool:ChainJsonData["11155111"].liquidityPool
    },
    // {
    //   ...AbstractTestnet,
    //   iconUrl:abstractlogo,
    //   contractAddress: ChainJsonData["11124"].routerContract,
    //   explorer:ChainJsonData["11124"].explorer,
    //   liquidityPool:ChainJsonData["11124"].liquidityPool
    // },
    {
      ...SoneiumTestnet,
      iconUrl:sonieumlogo,
      contractAddress: ChainJsonData["1946"].routerContract,
      explorer:ChainJsonData["1946"].explorer,
      liquidityPool:ChainJsonData["1946"].liquidityPool
    },
      {
      ...mainnet,
      iconUrl: ethereumlogo,
      contractAddress:ChainJsonData["1"].routerContract

  },
  ] as const;

  config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    // ...wagmiOptions // Optional - Override createConfig parameters
  });
}
else {
  const chains = [
    // {
    //   ...mainnet,
    //   iconUrl: ethereumlogo,
    //   contractAddress:ChainJsonData["1"].routerContract

  // },
  {
    ...arbitrum,
    iconUrl: arbitumlogo,
    contractAddress:ChainJsonData["42161"].routerContract,
    explorer:"https://arbiscan.io/tx/"
  },
  // {
  //   ...sepolia,
  //   iconUrl: sepolialogo,
  //   contractAddress:ChainJsonData["11155111"].routerContract
  // },
  {
    ...base,
    iconUrl: baselogo,
    contractAddress:ChainJsonData["8453"].routerContract,
    explorer:"https://basescan.org/tx/"
  },
  // { ...polygon, 
  //   iconUrl: polygonlogo,
  //   contractAddress:ChainJsonData["137"].routerContract
  // },
  // { ...bsc, 
  //   iconUrl: bsclogo,
  //   contractAddress:ChainJsonData["56"].routerContract
  // },
  { ...scroll, 
    iconUrl: scrolllogo,
    contractAddress:ChainJsonData["534352"].routerContract,
    explorer:"https://scrollscan.com/tx/"
  },
  // {
  //   ...baseSepolia,
  //   iconUrl:sepolialogo,
  //   contractAddress:ChainJsonData["84532"].routerContract
  // }
] as const;

  config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    // ...wagmiOptions // Optional - Override createConfig parameters
  });
}


// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': 'red',
    "--w3m-border-radius-master": "2px"
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
