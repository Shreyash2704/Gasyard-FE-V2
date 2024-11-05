import React, { useState } from 'react'
import "./Header.css"
import logo from '../../assets/Gasyard Logo.svg'
import NavDrawer from '../NavDrawer/NavDrawer'
import closeIcon from '../../assets/close_2x_white.svg'
import { AptosConnectButton } from '@razorlabs/wallet-kit';

type Props = {}

const Header = (props: Props) => {
  const [selected, setselected] = useState("")
  const [closeNotification, setcloseNotification] = useState(true)
  return (
    <div className="nav-root">
      <div className={`nav-notification ${closeNotification ? "hideDiv":""}`}>
        🚧 Website Maintenance in Progress 🚧    We're currently performing some updates and will be back online shortly. Thank you for your patience!
        {/* Welcome Gasyard testnet. For this phase we’ve limited the Bridge amount to 0.05 ETH max on all networks! */}
        {/* New Quest Live! Complete tasks like bridging ETH and providing liquidity on Kakarot testnet to earn rewards! */}
        {/* <a href="https://superboard.xyz/quests/gasyard-gas-orchestration-protocol" target="_blank" className="quest-btn">Go to Quest</a> */}
        <img src={closeIcon} alt="close" onClick={() => setcloseNotification(true)} />
      </div>
      <div className='nav-section'>
        <div className='left-section'>
          <a href="/" className='title'>
            <img src={logo} />
          </a>

          <a className="nav-transfer" href="/explorer">
            Explorer
          </a>

          <a className="nav-history" href="/liquidity"> Liquidity</a>
        </div>

        
        

        <div className='right-section'>
          <w3m-button balance='show'/>
          <AptosConnectButton label="Connect Your Aptos Wallet"/>
          {/* <w3m-network-button /> */}
        </div>
        <div className="mobile-nav"><NavDrawer /></div>
      </div>
    </div>
  )
}

export default Header