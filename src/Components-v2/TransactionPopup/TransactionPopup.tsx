import React, { useEffect } from 'react'
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
}

const TransactionPopup = ({chain1,chain2,input1,input2,onOpen,onClose,isOpen,setModal,pending,success,rejected,txHash,ClearState}: Props) => {
    // const {onOpen,onClose,isOpen} = useDisclosure()
    
  const onCloseModal = () => {
    onClose();
    setModal(false)
    ClearState()
  };
  useEffect(() => {
    console.log("txHash",txHash)
  }, [txHash])
  
  return (
    <div className='TransactionWrapParent'>
        <CommonModal isOpen={isOpen} onClose={onClose} size={"md"} header=''>
            <div className='header'>
                {
                    pending ? <>Transaction Submitted</> : rejected ? <>Transaction Rejected</> : <>Transaction Successful</>
                }
                

            <img src={CloseBtn} onClick={onCloseModal} />
            </div>
            <div className="TransactionWrap">
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
            ) : (
                <Lottie
                animationData={success_animation}
                loop={true}
                style={{ height: "150px", width: "150px" }}
            />
            )
           }
            
            <div className="message">
                <img src={confirmTxLogo} width={10} height={10}/>
                <span>Confirm in Wallet</span>
            </div>

            <div className="txStatus">
                <div className="txWrap">
                    <img src={iconMap[chain1.id]} alt="" />
                    <div className="tokenDetails">
                        <div className="txWraptoken">{input1}{chain1.nativeCurrency.symbol}</div>
                        <div className="txWrapnetwork">{chain1.name}</div>
                    </div>
                </div>
                <img src={doubleArrow} width={20} height={20} alt={"icon"} />
                <div className="txWrap">
                    <img src={iconMap[chain2.id]} alt="" />
                    <div className="tokenDetails">
                        <div className="txWraptoken">{input2}{chain2.nativeCurrency.symbol}</div>
                        <div className="txWrapnetwork">{chain2.name}</div>
                    </div>
                </div>
            </div>
            </div>
        </CommonModal>
    </div>
  )
}

export default TransactionPopup