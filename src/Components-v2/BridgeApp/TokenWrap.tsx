import React from 'react'
import  "./BridgeApp.css"
import downArrow from '../../assets/v2/bridge/down-arrow.svg'

type Props = {
    label:any,
    inputVal:any,
    inputInDollars:any,
    token:any,
    balance:any,
    tokenImg:any,
    onClick:any
}

const TokenWrap = ({label,inputVal,inputInDollars,token,balance,tokenImg,onClick}: Props) => {
  return (
    <div className='TokenWrapRoot d-flex-row'>
        <div className="left-sec d-flex-col">
            <div className="label">{label}</div>
            <input type="text" value={inputVal} placeholder='0.001'/>
            <div className="input-in-dollars">${inputInDollars}</div>
        </div>
        <div className="right-sec d-flex-col">
            <div className="select-token d-flex-row" onClick={onClick}>
                <img src={tokenImg} alt="" />
                {token}
                <img src={downArrow} className="down-arrow" alt="" />
            </div>
            <div className="balance-sec">
                Balance:<span>{balance}</span>
            </div>
        </div>
    </div>
  )
}

export default TokenWrap