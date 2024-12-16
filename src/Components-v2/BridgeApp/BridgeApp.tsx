import React, { useEffect, useState } from 'react'
import TokenWrap from './TokenWrap'
import token from '../../assets/v2/bridge/eth.svg'
import './BridgeApp.css'
import Quote from './Quote'
import switchTokenLogo from '../../assets/v2/bridge/CurrencySwitcher.svg'

import { Spinner, useDisclosure } from '@chakra-ui/react'
import SelectChainModal from '../SelectChainModal/SelectChainModal'
import { observer } from 'mobx-react'
import { CompareValues, FetchPortfolioBalance, getUSDAmount } from '../../Config/utils'
import AppstoreV2 from '../../Config/Store/AppstoreV2'
import { useAccount, useChains, useSwitchChain, useTransactionReceipt, useWriteContract } from 'wagmi'
import { chainType, PortfolioListReturnType } from '../../Config/types'
import { GetBalanceReturnType } from 'viem'
import { ethers, formatEther, parseEther, BigNumberish, toBigInt } from 'ethers'
import { portfolioStore } from '../../Config/Store/Portfolio'
import { fetchQuote, sendTransaction } from '../../Config/API/apiV2'
import { customChainId } from '../../Config/data'
import FormStore from '../../Config/Store/FormStore'
import { abiV2 } from '../../Config/abi'
import { evmAddressToBytes32 } from '../../Config/addressHandlers'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import ReviewSwap from '../ReviewSwap/ReviewSwap'
import ReviewQuote from './ReviewQuote'
import CloseIcon from '../../assets/CloseIcon.svg'
import TransactionPopup from '../TransactionPopup/TransactionPopup'


type Props = {}

