import React from 'react'
import './BridgeApp.css'

type Props = {
    outputToken:string,
    network:string
}

const ReviewQuote = ({outputToken,network}: Props) => {
  return (
    <div className='ReviewQuoteWrap'>
        
        <div className="reviewLabels">
            <span>Network</span>
            <div className="value">{network}</div>
        </div>
        <div className="reviewLabels">
            <span>Min. Receive</span>
            <div className="value">{outputToken}</div>
        </div>
        <div className="reviewLabels">
            <span>Network Fee</span>
            <div className="value">0.12USD</div>
        </div>
    </div>
  )
}

export default ReviewQuote