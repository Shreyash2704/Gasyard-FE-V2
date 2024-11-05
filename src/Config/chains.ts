import {
    Chain,
} from "wagmi/chains";

export const movementTestnet: Chain = {
    id: 30732, // Replace with the actual chain ID of Movement Testnet
    name: 'Move-EVM',
    nativeCurrency: {
        name: 'Move-EVM',
        symbol: 'MOVE',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://sui.imola.testnet.movementlabs.xyz'] }, // Replace with actual RPC URL
    },
    blockExplorers: {
        default: { name: 'Movement Explorer', url: 'https://explorer.devnet.imola.movementlabs.xyz/#/' }, // Replace with actual explorer URL
    },
    testnet: true,
};