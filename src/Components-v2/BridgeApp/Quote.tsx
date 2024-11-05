import React from 'react'
import token from '../../assets/v2/bridge/eth.svg'

type Props = {
    token1:any,
    token2:any,
    val_token1:any,
    val_token2:any
}
const Quote = ({token1,token2,val_token1,val_token2}:Props) => {
  return (
    <div className='QuoteRoot'>
        <div className="showQuote d-flex-row">
            <div className="left-sec d-flex-row">
                
                    {val_token1} 
                    <img src={token} alt="" />
                    {token1}
                    <span>~</span>
                    {val_token2} 
                    <img src={token} alt="" />
                    {token2}
                
            </div>
            <div className="right-sec">
                <button>Show More</button>
            </div>
            
        </div>
        <div className="detailedQuote"></div>
    </div>
  )
}

export default Quote