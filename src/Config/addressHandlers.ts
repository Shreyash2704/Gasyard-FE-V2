import bs58 from 'bs58'

const CHAIN_ID = {
    ETH_SEPOLIA: 901,
    BASE_SEPOLIA: 902,
    BERACHAIN: 903,
    SOLANA: 999,
  };
  
export function evmAddressToBytes32(address:any) {
    const cleanAddress = address.toLowerCase().replace(/^0x/, '');
  
    const paddedAddress = cleanAddress.padStart(64, '0');
  
    return `0x${paddedAddress}`;
  }
  
export function base58ToBytes32(base58Address:any) {
    try {
      const decoded = Buffer.from(bs58.decode(base58Address));
  
      const hexAddress = decoded.toString('hex');
  
      const paddedAddress = hexAddress.padStart(64, '0');
  
      return `0x${paddedAddress}`;
    } catch (error) {
        //@ts-ignore
      throw new Error(`Invalid Base58 address: ${error.message}`);
    }
  }
  
export function handleAddress(addressString:any, chainID:any) {
    if (process.env.SERVER == 'testnet') {
      if ([CHAIN_ID.ETH_SEPOLIA, CHAIN_ID.BASE_SEPOLIA, CHAIN_ID.BERACHAIN].includes(chainID)) {
        const newAddress = evmAddressToBytes32(addressString);
        return newAddress;
      } else if ([CHAIN_ID.SOLANA].includes(chainID)) {
        const newAddress = base58ToBytes32(addressString);
        return newAddress;
      }
    }
  }

