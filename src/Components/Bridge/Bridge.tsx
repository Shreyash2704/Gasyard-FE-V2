import React, { useEffect, useState } from "react";
import "./Bridge.css";
import downArrw from "../../assets/down-arrow.svg";
import CloseIcon from "../../assets/CloseIcon.svg";
import { useChains } from "wagmi";
import selectLogo from "../../assets/chains/select.png";
import { useWalletInfo } from "@web3modal/wagmi/react";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
// import { writeContract } from '@wagmi/core'
import { useWriteContract,useSimulateContract } from 'wagmi'
import { abi } from '../../Config/abi'
import { iconMap,ChainJsonData } from "../../Config/data";
import QuoteSection from "../QuoteSection/QuoteSection";
import { useContractWrite } from "wagmi";
import { useSendTransaction,useTransactionReceipt } from 'wagmi';

import {
  chainType,
  Network,
  Networks,
  quoteType,
  ImageMapType,
} from "../../Config/types";
import { parseEther } from "viem";
import SelectChainModal from "../SelectChainModal/SelectChainModal";

import { mainnet } from 'viem/chains'
import { config } from "../../Config/config";
import { PortfolioAPI, sendTransaction } from "../../Config/API/api";
import { Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatHelpText, StatLabel, StatNumber, useDisclosure } from "@chakra-ui/react";
import SelectChainModalNew from "../SelectChainModal/SelectChainModal_new";


type Props = {};


