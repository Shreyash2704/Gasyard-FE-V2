import { SuiConnectModal,useAptosWallet,useSuiWallet} from '@razorlabs/wallet-kit'
import React, { useState } from 'react'
//import { useSuiWallet, ConnectModal } from '@razorlabs/wallet-kit';

type Props = {}

function RazorWallet({}: Props) {
    const {connected} = useSuiWallet()
    const [showModal, setShowModal] = useState(false)
    const wallet = useAptosWallet();
    console.log('wallet status', wallet.status);
    console.log('connected wallet name', wallet.name);
    console.log('connected account info', wallet.account);

  if (connected) {
    return <>
    <div>
    'wallet status' {wallet.status},wallet name {wallet.name}, account info {wallet.account && wallet.account.address}
    </div>
    </>
  }
  return (

    <SuiConnectModal
        open={showModal}
        onOpenChange={(open) => setShowModal(open)}
    >
        <button>Connect Your Aptos Wallet</button>
        
    </SuiConnectModal>
  )
}

export default RazorWallet