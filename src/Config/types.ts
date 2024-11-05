type chainType = {
  name: string;
  id: number;
  nativeCurrency?: any;
  iconUrl?: any
  contractAddress?: any
};

interface Network {
  networkName: string;
  chainID: number;
  baseToken: string;
  decimals: number;
  routerContract?: `0x${string}`;
  rpc?: any;
  feedaddress?: `0x${string}`
  platformFeePercentage?: number
  gweiLimit?: number
  isGasByLifi?: boolean
  liquidityPool?: `0x${string}`
  minimumGas?: number
  explorer?: string
  explorerAddress?: string
  priceProvider?: string
}

interface Networks {
  [key: string]: Network;
}

type quoteType = {
  fees: number | "";
  outputTokenAmount: number;
};

interface ImageMapType {
  [key: string]: string | any;
}

interface ImageMapType2 {
  [key: number]: string;
}
interface NetworkConfigReturnType {
  balance: bigint;
  name: string
  balanceinusd: string
}

interface ChainVolume {
  networkName: string
  totalVolume: bigint
}

interface PortfolioObjectReturnType {
  balance: string;
  networkName: string
  decimals: number
}

interface TotalChainVolume {
  [key: string]: ChainVolume
}
interface PortfolioListReturnType {
  [key: number]: PortfolioObjectReturnType
}

interface LiquidityPoolBalance {
  [key: number]: NetworkConfigReturnType
}
interface explorerMapType {
  [key: number]: string;
}

interface portfolioType {
  [key: string]: PorfolioChains

}

type PorfolioChains = {
  balance: string
  balanceRawInteger: string
  chainID: number
  baseToken: string
  // balanceUsd: string
  // blockchain: string
  // holderAddress: `0x${string}`
  // thumbnail: string
  // tokenDecimals: number
  // tokenName: string
  // tokenPrice:string
  // tokenSymbol: string
  // tokenType: string
}

interface TxObjectType {
  "inputTxHash": `0x${string}`,
  "outputTxHash": `0x${string}` | null,
  "managerHash": null,
  "status": string,
  "inputChainID": number,
  "outputChainID": number,
  "inputChainAmount": bigint,
  "outputChainAmount": bigint,
  "inputAddress": `0x${string}` | null,
  "outputAddress": `0x${string}` | null,
  "bridgeHash": `0x${string}` | null,
  "fees": number | any,
  "createdAt": string,
  "updatedAt": string,
  "id": string
}

interface rewardsType {
  holderAddress: string;
  chainID: Number;
  reward: number;
  rewardInUsd: Number;
}
export type {
  chainType,
  Network,
  Networks,
  quoteType,
  ImageMapType,
  portfolioType,
  TxObjectType,
  ImageMapType2,
  explorerMapType,
  NetworkConfigReturnType,
  LiquidityPoolBalance,
  PortfolioListReturnType,
  TotalChainVolume,
  rewardsType
};
