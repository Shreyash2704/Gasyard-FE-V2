import React, { useState } from 'react'
import "./Header.css"
import logo from '../../assets/Gasyard Logo.svg'
import closeIcon from '../../assets/close_2x_white.svg'
import { AptosConnectButton } from '@razorlabs/wallet-kit';
import notifyLogo from '../../assets/v2/header/hugeicons_notification-03.svg'
import avatarLogo from '../../assets/v2/header/avatar.svg'
import ConnectWalletModal from '../Modal/ConnectWalletModal';
import { observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

type Props = {}

const Header = observer((props: Props) => {
  const [selected, setselected] = useState("")
  const [closeNotification, setcloseNotification] = useState(true)
  const {address} = useAccount()
  const {open, } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const handleClick = () =>{
    console.log("Clicked!")
    AppstoreV2.setWalletModal(!AppstoreV2.showWalletModal)
  }
  
  return (
    <div className="nav-root">
      <div className='nav-section'>
        <div className='left-section'>
          <a href="/" className='title'>
            {/* <img src={logo} /> */}
            Gasyard
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

          
          {address ? <></> : <button className='wallet-sync' onClick={() => open()} >Connect Wallet</button>}
          <button onClick={() =>{
            disconnect()
          }}>disconnect</button>
          
          <div className="avatar-sec" onClick={handleClick}>
            <img src={avatarLogo} alt="" />
          </div>
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