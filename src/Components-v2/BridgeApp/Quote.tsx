import React from 'react'
import token from '../../assets/v2/bridge/eth.svg'
import { iconMap } from '../../Config/data'
import { ethers } from 'ethers'

type Props = {
    token1:any,
    token2:any,
    val_token1:any,
    val_token2:any,
    loading:boolean
}
const Quote = ({token1,token2,val_token1,val_token2,loading}:Props) => {
  //ethers.util
  return (
    <div className='QuoteRoot'>
        <div className="showQuote d-flex-row">
            <div className="left-sec d-flex-row">
                
                    {val_token1} 
                    <img src={token1 && iconMap[token1?.id]} alt="" />
                    {token1?.nativeCurrency?.symbol}
                    <span>~</span>
                    {val_token2} 
                    <img src={token2 && iconMap[token2?.id]} alt="" />
                    {token2?.nativeCurrency?.symbol}
                
            </div>
            <div className="right-sec">
                {/* <button>Show More</button> */}
                {loading && <div className="loader"></div>}
            </div>
            
        </div>
        <div className="detailedQuote">
          
        </div>
    </div>
  )
}

export default Quote