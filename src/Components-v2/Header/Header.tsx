import React, { useEffect, useState } from 'react'
import "./Header.css"
import logo from '../../assets/v2/gasyardLogov2.svg'
import closeIcon from '../../assets/close_2x_white.svg'
import { AptosConnectButton } from '@razorlabs/wallet-kit';
import notifyLogo from '../../assets/v2/header/hugeicons_notification-03.svg'
import avatarLogo from '../../assets/v2/header/avatar.svg'
import ConnectWalletModal from '../Modal/ConnectWalletModal';
import { observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { WalletConnect } from './WalletConnect';
import { useConnectWallet } from '@privy-io/react-auth';

type Props = {}

const Header = observer((props: Props) => {
  const [selected, setselected] = useState("")
  const [closeNotification, setcloseNotification] = useState(true)
  const {address} = useAccount()

  
  const { disconnect } = useDisconnect()
  const handleClick = () =>{
    console.log("Clicked!")
    AppstoreV2.setWalletModal(!AppstoreV2.showWalletModal)
  }
  
  useEffect(() => {
    AppstoreV2.setWalletModal(false)
  }, [address])
  
  return (
    <div className="nav-root">
      <div className='nav-section'>
        <div className='left-section'>
          <a href="/" className='title'>
            <img src={logo} />
            {/* Gasyard */}
          </a>

          <a className="nav-transfer" href="/explorer">
            Explorer
          </a>

          {/* <a className="nav-history" href="/liquidity"> Liquidity</a> */}
        </div>

        <div className='right-section'>
          <div className="notification-sec flex flex-row col-span-7 justify-center align-middle">
            {/* <img src={notifyLogo} />
            <span>123</span> */}
            {/* <a href="/explorer">Explorer</a> */}
          </div>

          
          <WalletConnect />

          {/* <button onClick={() =>{
            disconnect()
          }}>disconnect</button> */}
          
          
          {/* <w3m-button balance='show'/> */}
          {/* <AptosConnectButton label="Connect Your Aptos Wallet"/> */}
          {/* <w3m-network-button /> */}
          
        </div>
      </div>
      <ConnectWalletModal />
    

    </div>
  )
})

export default Header