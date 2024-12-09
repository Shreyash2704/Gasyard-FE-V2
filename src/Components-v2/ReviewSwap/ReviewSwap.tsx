import React from 'react'
import { iconMap } from '../../Config/data'
import './Review.css'

type Props = {
    label:string,
    token:string,
    usd:string,
    chain:any
}

const ReviewSwap = ({label,chain,token,usd}: Props) => {
  return (
    <div className='tokenReviewWrap d-flex-row'>
        <div className="tokenReview d-flex-column">
            <span>{label}</span>
            <div className="token">{token} {chain.nativeCurrency.symbol}</div>
            <span>${usd}</span>
        </div>
        <img src={iconMap[chain.id]} className='ml-auto' alt="token" />
    </div>
  )
}

export default ReviewSwap