import React from 'react'
import './BridgeApp.css'

type Props = {}

const ReviewQuote = (props: Props) => {
  return (
    <div className='ReviewQuoteWrap'>
        <div className="reviewLabels">
            <span>Rate</span>
            <div className="value">1 BTC = 63.45 ETH</div>
        </div>
        <div className="reviewLabels">
            <span>Network</span>
            <div className="value">BTC</div>
        </div>
        <div className="reviewLabels">
            <span>Min. Receive</span>
            <div className="value">7853ETH</div>
        </div>
        <div className="reviewLabels">
            <span>Network Fee</span>
            <div className="value">0.12USD</div>
        </div>
    </div>
  )
}

export default ReviewQuote