const Bridge = (props: Props) => {
  const Chains = useChains();
  const [showDropdown1, setshowDropdown1] = useState<Boolean>(false);
  const [showDropdown2, setshowDropdown2] = useState<Boolean>(false);
  const [showAddress, setshowAddress] = useState(false);
  const [chain1, setchain1] = useState<chainType | null>(Chains[0]);
  const [chain2, setchain2] = useState<chainType | null>(Chains[1]);
  const [quoteData, setquoteData] = useState<quoteType | null>(null);
  const [inputToken, setinputToken] = useState("");
  const [outputToken, setoutputToken] = useState("");

  const [openChainPopup, setopenChainPopup] = useState(false)
  const [toSelectChain, settoSelectChain] = useState<0 | 1 | 2>(0)
  const [portfolio, setportfolio] = useState(null)
  const [recepientAddress, setrecepientAddress] = useState("")
  const [recepientAddressError, setrecepientAddressError] = useState("")

  const [sentAmount, setsentAmount] = useState("");
  const [receiveAmount, setreceiveAmount] = useState("");
  const [destinationAddress, setdestinationAddress] = useState("");

  const { walletInfo } = useWalletInfo();
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  const { open, selectedNetworkId } = useWeb3ModalState();
  const [transactionHash, setTransactionHash] = useState(null);
  
  const { chains, switchChain } = useSwitchChain();
  const { writeContract,data,isPending, isSuccess, status } = useWriteContract()
  const { isOpen, onOpen, onClose } = useDisclosure()


  

  const fetchQuote = async (chain1:any,chain2:any,inputToken:any) => {
    setquoteData(null)
    setoutputToken("")
    if(chain1 && chain2 && inputToken){
      const url = "https://gasyardbackend-production.up.railway.app/api/quote";

      const options = {
        method: "POST",
        body: JSON.stringify({
          inputNetwork: chain1 && chain1.id,
          outputNetwork: chain2 && chain2.id,
          inputTokenAmount: parseFloat(inputToken) * 1000000000000000000,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await fetch(url, options);

      const result = await response.json();
      console.log(result);
      setquoteData({
        fees: result.totalFees,
        outputTokenAmount: result.outputTokenAmount,
      });
      setoutputToken(result.outputTokenAmount);
    }
  };

 

  const ToggleDD = (ele: 0 | 1 | 2) => {
    // setshowDropdown1(false);
    // setshowDropdown2(false);
    // if (ele === 1) {
    //   setshowDropdown1(!showDropdown1);
    // } else {
    //   setshowDropdown2(!showDropdown2);
    // }
    settoSelectChain(ele)
    // changeModal(true)
    onOpen()

  };

  const onSelectChain = (chain: any, id: any) => {
    console.log("chain =>", chain);
    if (id === 1) {
      setchain1(chain);
      setshowDropdown1(false);
     

      if (chain2 && chain.id === chain2.id) {
        setchain2(null);
        
      }
    } else {
      setchain2(chain);
      setshowDropdown2(false);
    }

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
    fetchQuote(chain1,chain2,inputToken);
  };

  const onSubmit = async() =>{
    if(chain1 && chain2 && address){

      const result = await writeContract({
        abi, 
        address: chain1.contractAddress,
        functionName: 'bridgeTo',
        args: [
          chain2.id,
          address
        ],
        value:parseEther(inputToken)
      })
      
      console.log(result)
      
    }
  }

  const onChangeRecpAddress = (e:any) =>{
    var value = e.target.value
    if (!value.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
      setrecepientAddressError('address must be a EVM WalletAddress');
    }else{
      setrecepientAddressError("")
    }
    setrecepientAddress(value)
  }

  const changeModal = (value:boolean,chain:chainType | null=null) =>{

    if(toSelectChain !== 0 && chain){
      if(toSelectChain === 1){
        setchain1(chain)

        if (chain2 && chain.id === chain2.id) {
          setchain2(null);
          
        }
      }else{
        setchain2(chain)
      }
    }
    setopenChainPopup(value)
  }

  const fetchPortfolio = async() =>{
    const result = await PortfolioAPI(address)
    console.log(result)
    setportfolio(result)
  }
  useEffect(() => {      
    fetchQuote(chain1,chain2,inputToken)
  }, [chain1,chain2,data])

  useEffect(() => {
    if(address){
      setrecepientAddress(address)
      fetchPortfolio()
    }
  }, [address])

  useEffect(() => {
    if(status === "success" && chain1){
      sendTransaction(data,chain1.id)
    }
  }, [data,status])
  
  return (
    <div className="BridgeRoot">
      <div className="BridgeApp">
        {/* <w3m-network-button/> */}
        <div className="Connection">
          {chain ? (
            <div className="connected">Connected to {chain.name}</div>
          ) : (
            <div className="not_connected">Not Connected</div>
          )}
        </div>
        <p>{data && data}{status}{isConnecting}</p>
        <div className="Section from">
          <div className="leftSection">
            <label htmlFor="">You Send</label>
            <input
              type="text"
              placeholder="100"
              value={inputToken}
              onChange={handleInputChange1}
              onBlur={handleBlurEvent}
              onKeyPress={(e) => {
                if (!isNumberKey(e)) {
                  e.preventDefault();
                }
              }}
            />
            <span>$ 100.01</span>
            
          </div>
          <div className="rightSection">
            <div className="selectChain" onClick={() => ToggleDD(1)}>
              <img
                className="chain-logo"
                src={chain1 ? iconMap[chain1.id] : ""}
              />
              <span>{chain1 !== null ? chain1.name : "Select Chain"}</span>
              <img src={downArrw} />
            </div>

            {showDropdown1 && (
              <div className="dropdown d1">
                {Chains.map((chain) => {
                  return (
                    <>
                      <p key={chain.id} onClick={() => onSelectChain(chain, 1)}>
                        <img
                          className="chain-logo"
                          alt="logo"
                          src={iconMap[chain["id"]]}
                        />
                        {chain.name}
                      </p>
                    </>
                  );
                })}
              </div>
            )}
            <span>
              Balance: 0{" "}
              {chain1 && chain1?.nativeCurrency.symbol}
            </span>
          </div>
        </div>
        {/* sect2 */}
        <div className="Section from">
          <div className="leftSection">
            
            {/* <input
              type="text"
              placeholder="100"
              value={inputToken}
              onChange={handleInputChange1}
              onBlur={handleBlurEvent}
              onKeyPress={(e) => {
                if (!isNumberKey(e)) {
                  e.preventDefault();
                }
              }}
            /> */}
           <Stat>
              <StatLabel>Send amount</StatLabel>
              <StatNumber><input
                type="text"
                placeholder="100"
                value={inputToken}
                onChange={handleInputChange1}
                onBlur={handleBlurEvent}
                onKeyPress={(e) => {
                  if (!isNumberKey(e)) {
                    e.preventDefault();
                  }
                }}
            /> </StatNumber>
              <StatHelpText>You send $100</StatHelpText>
            </Stat>
          </div>
          <div className="rightSection">
            
            <Menu>
              <MenuButton as={Button} px={4}
                className="SelectMenu"
                py={2}
                background="rgba(249, 250, 251,1)"
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.400' }}
                // _expanded={{ bg: 'blue.400' }}
                // _focus={{ boxShadow: 'outline' }}
                >
                  <img
                className="chain-logo"
                src={chain1 ? iconMap[chain1.id] : ""}
              />
            {chain1 !== null ? chain1.name : "Select Chain"}
              </MenuButton>
              <MenuList>
              {Chains.map((chain) => {
                  return (
                    <>
                    <MenuItem key={chain.id} className="SelectMenuItem" onClick={() => onSelectChain(chain, 1)}><img
                          className="chain-logo"
                          alt="logo"
                          src={iconMap[chain["id"]]}
                        />{chain.name}</MenuItem>
                    </>
                  )
                })
              }
              
              </MenuList>
            </Menu>
            {showDropdown1 && (
              <div className="dropdown d1">
                {Chains.map((chain) => {
                  return (
                    <>
                      <p key={chain.id} onClick={() => onSelectChain(chain, 1)}>
                        <img
                          className="chain-logo"
                          alt="logo"
                          src={iconMap[chain["id"]]}
                        />
                        {chain.name}
                      </p>
                    </>
                  );
                })}
              </div>
            )}
            <span>
              Balance: 0{" "}
              {chain1 && chain1?.nativeCurrency.symbol}
            </span>
          </div>
        </div>

        <div className="Section to">
          <div className="leftSection">
            <label htmlFor="">You Receive</label>
            <input type="text" placeholder="100" value={outputToken} readOnly />
            <span>$ 100.01</span>
          </div>
          <div className="rightSection">
            <div className="selectChain" onClick={() => ToggleDD(2)}>
              <img
                className="chain-logo"
                src={chain2 ? iconMap[chain2.id] : selectLogo}
              />
              <span>{chain2 !== null ? chain2.name : "Select Chain"}</span>
              <img src={downArrw} />
            </div>
            {showDropdown2 && (
              <div className="dropdown d2">
                {Chains.map((chain) => {
                  if (chain1 && chain1.id === chain.id) {
                    return "";
                  } else {
                    return (
                      <>
                        <p
                          key={chain.id}
                          onClick={() => onSelectChain(chain, 2)}
                        >
                          <img
                            className="chain-logo"
                            alt="logo"
                            src={iconMap[chain["id"]]}
                          />
                          {chain.name}
                        </p>
                      </>
                    );
                  }
                })}
              </div>
            )}
            <span>
            Balance: {/*  { portfolio && chain2 && portfolio[chain2?.name.toLowerCase()].balance ? portfolio[chain2?.name.toLowerCase()].balance : "NA" }{" "} */}
              {chain2 && chain2.nativeCurrency.symbol}
            </span>
          </div>
        </div>

        <div className={`AddAddress  ${showAddress ? "hideDiv" : ""}`}>
          <img
            src="https://img.freepik.com/premium-vector/add-icon-add-post-video-photo-vector-images_292645-294.jpg"
            onClick={() => setshowAddress(true)}
          />
          Add Receipent Address
        </div>

        {/* <AddRecepientAddress show={showAddress} setshowAddress={setshowAddress}/> */}
        <div
          className={`RecepientAddressRoot ${!showAddress ? "hideDiv" : ""}`}
        >
          <div className="RecepientAddressTitle">
            Enter Recepient Address
            <img src={CloseIcon} onClick={() => setshowAddress(false)} />
          </div>
          <hr></hr>
          <div className="RecepientAddressSection">
            <div className="enterAddress">
              <input type="text" placeholder="Destination Address" value={recepientAddress} onChange={onChangeRecpAddress} />
             {recepientAddressError !== "" && <span className="errorMsg">{recepientAddressError}</span>}
            </div>
          </div>
        </div>
{/* 
        {quoteData && (
          <QuoteSection
            address={recepientAddress}
            transactionTime={"1.2s"}
            fees={String(quoteData.fees)}
          />
        )} */}
        {chain && chain1 ? (
          chain?.id === chain1.id ? (
            <button className="BridgeBtn" onClick={onSubmit}>Create Transaction</button>
          ) : (
            <button className="BridgeBtn switch_btn " onClick={() => {
        
              switchChain({
                chainId:chain1.id
              })
            }}>Switch Network</button>
          )
        ) : (
          <button disabled className="BridgeBtn not_connected_btn ">Not Connected</button>
        )}
      </div>
      <SelectChainModal open={openChainPopup} setModal={changeModal} chain_1={chain1} chain_2={chain2} toselectChain={toSelectChain} portfolio={portfolio}/>
      <SelectChainModalNew open={openChainPopup} setModal={changeModal} chain_1={chain1} chain_2={chain2} toselectChain={toSelectChain} portfolio={portfolio} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
    </div>
  );
};

export default Bridge;
