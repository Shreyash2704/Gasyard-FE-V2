import React, { useEffect, useState } from 'react'
import CommonModal from '../Modal/CommonModal'
import { useDisclosure } from '@chakra-ui/react'
import success_animation from "../../assets/animations/success-animation.json";
import on_going_trxn_animation from "../../assets/animations/waitingAnimation.json";
import Lottie from 'lottie-react';
import pending_animation from "../../assets/animations/pending-animation.json"
import './style.css'
import confirmTxLogo from '../../assets/v2/confirm.svg'
import { iconMap } from '../../Config/data';
import doubleArrow from '../../assets/v2/doubleArrow.svg'
import CloseBtn from "../../assets/CloseIcon.svg";
import rejected_animation from "../../assets/animations/rejected-animation.json";
import redirectLogo from "../../assets/redirect.svg";
import quoteLoader_animation from '../../assets/animations/quoteLoader.json'
import ReviewQuote from '../BridgeApp/ReviewQuote';
import { observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../Config/utils';

type Props = {
    chain1:any,
    chain2:any,
    input1:string | null,
    input2:string | null,
    isOpen?: any;
    onOpen?: any;
    onClose?: any;
    setModal?: any;
    rejected?: boolean;
    pending?:boolean;
    success?:boolean
    onSubmit?:any
    txHash?:string | null
    ClearState?:any
    txId?:any
    txReceipt?:any
    outputTxHash?:string | null
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

const TransactionPopup = observer(({chain1,chain2,input1,input2,onOpen,onClose,isOpen,setModal,pending,success,rejected,txHash,ClearState,txId,txReceipt,onSubmit,outputTxHash}: Props) => {
    // const {onOpen,onClose,isOpen} = useDisclosure()
    const [review, setreview] = useState(true)
    const {address} = useAccount()
    
  const onCloseModal = () => {
    onClose();
    setreview(true)
    setModal(false)
    ClearState()
  };
  const redirectApp = () =>{
      if(txHash){
        const url = window.location.origin+`/txHash/${txHash}`
        window.open(url, '_blank');
      }
      
    }
  useEffect(() => {
    console.log("txHash",txHash)
  }, [txHash])
  
  return (
    <div className='TransactionWrapParent'>
        <CommonModal isOpen={isOpen} onClose={onClose} size={"md"} header=''>
            <div className='header'>
                {
                    review ? "Review Swap" :pending ? <>Transaction Pending</> : rejected ? <>Transaction Rejected</> : outputTxHash ? outputTxHash === "None" ? <>Somethings went wrong!</>: <>Transaction Successful </> : <>Transaction In Progress</>
                }
                

            <img src={CloseBtn} onClick={onCloseModal} />
            </div>
            
            <div className="ReviewWrap">
                <div className="txStatus">
                    <div className="txWrap">
                        <img src={iconMap[chain1.id]} alt="" />
                        <div className="tokenDetails">
                            <div className="txWraptoken">{input1}{" "}{chain1.nativeCurrency.symbol}</div>
                            <div className="txWrapnetwork">${AppstoreV2.tokenVal1inUSD}</div>
                        </div>
                    </div>
                    <img src={doubleArrow} width={20} height={20} alt={"icon"} />
                    <div className="txWrap">
                        <img src={iconMap[chain2.id]} alt="" />
                        <div className="tokenDetails">
                            <div className="txWraptoken">{input2}{" "}{chain2.nativeCurrency.symbol}</div>
                            <div className="txWrapnetwork">${AppstoreV2.tokenVal2inUSD}</div>
                        </div>
                    </div>
                </div>
                {!review ? 
                <>
                {
                    pending ? (
                        <>
                        <Lottie
                        animationData={pending_animation}
                        loop={true}
                        style={{ height: "150px", width: "150px" }}
                    />
                        </>
                    ) : rejected ? (
                        <Lottie
                        animationData={rejected_animation}
                        loop={true}
                        style={{ height: "150px", width: "150px" }}
                    />
                    ) : outputTxHash && outputTxHash !== "None" ? (
                        <Lottie
                        animationData={success_animation}
                        loop={true}
                        style={{ height: "150px", width: "150px" }}
                    />): (
                        <Lottie
                        animationData={quoteLoader_animation}
                        loop={true}
                        style={{ height: "150px", width: "150px" }}
                        />
                    )
                    
                }
                {outputTxHash === "None" && <div className='contact-text'>Please contact administrator</div>}
                {success && outputTxHash &&outputTxHash !== "None" ? <div className="redirectSection" onClick={redirectApp}>
                    View on Explorer
                    <img src={redirectLogo} />
                </div> : ("")}
                </>
                :
               <>
               <div className='ReviewQuoteWrap'>
                    <QuoteRow label={"Rate"} value={"1 ETH = 0.99 ETH"}/>
                    <QuoteRow label={"Network Fee"} value={"$0.12 USD"}/>
                    <QuoteRow label={"Min. Received"} value={`${input2} ${chain2.nativeCurrency.symbol}`}/>
                    <QuoteRow label={"From Address"} value={shortenAddress(address ?? "")}/>
                    <QuoteRow label={"To Address"} value={shortenAddress(address ?? "")}/>
                </div>
                    <button className='submit-btn' onClick={()=>{
                        onSubmit()
                        setreview(false)
                    }}>Confirm</button>
               </>
        }
                
                </div>
            
            <div className="TransactionWrap">
           
            
            {/* <div className="message">
                <img src={confirmTxLogo} width={10} height={10}/>
                <span>Confirm in Wallet</span>
            </div> */}

            <div className="txStatus">
                <div className="txWrap">
                    <img src={iconMap[chain1.id]} alt="" />
                    <div className="tokenDetails">
                        <div className="txWraptoken">{input1}{" "}{chain1.nativeCurrency.symbol}</div>
                        <div className="txWrapnetwork">{chain1.name}</div>
                    </div>
                </div>
                <img src={doubleArrow} width={20} height={20} alt={"icon"} />
                <div className="txWrap">
                    <img src={iconMap[chain2.id]} alt="" />
                    <div className="tokenDetails">
                        <div className="txWraptoken">{input2}{" "}{chain2.nativeCurrency.symbol}</div>
                        <div className="txWrapnetwork">{chain2.name}</div>
                    </div>
                </div>
            </div>

            {success ? <div className="redirectSection" onClick={redirectApp}>
                View on Explorer
                <img src={redirectLogo} />
              </div> : ("")}
            </div>
        </CommonModal>
    </div>
  )
})

export default TransactionPopup