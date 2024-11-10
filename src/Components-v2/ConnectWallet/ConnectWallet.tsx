import React from 'react'
import './ConnectWallet.css'
import { AptosConnectButton, useAptosWallet } from '@razorlabs/wallet-kit';
import { observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import RazorWallet from './razorWallet';

type Props = {}

const ConnectWallet = (props: Props) => {
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  const wallet = useAptosWallet();
  console.log('wallet status', wallet.status);
  console.log('connected wallet name', wallet.name);
  console.log('connected account info', wallet.account);
  return (
    <div className="ConnectWalletRoot">
      <div className="title">Wallet Sync</div>
      <div className="wallet-conector-wrap">
        {/* <AptosConnectButton label="Connect Your Aptos Wallet" /> */}
        {/* <RazorWallet /> */}
        <AptosConnectButton>Connect Your Aptos Wallet</AptosConnectButton>
        <button className='evm-wallet' onClick={() => open()}>{address ? address : "Connect Your EVM Wallet" }</button>
      </div>
    </div>
  )
}

export default ConnectWallet