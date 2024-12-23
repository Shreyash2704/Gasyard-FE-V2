import React, { useState } from 'react'
import "./Header.css"
import logo from '../../assets/Gasyard Logo.svg'
import NavDrawer from '../NavDrawer/NavDrawer'
import closeIcon from '../../assets/close_2x_white.svg'
import { NavLink } from 'react-router-dom'
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import telegarmIcon from '../../assets/telegram-fill.svg'
import xLogo from '../../assets/twitter.svg'
type Props = {}

const Header = (props: Props) => {
  const [selected, setselected] = useState("")
  const [closeNotification, setcloseNotification] = useState(true)
  return (
    <div className="nav-root">
      <div className={`nav-notification ${closeNotification ? "hideDiv":""}`}>
      Bridging services are temporarily paused as we transition to GasYard V2.
        {/* 🚧 Website Maintenance in Progress 🚧    We're currently performing some updates and will be back online shortly. Thank you for your patience! */}
        {/* Welcome to Movement Testnet by Gasyard.fi. For this phase we’ve limited the Bridge amount to 0.05 ETH / $200 max on all networks! */}
        {/* New Quest Alert! We’ve just launched an exciting quest on Movement via @Galxe! Complete the tasks. Say "GMOVE" and join the gang */}
        {/* <a href="https://app.galxe.com/quest/Gasyard" target="_blank" className="quest-btn">Go to Quest</a> */}
        <img src={closeIcon} alt="close" onClick={() => setcloseNotification(true)} />
      </div>
      <div className='nav-section'>
        <div className='left-section'>
      
        <NavLink to="/" className='title' >
            <img src={logo} />
          </NavLink>

          <NavLink
            className={({ isActive }) => (isActive ? 'nav-transfer active' : 'nav-transfer')}
            to="/">
            Bridge
          </NavLink>

          <NavLink
            className={({ isActive }) => (isActive ? 'nav-transfer active' : 'nav-transfer')}
            to="/explorer">
            Explorer
          </NavLink>

          <NavLink 
          className={({ isActive }) => (isActive ? 'nav-history active' : 'nav-history')}
          to="/liquidity"> Liquidity</NavLink>

          {/* <NavLink 
          className={({ isActive }) => (isActive ? 'nav-funds active' : 'nav-funds')}
          to="/funds"> Don’t have funds? <span className='down-arrow'></span></NavLink> */}

          <Menu>
            <MenuButton as={Button} background={"none"} rightIcon={<ChevronDownIcon />}>
              Don’t have funds?
            </MenuButton>
            <MenuList background={"#EEEAE6"}>
              <MenuItem background={"#EEEAE6"} minH='48px'>
                <a href="https://faucet.movementlabs.xyz/" target="_blank">Movement Faucet</a>
              </MenuItem>
              <span className='divider'></span>
              <MenuItem background={"#EEEAE6"} minH='40px'>
                <a href="https://web.telegram.org/k/#@gasyardbot" target="_blank">TG bot Faucet</a>
              </MenuItem>
            </MenuList>
          </Menu>


        </div>

        
        

        <div className='right-section'>
          <div className="social_media_logo">
            <a href="https://t.me/gasyardfi" target='_blank'>
            <img src={telegarmIcon} alt="telegram" />
            </a>
            <a href="https://x.com/gasyardfi" target='_blank'>
            <img src={xLogo} alt="twitter" />
            </a>
          </div>
          <w3m-button balance='show'/>
          {/* <w3m-network-button /> */}
        </div>
        <div className="mobile-nav"><NavDrawer /></div>
      </div>
    </div>
  )
}

export default Header