import React, { useEffect, useState } from "react";
import "./BridgeNew.css";
import downArrow from "../../assets/SVG-black.svg";
import { Spinner, Stat, StatNumber, useDisclosure, useToast } from "@chakra-ui/react";
import QuoteSection from "../QuoteSection/QuoteSection";
import { useAccount, useChains, useSwitchChain, useTransactionReceipt, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { chainType, PortfolioListReturnType, portfolioType, quoteType, TxObjectType } from "../../Config/types";
import { abi } from "../../Config/abi";
import { formatEther, parseEther } from "viem";
import { fetchTransactionObject, PortfolioAPI, sendTransaction } from "../../Config/API/api";
import SelectChainModalNew from "../SelectChainModal/SelectChainModal_new";
import arb_logo from "../../assets/arb_logo.svg";
import ReverseChain from "../../assets/reverse.svg";
import { getBalance } from "@wagmi/core";
import { config } from "../../Config/config";
import { type GetBalanceReturnType } from "@wagmi/core";
import TransactionPopup from "../TransactionPopup/TransactionPopup";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { convertEthToUsd, convertEthToWeiAndBack, FetchPortfolioBalance, getUSDAmount } from "../../Config/utils";
import { observer } from "mobx-react";
import FormStore from "../../Config/Store/FormStore";
import { ethers } from 'ethers';
import axios from "axios";
import { getTransactionReceipt } from '@wagmi/core'
import CloseIcon from "../../assets/CloseIcon.svg";
import addAddress from '../../assets/addAddress.svg'
import AddRecepient from "../AddRecepient/AddRecepient";
import quoteLoader from '../../assets/animations/quoteLoader.json'
import Lottie from "lottie-react";

type Props = {};

const BridgeNew = observer((props: Props) => {
  const Chains = useChains();
  const toast = useToast()
  const [chain1, setchain1] = useState<chainType | null>(Chains[0]);
  const [chain2, setchain2] = useState<chainType | null>(Chains[1]);

  FormStore.setChain1(Chains[0])
  FormStore.setChain2(Chains[1])

  const [inputToken, setinputToken] = useState("");
  const [outputToken, setoutputToken] = useState("");
  const [quoteData, setquoteData] = useState<quoteType | null>(null);
  const [openChainPopup, setopenChainPopup] = useState(false);
  const [openTransactionPopup, setopenTransactionPopup] = useState(false);
  const [toSelectChain, settoSelectChain] = useState<0 | 1 | 2>(0);
  const [portfolio, setportfolio] = useState<PortfolioListReturnType | null>(null);
  const [recepientAddress, setrecepientAddress] = useState<`0x${string}` | "">("");
  const [recepientAddressError, setrecepientAddressError] = useState("");
  const [allvalueFilled, setallvalueFilled] = useState(false);
  const [isQuoteInProgress, setisQuoteInProgress] = useState(false);

  const [usdRate, setusdRate] = useState("")
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const { writeContract, data, isPending, isSuccess, status } =
    useWriteContract();

  const { data: txReceiptData } = useTransactionReceipt({
    hash: data
  })
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accountBalance, setaccountBalance] = useState<
    GetBalanceReturnType | ""
  >("");
  const [accBalance, setaccBalance] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(inputToken);
  const [submitBtnText, setsubmitBtnText] = useState("Submit Transaction");
  const [disableSubmitBtn, setdisableSubmitBtn] = useState(false);
  const [objectId, setObjectId] = useState<string | null>(null);
  const [outputTxHash, setoutputTxHash] = useState<string | null>(null)
  const [txObject, settxObject] = useState<TxObjectType | null>(null)
  const [showAddress, setshowAddress] = useState(false);
  const [inputInUSD, setinputInUSD] = useState("")

  const { open, close } = useWeb3Modal();

  const ClearState = () => {
    setinputToken("")
    setoutputToken("")
    FormStore.setInputToken("")
    FormStore.setOuputToken("")
  }

  const showToast = () =>{
    toast({
      title: 'Migrating to v2!',
      description: "We are Migrating to v2 will be back soon",
      status: 'info',
      duration: null,
      isClosable: true,
      position:"bottom-left"
    })
  }
  const FormHandler = () => {
    console.log("Form handler called");
    if (
      chain1 &&
      chain2 &&
      address &&
      debouncedValue !== "" &&
      accBalance != "" &&
      CompareValues(roundDecimal(debouncedValue), accBalance)

    ) {
      setallvalueFilled(true);
      setdisableSubmitBtn(false)
      return true
    } else {
      setallvalueFilled(false)
      setdisableSubmitBtn(true)
      if (!chain1) {
        console.log("Chain1 empty")
      }
      if (!chain2) {
        console.log("Chain2 empty")
      }
      if (accBalance && !CompareValues(roundDecimal(debouncedValue), accBalance)) {
        //console.log("from form handler");
        setsubmitBtnText("Insufficient Gas");

      }

      return false
    }
  };

  const fetchQuote = async (chain1: any, chain2: any, inputToken: any) => {
    setquoteData(null);
    setoutputToken("");
    //setdisableSubmitBtn(false);
    FormStore.setOuputToken("");
    if (chain1 && chain2 && inputToken) {
      const isTestnet = process.env.REACT_APP_SERVER === "testnet"
      const domain = isTestnet ? process.env.REACT_APP_BACKEND_API_TESTNET : process.env.REACT_APP_BACKEND_API
      console.log("domain", domain, process.env.REACT_APP_BACKEND_API_TESTNET, process.env.REACT_APP_BACKEND_API)
      const url = `${domain}/api/quote`;
      var c1 = chain1.id === 920637907288165 ? 1802203764 : chain1.id
      var c2 = chain2.id === 920637907288165 ? 1802203764 : chain2.id
      const options = {
        method: "POST",
        body: JSON.stringify({
          inputNetwork: c1,
          outputNetwork: c2,
          inputTokenAmount: parseFloat(debouncedValue) * 1000000000000000000,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      setisQuoteInProgress(true);
      const response = await fetch(url, options);

      if (response.status === 400 || response.status === 500) {
        const result = await response.json();
        setdisableSubmitBtn(true);
        setquoteData(null);
        setsubmitBtnText(result.message)
        setallvalueFilled(true)//to be removed later
      } else {
        const result = await response.json();
        //console.log(result);
        setquoteData({
          fees: result.totalFees,
          outputTokenAmount: result.outputTokenAmount,
        });
        setoutputToken(result.outputTokenAmount.toFixed(5));
        FormStore.setOuputToken(result.outputTokenAmount.toFixed(5));
        if (result.hasLiquidity === false) {
          setsubmitBtnText("Low Liquidity!")
          setdisableSubmitBtn(true)
        } else {
          setsubmitBtnText("Submit Transaction")
          FormHandler();
        }
      }
      setisQuoteInProgress(false)
    } else {
      setdisableSubmitBtn(true)
    }

  };

  const ToggleDD = (ele: 0 | 1 | 2) => {
    settoSelectChain(ele);
    onOpen();

  };

  const handleInputChange1 = (e: any) => {
    var value = e.target.value;

    var ele = value.split(".");
    if (ele[1] && ele[1].length > 5) {
      var e = ele[1];
      e = e.substring(0, 5);
      value = ele[0] + "." + e;
    }

    setinputToken(value);

  };
  const isNumberKey = (evt: any) => {
    const charCode = evt.which ? evt.which : evt.keyCode;

    // Check if the character is a dot (.)
    if (charCode === 46) {
      // Allow the dot if it's not already present in the input value
      if (inputToken.indexOf(".") === -1) {
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
  const handleBlurEvent = () => {
    // fetchQuote(chain1,chain2,inputToken);
  };
  const onSubmit = async () => {
    if (
      chain1 &&
      chain2 &&
      address &&
      debouncedValue !== "" &&
      accBalance != "" &&
      CompareValues(
        roundDecimal(debouncedValue),
        accBalance
      )
    ) {
      try {
        const result = await writeContract({
          abi,
          address: chain1.contractAddress,
          functionName: "bridgeTo",
          args: [chain2.id === 920637907288165 ? 1802203764 : chain2.id , recepientAddress !== "" ? recepientAddress : address],
          value: parseEther(debouncedValue),
        });
        setopenTransactionPopup(true);
      } catch (err) {
        console.log("err", err);
      }
    }
    // else{
    //   if(accBalance === ""){
    //     setsubmitBtnText("Connect Wallet")
    //   }else if(parseFloat(roundDecimal(inputToken)) > Number(accountBalance.value)){
    //     setsubmitBtnText("Insufficient Gas")
    //   }

    // }
  };
  const onChangeRecpAddress = (e: any) => {
    var value = e.target.value;
    if (!value.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
      setrecepientAddressError("address must be a EVM WalletAddress");
    } else {
      setrecepientAddressError("");
    }
    setrecepientAddress(value);
  };
  const changeModal = (value: boolean, chain: chainType | null = null) => {
    //console.log(value);
    if (toSelectChain !== 0 && chain) {
      if (toSelectChain === 1) {
        setchain1(chain);
        FormStore.setChain1(chain);

        if (chain2 && chain.id === chain2.id) {
          setchain2(null);
          FormStore.setChain2(null);
        }
      } else {
        setchain2(chain);
        FormStore.setChain2(chain);
      }
    }
    setopenChainPopup(value);
    FormHandler()
  };
  const reverseChain = async () => {
    const temp = chain1;
    setchain1(chain2);
    // await FormStore.setChain1(chain2)
    setchain2(temp);
    // await FormStore.setChain2(temp)
  };
  const setTransactionModal = (value: boolean) => {
    setopenTransactionPopup(value);
  };
  const GetBalance = async () => {
    if (address && chain1) {
      const balance = await getBalance(config, {
        address: address,
        chainId: 1,
      });
      //console.log("balance", balance);
      setaccountBalance(balance);
    }
  };
  const fetchPortfolio = async (address: any) => {
    // const result = await PortfolioAPI(address);
    const result = await FetchPortfolioBalance(Chains, address)
    console.log("portfolio", result);
    setportfolio(result);
    setAccountBalance(result);
  };

  const setAccountBalance = (portfolio: any) => {
    if (chain1 && portfolio && portfolio[chain1.id]) {
      var gweiValue;
      //console.log("setAccountBalance");

      gweiValue = parseEther(
        String(portfolio[chain1.id].balance)
      );


      const amount = formatEther(gweiValue);
      setaccBalance(roundDecimal(amount));
    }
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
  const ReturnBalance = () => {
    if (address) {
      return (
        <>{accBalance != "" ? accBalance + ` ${chain1 && chain1.nativeCurrency.symbol}` : <Spinner size="xs" />}</>
      );
    } else {
    }
  };

  const ReturnConvertedValue = () =>{
    if(inputToken === "") return <>$0</>
    const res = 70;
    const usdPrice = convertEthToUsd(parseEther(inputToken),res)
    return <>{`$${usdPrice}`}</>
  }
  const calculateMaxValue = () => {
    console.log("max called")
    if (portfolio && chain1 && portfolio[chain1.id]) {
      var gweiValue;
      console.log("max gwei")
      gweiValue = parseEther(
        String(portfolio[chain1.id].balance)
      );
      console.log("max gwei", gweiValue)
      if (gweiValue > parseEther("0.0001")) {
        const max_amout = formatEther(gweiValue - parseEther("0.0001"));
        setinputToken(roundDecimal(max_amout));
      } else {
        const max_amout = formatEther(gweiValue);
        setinputToken(roundDecimal(max_amout));
      }
    }
  };


  const CompareValues = (input: string, balance: string) => {
    //console.log("bigint ",parseEther(balance),parseEther(input).valueOf())
    try {
      const inp = parseFloat(input) * 1e18
      const out = parseFloat(balance) * 1e18
      const to_subtract = parseFloat("0.0001") * 1e18
      const new_out = out - to_subtract;
      console.log("CompareValues", new_out, inp)
      return new_out >= inp
    }
    catch (err) {
      console.group("CompareValues err", err)
      return false
    }

  };

  const getTransactionObjectId = async (data: any, id: any) => {
    if (chain1) {
      try {
        const objId = await sendTransaction(data, id);
        if (objId.status && objId.status !== 200) {
          console.log(objId.msg.response.data.message)
          toast({
            title: 'Unexpected Error Occured!.',
            description: "There seems to be issue with your request please reachout to support on Live Chat",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        } else {
          setObjectId(objId.uniqueID)
        }


      } catch (error) {
        console.error('Error making POST request', error);
      }
    }
  }

  const getTransactionObject = async (id: string) => {
    const response = await fetchTransactionObject(id)
    if (response.outputTxHash) {
      setoutputTxHash(response.outputTxHash)
      settxObject(response)
      PortfolioAPI(address)
      return
    } else {
      setTimeout(() => {
        getTransactionObject(id)
      }, 5000);
    }
  }


  // const getTxRecipt = async(data:any) =>{
  //   const result = await getTransactionReceipt(config, {
  //     hash: data,
  //   })
  // }

  useEffect(() => {
    const handler = setTimeout(async() => {
      var ele = inputToken.split(".");
      var value = inputToken
      if (ele[1] === "") {
        value = ele[0] + "." + "0"
      }
      setDebouncedValue(value);
      FormStore.setInputToken(value);
      if (chain1) {
        const usdRate = FormStore.getTokenRateKey(chain1.nativeCurrency.symbol);
        var val = value !== "" ? value : "0";
        if(usdRate) setinputInUSD(convertEthToUsd(parseEther(val), usdRate));
      }
      setinputToken(value)
    }, 1000); // 0.5 seconds

    // Cleanup timeout if the effect is called again before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [inputToken]);
  useEffect(() => {
    console.log("debouncedValue", debouncedValue)
    fetchQuote(chain1, chain2, debouncedValue);
    setAccountBalance(portfolio);
  }, [chain1, chain2, debouncedValue]);

  useEffect(() => {
    if (address) {
      // setrecepientAddress(address);
      fetchPortfolio(address);
      // GetBalance();
    }
  }, [address]);

  useEffect(() => {
    if (txReceiptData !== undefined && status === "success" && chain1) {
      console.log("txreceipt:", txReceiptData)
      getTransactionObjectId(data, chain1.id);
      fetchPortfolio(address)
    }
    if (data) {
      console.log("txHash:", data)
    }
    FormStore.setTransactionHash(data)
  }, [data, status, txReceiptData]);

  useEffect(() => {
    if (objectId) {
      getTransactionObject(objectId)
    }
  }, [objectId]);

  useEffect(() => {
    console.log("chain1 set to", chain1?.name)
    FormStore.setChain1(chain1)
    const prev= inputToken
    setinputToken("0")
    setTimeout(() => {
      setinputToken(prev)
    }, 500);
    
  }, [chain1])
  useEffect(() => {
    console.log("chain1 set to", chain2?.name)
    FormStore.setChain2(chain2)
  }, [chain2])
 
  
  
  return (
    <div className="BridgeRoot">
      <div className="BridgeApp">
        <div className="headline">Bridge</div>

        <div className="from-chain">
          <div className="labels">
            <span className="tagline">From</span>
            <span className="balance">
              Balance:-{" "}
              <span>
                <ReturnBalance />
              </span>
            </span>
          </div>
          <button className="chain1-btn" onClick={() => ToggleDD(1)}>
            {chain1 && <img className="logo" src={chain1?.iconUrl} />}
            {chain1 !== null ? chain1.name : "Select Network"}
            <img className="downArrow" src={downArrow} />
          </button>
          <div className="token-container">
          <input
            type="text"
            placeholder="0.0"
            className="inputToken"
            value={inputToken}
            onChange={handleInputChange1}
            onBlur={handleBlurEvent}
            onKeyPress={(e) => {
              if (!isNumberKey(e)) {
                e.preventDefault();
              }
            }}
          />
          <div className="tokenInUSD">${inputInUSD}</div>
          </div>
          <button
            className="max-btn"
            onClick={() => {
              if (accBalance !== "") {
                // setinputToken(String(accountBalance.value))
                calculateMaxValue();
              }
            }}
          >
            Max
          </button>
          <img
            src={ReverseChain}
            className="reverse-chain"
            onClick={reverseChain}
          />
        </div>

        <div className="to-chain">
          <div className="labels">
            <span className="tagline">To</span>
          </div>
          <button className="chain2-btn" onClick={() => ToggleDD(2)}>
            {chain2 && <img className="logo" src={chain2?.iconUrl} />}
            {chain2 !== null ? chain2.name : "Select Network"}
            <img src={downArrow} className="downArrow" />
          </button>
          <input
            type="text"
            placeholder="0.0"
            className="outputToken"
            value={outputToken}
            readOnly
          />
        </div>

        <div className="review">
          <AddRecepient setrecepientAddress={setrecepientAddress} recepientAddress={recepientAddress} />

          {address === undefined ? (
            <>
              <button className=" review-btn" onClick={() => open()}>
                {" "}
                Connect Wallet
              </button>
            </>
          ) : chain1 && chain?.id !== chain1.id ? (
            <button
              className="review-btn"
              onClick={() => {
                switchChain({
                  chainId: chain1.id,
                });
              }}
            >
              Switch Network
            </button>
          ) :
            (
              <>
                {/* disabled={!allvalueFilled} */}

                {console.log(!allvalueFilled || disableSubmitBtn, allvalueFilled, disableSubmitBtn)}
                <button
                  className="review-btn"
                  disabled={!allvalueFilled || disableSubmitBtn || isQuoteInProgress}
                  onClick={onSubmit}
                >
                  {submitBtnText}
                </button>
              </>
            )}
        </div>

        {isQuoteInProgress ?
          (<>
            {console.log("inProgress")}
            <div className="loader">
              <Lottie
                animationData={quoteLoader}
                loop={true}
                style={{ height: "100px", width: "400px" }}
              />
            </div>
          </>) : quoteData && (
            <QuoteSection
              address={recepientAddress}
              transactionTime={"1.2s"}
              fees={String(quoteData.fees)}
              chain1={chain1?.name}
            />
          )}
      </div>
      <SelectChainModalNew
        open={openChainPopup}
        setModal={changeModal}
        chain_1={chain1}
        chain_2={chain2}
        toselectChain={toSelectChain}
        portfolio={portfolio}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <TransactionPopup
        isOpen={openTransactionPopup}
        onOpen={onOpen}
        onClose={onClose}
        setModal={setTransactionModal}
        rejected={status === "error"}
        success={status === "success"}
        pending={status === "pending"}
        onSubmit={onSubmit}
        txHash={outputTxHash}
        chain1={chain1}
        chain2={chain2}
        ClearState={ClearState}
      />

        
    </div>
  );
});

export default BridgeNew;
