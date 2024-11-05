import React, { useState } from 'react'
import "./Header.css"
import logo from '../../assets/Gasyard Logo.svg'
import closeIcon from '../../assets/close_2x_white.svg'
import { AptosConnectButton } from '@razorlabs/wallet-kit';
import notifyLogo from '../../assets/v2/header/hugeicons_notification-03.svg'
import avatarLogo from '../../assets/v2/header/avatar.svg'

type Props = {}

const Header = (props: Props) => {
  const [selected, setselected] = useState("")
  const [closeNotification, setcloseNotification] = useState(true)
  return (
    <div className="nav-root">
      <div className='nav-section'>
        <div className='left-section'>
          <a href="/" className='title'>
            {/* <img src={logo} /> */}
            Gasyard
          </a>

          {/* <a className="nav-transfer" href="/explorer">
            Explorer
          </a>

          <a className="nav-history" href="/liquidity"> Liquidity</a> */}
        </div>

        <div className='right-section'>
          <div className="notification-sec flex flex-row col-span-7 justify-center align-middle">
            <img src={notifyLogo} />
            <span>123</span>
          </div>
          <button className='wallet-sync'>Wallet Sync</button>
          <div className="avatar-sec">
            <img src={avatarLogo} alt="" />
          </div>
          {/* <w3m-button balance='show'/> */}
          {/* <AptosConnectButton label="Connect Your Aptos Wallet"/> */}
          {/* <w3m-network-button /> */}
        </div>
      </div>
    </div>
  )
}

export default Header