const BridgeApp = observer((props: Props) => {
  const [input1, setinput1] = useState<string | null>(null)
  const [input2, setinput2] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [toSelectChain, settoSelectChain] = useState<0 | 1 | 2>(0);
  const Chains = useChains();
  // const toast = useToast()
  const [chain1, setchain1] = useState<chainType | null>(Chains[0]);
  const [chain2, setchain2] = useState<chainType | null>(Chains[1]);
  const [openChainPopup, setopenChainPopup] = useState(false);
  const [portfolio, setportfolio] = useState<PortfolioListReturnType | null>(null);
  const [accBalance1, setaccBalance1] = useState("");
  const [accBalance2, setaccBalance2] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(input1);
  const [showReview, setshowReview] = useState(false)
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const {writeContract,data, isPending, isSuccess, status,error} = useWriteContract()
  const { data: txReceiptData } = useTransactionReceipt({
    hash: data
  })
  const { open, close } = useWeb3Modal();
  const [openTransactionPopup, setopenTransactionPopup] = useState(false);
  const [outputTxHash, setoutputTxHash] = useState<string | null>(null)
  const [btnText, setbtnText] = useState("Bridge")
  const handleInputChange1 = async(e: any) => {
    var value = e.target.value;

    var ele = value.split(".");
    if (ele[1] && ele[1].length > 5) {
      var e = ele[1];
      e = e.substring(0, 5);
      value = ele[0] + "." + e;
    }

    setinput1(value);
    // const val = await getUSDAmount(chain1?.nativeCurrency.symbol)
    // AppstoreV2.settokenVal1inUSD(val * parseFloat(value))

  };
  const ClearState = () => {
    setinput1("")
    setinput2("")
    setshowReview(false)
  }

  const setTransactionModal = (value: boolean) => {
    setopenTransactionPopup(value);
  };
  const changeModal = (value: boolean, chain: chainType | null = null) => {
    console.log(value);
    if (toSelectChain !== 0 && chain) {
      if (toSelectChain === 1) {
        console.log("changed chain",chain.name)
        setchain1(chain);
        // AppstoreV2.setChain1(chain);

        if (chain2 && chain.id === chain2.id) {
          console.log("changed chain",chain.name)
          setchain2(null);
          // FormStore.setChain2(null);
        }
      } else {
        setchain2(chain);
        console.log("changed chain",chain.name)
        // FormStore.setChain2(chain);
      }
    }
    setopenChainPopup(value);
    // FormHandler()
  };
  const ToggleDD = (ele: 0 | 1 | 2) => {
    settoSelectChain(ele);
    onOpen();

  };
  const roundDecimal = (numStr: string) => {
    const num = parseFloat(numStr);
    const decimalPlaces = numStr.split(".")[1]?.length || 0;
    //console.log("round decimal:", num);
    if (decimalPlaces > 4) {
      return num.toFixed(4);
    } else {
      return num.toFixed(decimalPlaces);
    }
  };
  const setAccountBalance = (portfolio: any) => {
    if (chain1 && portfolio && portfolio[chain1.id]) {
      var gweiValue;
      
      gweiValue = parseEther(
        String(portfolio[chain1.id].balance)
      );


      const amount = formatEther(gweiValue);
      setaccBalance1(roundDecimal(amount));
    }
    if (chain2 && portfolio && portfolio[chain2.id]) {
      var gweiValue;
      
      gweiValue = parseEther(
        String(portfolio[chain2.id].balance)
      );


      const amount = formatEther(gweiValue);
      setaccBalance2(roundDecimal(amount));
    }
    if(chain1 === null || chain1 === undefined){
      setaccBalance1("")
    }
    if(chain2 === null || chain2 === undefined){
      setaccBalance2("")
    }
  };
  const fetchPortfolio = async (address: any) => {
    // const result = await PortfolioAPI(address);
    const result = await FetchPortfolioBalance(Chains, address)
    console.log("portfolio", result);
    setportfolio(result);
    setAccountBalance(result);
  };
  const fetctQuoteAPi = async() =>{
    if(chain1 && chain2 && debouncedValue){
      const res = await fetchQuote(customChainId[chain1.id.toString()],customChainId[chain2.id.toString()],debouncedValue)
      console.log("fetch quote =>",res)
      const ether = formatEther(res.outputTokenAmount.toString());
       //@ts-ignore
      setinput2(ether)
      if(!CompareValues(roundDecimal(debouncedValue),portfolioStore.portfolio[chain1.id].balance)){
        setbtnText("Low Liquidity!")
      }
       
      
    
      AppstoreV2.settokenVal2inUSD(res.outputValueInUSD)
    }
  }
  const reverseChain = async () => {
    const temp = chain1;
    setchain1(chain2);
    // await FormStore.setChain1(chain2)
    setchain2(temp);
    // await FormStore.setChain2(temp)
  };

  //@ts-ignore
  const ReturnBalance = ({id}) => {
    console.log("return balance ",id)
    if (address) {
      if(id === 1) {
        return (
          <>{accBalance1 != "" && chain1 ? accBalance1 + ` ${chain1 && chain1.nativeCurrency.symbol}` 
          : chain1 === null ? "" : <Spinner size="xs" />}</>
        );
      }
      if(id === 2){
        return (
          <>{accBalance2 != "" && chain2 ? accBalance2 + ` ${chain2 && chain2.nativeCurrency.symbol}` :
          chain2 === null ? "" : <Spinner size="xs" />}</>
        );
      }
      
    } else {
      return "NA"
    }
  };

  const onSubmit = async () => {
    if (
      chain1 &&
      chain2 &&
      chain &&
      address &&
      debouncedValue &&
      debouncedValue !== "" &&
      CompareValues(
        roundDecimal(debouncedValue),
        portfolioStore.portfolio[chain1.id].balance
      )
    ) {
      
      try {
        
        const result = await writeContract({
          abi:abiV2,
          address: chain1.contractAddress,
          functionName: "bridge",
          args: [
            customChainId[chain2.id],
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            parseEther(debouncedValue),
            evmAddressToBytes32(address),
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
          //@ts-ignore
          value: parseEther(debouncedValue),
        });
       
       setopenTransactionPopup(true)
      } catch (err) {
        console.log("err", err);
      }
    }
    //@ts-ignore
    
    console.log(chain1,chain2,address,debouncedValue,portfolioStore.portfolio)
  };
  useEffect(() => {
    if(address){
      fetchPortfolio(address)
    }
    
  }, [address])
  useEffect(() => {
    setAccountBalance(portfolio);
  }, [chain1, chain2]);
  useEffect(() => {
    fetctQuoteAPi()
    setbtnText("Bridge")
    // if(chain2){
    //   setaccBalance2()
    // }
  }, [chain1,chain2,debouncedValue])
  useEffect(() => {
    //@ts-ignore
    setinput2("")
    AppstoreV2.settokenVal2inUSD("0")

    const handler = setTimeout(async() => {
      var value = input1
      setDebouncedValue(value);
      setinput1(value)
     
      if (chain1) {
        const usdRate = FormStore.getTokenRateKey(chain1.nativeCurrency.symbol);
        var val = value !== "" ? value : "0";
        //@ts-ignore
        AppstoreV2.settokenVal1inUSD(usdRate ? usdRate * parseFloat(val):"n/a")
      }
    }, 1000); // 0.5 seconds

    // Cleanup timeout if the effect is called again before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [input1]);
  useEffect(() => {
    if (txReceiptData !== undefined && status === "success" && chain1 && chain1) {
      sendTransaction(data,customChainId[chain1.id])
    }
  }, [data, status, txReceiptData])
  
  
  useEffect(() => {
    if (chain1) {
      const usdRate = FormStore.getTokenRateKey(chain1.nativeCurrency.symbol);
      var val = input1 !== "" ? input1 : "0";
      //@ts-ignore
      AppstoreV2.settokenVal1inUSD(usdRate ? usdRate * parseFloat(val):"n/a")
    }
    
  }, [chain1])
  console.log("debouncedValue",debouncedValue)

  useEffect(() => {
    console.log("contract->",isPending, isSuccess, status,error)
  }, [isPending, isSuccess, status,error])
  
  useEffect(() => {
    console.log("debugg ",debouncedValue === undefined || debouncedValue === "" || debouncedValue === null || input2 === null || input2 === "",debouncedValue,input2)
  }, [debouncedValue,input2])
  
  
  
  return (
    <div className={`BridgeAppRoot ${showReview && "showReview"}`}>

      {
        showReview ? 
        <div className="reviewTitle">
          Review Swap
          <img src={CloseIcon} onClick={() => setshowReview(false)}/>
        </div> :<div className="bridgeTitle">Bridge</div>
      }
      
      {
        !showReview ? <div className="bridgeApp d-flex-col">
        <img className='CurrencySwitcher' src={switchTokenLogo} alt="" onClick={reverseChain} />
        <TokenWrap 
          id={1}
          label="You send"
          inputVal={input1}
          inputInDollars={AppstoreV2.tokenVal1inUSD}
          token={chain1?.nativeCurrency?.symbol}
          //@ts-ignore
          // balance={address && portfolio && chain1 && portfolio[chain1.id] ? (portfolio[chain1.id].balance )  : "N/A"}
          balance={<ReturnBalance id={1}/>}
          tokenImg={chain1?.iconUrl}
          onClick={ToggleDD}
          onChange={handleInputChange1}
        />
        <TokenWrap 
          id={2}
          label="You receive"
          inputVal={input2}
          inputInDollars={AppstoreV2.tokenVal2inUSD}
          token={chain2?.nativeCurrency?.symbol}
          //@ts-ignore
          balance={<ReturnBalance id={2}/>}
          tokenImg={chain2?.iconUrl}
          onClick={ToggleDD}
          readonly={true}
          className="receive-token"
        />
        <Quote 
          token1={chain1 && chain1}
          token2={chain2 && chain2}
          val_token1={input1}
          val_token2={input2}
        />
        {/* {
          address ? 
           chain && chain1 && chain.id !== chain1.id ? (
            <button className='submit-btn' onClick={() =>{
              switchChain({
                chainId:chain1.id
              })
            }}>Switch Chain</button>
           
          ):(
            <button className='submit-btn' onClick={onSubmit}>Bridge</button>
          )
          :
          (<button className='submit-btn' onClick={() => open()}>Connect Wallet</button>)
          
        } */}
        
        <button className='submit-btn' onClick={() => setshowReview(true)} disabled={debouncedValue === undefined || debouncedValue === "" || debouncedValue === null || input2 === null || input2 === ""}>Review</button>
      </div>  :
        <div className="ReviewSwapWrap d-flex-col">
        <ReviewSwap token={input1 ? input1 : "NA"} label={"You Send"} chain={chain1} usd={AppstoreV2.tokenVal1inUSD} />
        <ReviewSwap token={input2 ? input2 : "NA"} label={"You Receive"} chain={chain2} usd={AppstoreV2.tokenVal2inUSD} />
        {
          address ? 
           chain && chain1 && chain.id !== chain1.id ? (
            <button className='submit-btn' onClick={() =>{
              switchChain({
                chainId:chain1.id
              })
            }}>Switch Chain</button>
           
          ):(
            <button className='submit-btn' onClick={onSubmit}>{btnText}</button>
          )
          :
          (<button className='submit-btn' onClick={() => open()}>Connect Wallet</button>)
          
        } 
        <ReviewQuote outputToken={input2 ? input2 : " "} network={chain1 ? chain1.name : " "} />

        <TransactionPopup 
        chain1={chain1} 
        chain2={chain2} 
        input1={input1} 
        input2={input2} 
        isOpen={openTransactionPopup}
        onOpen={onOpen}
        onClose={onClose}
        setModal={setTransactionModal}
        rejected={status === "error"}
        success={status === "success"}
        pending={status === "pending"}
        txHash={data}
        
        ClearState={ClearState}
        />
        
      </div>
      }
      
      
      

      <SelectChainModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        setModal={changeModal}
        open={openChainPopup}
        chain_1={chain1}
        chain_2={chain2}
        toSelectChain={toSelectChain}
        portfolio={portfolio}
        />
      
    </div>
  )
})

export default BridgeApp