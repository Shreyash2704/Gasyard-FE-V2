import React from 'react'
import './BridgeApp.css'

type Props = {
    outputToken:string,
    network:string
}
type Props1={
    label:string,
    value:string
}

const QuoteRow = ({label,value}:Props1) =>{
    return(
        <div className="reviewLabels">
            <span>{label}</span>
            <div className="value">{value}</div>
        </div>
    )
}

const ReviewQuote = ({outputToken,network}: Props) => {
  return (
    <div className='ReviewQuoteWrap'>
        <QuoteRow label={"Rate"} value={"1 ETH = 0.99 ETH"}/>
        <QuoteRow label={"Network Fee"} value={"$0.12 USD"}/>
        <QuoteRow label={"Min. Received"} value={"Min. Received"}/>
        <QuoteRow label={"From Address"} value={"0xf26a...8CD2"}/>
        <QuoteRow label={"To Address"} value={"0xf26a...8CD2"}/>
    </div>
  )
}

export default ReviewQuote