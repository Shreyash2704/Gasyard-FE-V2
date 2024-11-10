import React, { useState } from 'react'
import TokenWrap from './TokenWrap'
import token from '../../assets/v2/bridge/eth.svg'
import './BridgeApp.css'
import Quote from './Quote'
import switchTokenLogo from '../../assets/v2/bridge/CurrencySwitcher.svg'

import { useDisclosure } from '@chakra-ui/react'
import SelectChainModal from '../SelectChainModal/SelectChainModal'


type Props = {}

const BridgeApp = (props: Props) => {
  const [input1, setinput1] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className='BridgeAppRoot'>
      <div className="bridgeTitle">Bridge</div>
      <div className="bridgeApp d-flex-col">
        <img className='CurrencySwitcher' src={switchTokenLogo} alt="" />
        <TokenWrap 
          label="You send"
          inputVal={input1}
          inputInDollars="10"
          token="BTC"
          balance="10"
          tokenImg={token}
          onClick={onOpen}
        />
        <TokenWrap 
          label="You receive"
          inputVal={input1}
          inputInDollars="10"
          token="ETH"
          balance="10"
          tokenImg={token}
          onClick={onOpen}
        />
        <Quote 
          token1={"BTC"}
          token2={"ETH"}
          val_token1={"1"}
          val_token2={"33.23"}
        />
        <button className='submit-btn'>Bridge</button>
      </div>
      
      <SelectChainModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        />
      
    </div>
  )
}

export default BridgeApp