import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { iconMap } from "../../Config/data";
import "./LiquidityPopup.css";
import { useAccount, useSwitchChain, useTransactionReceipt, useWriteContract } from "wagmi";
import { AbiPool } from "../../Config/JSON/AbiPool";
import { formatEther, parseEther } from "viem";
import LiquidityTransactionPopup from "../TransactionPopup/LiquidityTransactionPopup";
import { CompareValues, convertEthToUsd, getUSDAmount } from "../../Config/utils";
import { observer } from "mobx-react";

type Props = {
  is_liquidtyModalOpen: boolean;
  onOpen: any;
  on_liquidtyModalClose: any;
  chain?:any;
  balance:any;
  balanceinUSD?:any
  fetchAllBalance:any
};
const LiquidityWithdrawPopup = observer(({ is_liquidtyModalOpen, on_liquidtyModalClose, chain,balance,balanceinUSD,fetchAllBalance }: Props) => {
  const [inputValue, setInputValue] = useState("");
  //const balance = 10;

  const {writeContract,status,error,data} = useWriteContract();
  const {data:txReceiptData} = useTransactionReceipt({
    hash:data
  })
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [openTransactionPopup, setopenTransactionPopup] = useState(false);

  const {
    address,
    isConnecting,
    isDisconnected,
    chain: curr_chain,
  } = useAccount();

  const { switchChain } = useSwitchChain();
  const ClearState = () =>{
    setInputValue("")
  }
  const setTransactionModal = (value: boolean) => {
    setopenTransactionPopup(value);
  };
  const handleInputChange = (e:any) => {
    var value = e.target.value;
    console.log(value)
    // var ele = value.split(".");
    // if (ele[1] && ele[1].length > 5) {
    //   var e = ele[1];
    //   e = e.substring(0, 5);
    //   value = ele[0] + "." + e;
    // }
    setInputValue(value);
  };

  const onClickPercent = (percent:number) =>{
    setInputValue(formatEther(balance*BigInt(percent*100)/BigInt(100)))
  }
  const onSubmit = ()=>{
    try{
      const res = writeContract({
        abi:AbiPool,
        address:chain.liquidityPool,
        functionName: 'removeFromPool',
        args: [
          parseEther(inputValue),
        ],
      })
      on_liquidtyModalClose()
      setopenTransactionPopup(true)
    }catch(err){

    }
  }


 
  const isNumberKey = (evt: any) => {
    const charCode = evt.which ? evt.which : evt.keyCode;

    // Check if the character is a dot (.)
    if (charCode === 46) {
      // Allow the dot if it's not already present in the input value
      if (inputValue.indexOf(".") === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      // Allow digits (0-9)
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    console.log("Error ->",error?.cause,error?.message,error?.name,error)
  }, [error])
  useEffect(() => {
    
  }, [data])

  useEffect(() => {
    fetchAllBalance()
  }, [txReceiptData])
  return (
    <div className="LiquidityPopupRoot">
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal blockScrollOnMount={false} isOpen={is_liquidtyModalOpen} onClose={on_liquidtyModalClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "26px",
            width: "434px",
            boxShadow: "0px 0px 0px 1px #09194821,0px 1px 2px 0px #12376914",
          }}
        >
          <ModalHeader borderBottom="1px solid #F1F2F4">Withdraw {status} 
            
          </ModalHeader>
          <ModalCloseButton onClick={() =>{
            setInputValue("")
          }} />
          <ModalBody paddingLeft={"0px"} paddingRight={"0px"}>
            <div className="BodyWrap">
              <div className="amountDisplayWithdrawWrap">
                <div className="amountDisplayWithdraw">
                  <div className="chain-token-display">
                    <div className="displayImage">
                      <img src={chain && iconMap[chain.nativeCurrency.symbol]} className="chain" />
                      <img src={chain && iconMap[chain.id]} className="token" />
                    </div>
                    <div className="displayName">{chain && chain.nativeCurrency.symbol}-{chain && chain.name}</div>
                  </div>
                  <div className="liquidityInfo">
                    <div className="liquidityInfoRow">
                      <div className="label">Liquidity Provided</div>
                      <div className="value">
                        {formatEther(balance)} {chain && chain.nativeCurrency.symbol} <span>(~ {balanceinUSD})</span>
                      </div>
                    </div>
                    <div className="liquidityInfoRow">
                      <div className="label">Fees Earned</div>
                      <div className="value">$0</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chainDisplay">
                <img src={chain && iconMap[chain.id]} className="chainImg" />
                <div className="chainInfo">
                {chain && chain.nativeCurrency.symbol} <span className="balance">Balance: {formatEther(balance)}</span>
                </div>

                <input 
                placeholder="0.0" 
                type="text" 
                className="inputAmount" 
                onChange={handleInputChange}
                onKeyPress={(e) => {
                   if (!isNumberKey(e)) {
                     e.preventDefault();
                   }
                 }}
                value={inputValue}
                />
              </div>
              <div className="percentDisplay">
                <button onClick={() => onClickPercent(0.25)}>25%</button>
                <button onClick={() => onClickPercent(0.5)}>50%</button>
                <button onClick={() => onClickPercent(0.7)}>75%</button>
                <button onClick={() => onClickPercent(1)}>100%</button>
              </div>
              <div className="QuoteDisplay">
                {/* <div className="quote_row">
                  <div className="quote_column col1">Points Earned</div>
                  <div className="quote_column col2">
                    <span className="coin"></span>+400
                  </div>
                </div> */}
                <div className="quote_row">
                  <div className="quote_column col1">Network</div>
                  <div className="quote_column col2">Base</div>
                </div>
                {/* <div className="quote_row">
                  <div className="quote_column col1">Network Fee</div>
                  <div className="quote_column col2">$0.12 USD</div>
                </div> */}
              </div>
              <div className="SubmitBtn">
              {curr_chain && chain && chain.id === curr_chain.id ? (<>
                <button onClick={onSubmit} disabled={!CompareValues(inputValue,String(balance))}>Withdraw</button>
              </>):(<>
                <button
                    onClick={() => {
                      switchChain({
                        chainId: chain.id,
                      });
                    }}
                  >
                    Switch Chain
                  </button>
              </>)}
                
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <LiquidityTransactionPopup 
       isOpen={openTransactionPopup}
       onOpen={onOpen}
       onClose={onClose}
       setModal={setTransactionModal}
       rejected={status === "error"}
       success={status === "success"}
       pending={status === "pending"}
       onSubmit={onSubmit}
       txReceiptHash={txReceiptData}
       chain={chain}
       ClearState={ClearState}
       error={error ? error.message : ""}
       txHash={data}
       isDeposit={false}
      />
    </div>
  );
});

export default LiquidityWithdrawPopup;
