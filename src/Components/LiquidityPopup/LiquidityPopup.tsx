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
import { AbiPool } from "../../Config/JSON/AbiPool";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ethers, formatEther, parseEther } from "ethers";
import LiquidityTransactionPopup from "../TransactionPopup/LiquidityTransactionPopup";
import {
  CompareValues,
  convertEthToUsd,
  getUSDAmount,
} from "../../Config/utils";
import { pool_abi } from "../../Config/abi";
import { observer } from "mobx-react";
import FormStore from "../../Config/Store/FormStore";
type Props = {
  is_liquidtyModalOpen: boolean;
  onOpen: any;
  on_liquidtyModalClose: any;
  chain?: any;
  balance: any;
  initialBal?: string;
  fetchAllBalance:any
};

const LiquidityPopup = observer(({
  is_liquidtyModalOpen,
  on_liquidtyModalClose,
  chain,
  balance,
  fetchAllBalance
}: Props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputInUSD, setinputInUSD] = useState<string>("0");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const { writeContract, data, isPending, isSuccess, status, error } =
    useWriteContract();
  const { data: txReceiptData } = useTransactionReceipt({
    hash: data,
  });

  const { switchChain } = useSwitchChain();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    address,
    isConnecting,
    isDisconnected,
    chain: curr_chain,
  } = useAccount();
  //const balance = 10;
  const [openTransactionPopup, setopenTransactionPopup] = useState(false);

  const ClearState = () => {
    setInputValue("");
  };

  const handleInputChange = (e: any) => {
    var value = e.target.value;

    var ele = value.split(".");
    if (ele[1] && ele[1].length > 5) {
      var e = ele[1];
      e = e.substring(0, 5);
      value = ele[0] + "." + e;
    }
    setInputValue(value);
  };

  const onClickPercent = (percent: number) => {
    setInputValue(String(balance * percent));
  };

  const setTransactionModal = (value: boolean) => {
    setopenTransactionPopup(value);
  };

  //const web3instance = new <Web></Web>()

  const onSubmit = () => {
    console.log("on deposit clicked", inputValue);
    try {
      const result = writeContract({
        abi: AbiPool,
        address: chain.liquidityPool,
        functionName: "addToPool",
        args: [parseEther(inputValue)],
        value: parseEther(inputValue),
      });
      on_liquidtyModalClose()
      setopenTransactionPopup(true);
      
    } catch (err) {
      console.log("err", err);
    }
  };
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
    console.log("Error ->", error?.cause, error?.message, error?.name, error);
  }, [error]);
  useEffect(() => {
    ClearState();
  }, []);
  useEffect(() => {
    const handler = setTimeout(async () => {
      var ele = inputValue.split(".");
      var value = inputValue;
      if (ele[1] === "") {
        value = ele[0] + "." + "0";
      }
      setDebouncedValue(value);
      if (chain) {
        const usdRate = FormStore.getTokenRateKey(chain.nativeCurrency.symbol);
        var val = value !== "" ? value : "0";
        usdRate && setinputInUSD(convertEthToUsd(parseEther(val), usdRate));
      }

      setInputValue(value);
    }, 1000); // 0.5 seconds

    // Cleanup timeout if the effect is called again before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    fetchAllBalance()
  }, [txReceiptData])
  
  return (
    <div className="LiquidityPopupRoot">
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal
        blockScrollOnMount={false}
        isOpen={is_liquidtyModalOpen}
        onClose={on_liquidtyModalClose}
      >
        <ModalOverlay />
        <ModalContent
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "26px",
            width: "434px",
            boxShadow: "0px 0px 0px 1px #09194821,0px 1px 2px 0px #12376914",
          }}
        >
          <ModalHeader borderBottom="1px solid #F1F2F4">
            Deposit {status}
          </ModalHeader>
          <ModalCloseButton onClick={() => {
             setInputValue("")
          }}/>
          <ModalBody paddingLeft={"0px"} paddingRight={"0px"}>
            <div className="BodyWrap">
              <div className="amountDisplay">
                <div className="nativeAmount">
                  <input
                    type="text"
                    placeholder="0.0"
                    style={{ width: `${inputValue.length + 3}ch` }}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (!isNumberKey(e)) {
                        e.preventDefault();
                      }
                    }}
                    value={inputValue}
                  />
                  <span className="nativeToken">
                    {chain && chain.nativeCurrency.symbol}
                  </span>
                </div>
                <div className="amountInUSD">${inputInUSD}</div>
              </div>
              <div className="chainDisplay">
                <img
                  src={chain && iconMap[chain.id]}
                  alt="logo"
                  className="chainImg"
                />
                <div className="chainInfo">
                  {chain && chain.nativeCurrency.symbol}
                  <span className="balance">Balance: {balance}</span>
                </div>
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
                  <div className="quote_column col2"><span className="coin"></span>+400</div>
                </div> */}
                <div className="quote_row">
                  <div className="quote_column col1">Network</div>
                  <div className="quote_column col2">{chain && chain.name}</div>
                </div>
                {/* <div className="quote_row">
                  <div className="quote_column col1">Network Fee</div>
                  <div className="quote_column col2">
                    $0.12 USD
                  </div>
                </div> */}
              </div>
              <div className="SubmitBtn">
                {curr_chain && chain && chain.id === curr_chain.id ? (
                  <button
                    onClick={onSubmit}
                    disabled={!CompareValues(inputValue, String(balance))}
                  >
                    Deposit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      switchChain({
                        chainId: chain.id,
                      });
                    }}
                  >
                    Switch Chain
                  </button>
                )}
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
        isDeposit={true}
      />
    </div>
  );
});

export default LiquidityPopup;
