import React from 'react'
import CommonModal from './CommonModal'
import { useDisclosure } from '@chakra-ui/react'
import { AptosConnectButton } from '@razorlabs/wallet-kit';
import { observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useWeb3Modal } from '@web3modal/wagmi/react';


type Props = {}

const ConnectWalletModal = observer((props: Props) => {
    const {isOpen,onClose,onOpen} = useDisclosure()
    const { open, close } = useWeb3Modal();
    
    const CloseModal = () =>{
        AppstoreV2.setWalletModal(false)
    }
    return (
        <div>
            <CommonModal isOpen={false} onClose={CloseModal}>
                <div className="wallet-conector-wrap">
                    {/* <AptosConnectButton label="Connect Your Aptos Wallet" /> */}
                    
                    <button onClick={() => open()}>Connect Your EVM Wallet</button>
                </div>
            </CommonModal>
        </div>
    )
})

export default ConnectWalletModal