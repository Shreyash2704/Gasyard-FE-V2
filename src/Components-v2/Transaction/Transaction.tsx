import React, { useEffect, useState } from "react";
import "./Transaction.css";
import { ChainJsonData, iconMap, reverseChainId } from "../../Config/data";
import { useChains } from "wagmi";
import CopyText from "../../assets/v2/copyText_2.svg";
import redirect from "../../assets/v2/redirect2.svg";
import arrow from "../../assets/v2/arrow.svg";
import { useParams } from "react-router-dom";
import { getListTransactionById, getListTransactions } from "../../Config/API/apiV2";
import { chainType, TxObjectV2Type } from "../../Config/types";
import { formatEther } from "viem";
import {
  copyToClipboard,
  getChainById,
  shortenAddress,
} from "../../Config/utils";
import { bytes32ToEvmAddress } from "../../Config/addressHandlers";
import { Tooltip } from "@chakra-ui/react";

type Props = {};
type TxProps = {
  type: string;
  status: string;
  hash: string;
  chain_id: number;
  token: string;
  timeStamp: string;
  address: string;
};

const TxBlock = ({
  type,
  status,
  hash,
  chain_id,
  token,
  timeStamp,
  address,
}: TxProps) => {
  const Chains = useChains();
  const [chain, setchain] = useState<chainType | null>(null);

  const redirectToTxExplorer = (id:number,hash:any) =>{
    console.log(id)
    const url = ChainJsonData[id].explorer+hash
    window.open(url, '_blank');
  }

  useEffect(() => {
    const ele = getChainById(Chains, reverseChainId[chain_id]);
    setchain(ele);
  }, [chain_id]);

  return (
    <div className="TxBlockWrap">
      <div className="TxType">
        {type} transaction<div className="Txstatus">{status}</div>
      </div>
      <div className="txHash">
        <div className="txHashLabel">{type} tx hash</div>
        <div className="txHashValue">
          {shortenAddress(hash, 14, 14)}
          <img src={redirect} alt={"redirect"} onClick={() => redirectToTxExplorer(reverseChainId[chain_id],hash)} />
          <Tooltip label="Copy address" bg="#161616">
            <img
              src={CopyText}
              alt="copy"
              onClick={() => copyToClipboard(hash)}
            />
          </Tooltip>
        </div>
      </div>
      <div className="txHashChain">
        <div className="tokenTransfer">
          <div className="chainTitle">
            Token {type === "source" ? "Sent" : "Receive"}
          </div>
          <div className="chainValue">
            <img src={chain ? iconMap[chain.id] : ""} alt="chain" />
            {token}
            {chain && chain.nativeCurrency.symbol}
          </div>
        </div>
        <div className="chainInfo">
          <div className="chainTitle">Chain</div>
          <div className="chainValue">
            <img src={chain ? iconMap[chain.id] : ""} alt="chain" />
            {chain && chain.name}
          </div>
        </div>
      </div>
      <div className="txHash">
        <div className="txHashLabel">
          {type === "Source" ? "Sender" : "Receiver"} Address
        </div>
        <div className="txHashValue">
          {" "}
          {bytes32ToEvmAddress(address)} 
          {/* <img src={redirect} alt={"redirect"} /> */}
          <Tooltip label="Copy address" bg="#161616">
            <img
              src={CopyText}
              alt="copy"
              onClick={() => copyToClipboard(bytes32ToEvmAddress(address))}
            />
          </Tooltip>
        </div>
      </div>
      <div className="txHash">
        <div className="txHashLabel">Timestamp</div>
        <div className="txHashValue">{timeStamp}</div>
      </div>
    </div>
  );
};

const Transaction = (props: Props) => {
  const TxId = useParams();
  const [data, setdata] = useState<TxObjectV2Type | null>(null);
  console.log(TxId.id);

  useEffect(() => {
    const getData = async (id: string) => {
      const res = await getListTransactionById(id);
      setdata(res.results[0]);
    };
    const gethashData = async (id: string) => {
      const res = await getListTransactions(0,
        TxId.txHash,
        null,
        null);
      setdata(res.results[0]);
      console.log("res",res)
    };
    if (TxId.id) {
      getData(TxId.id);
    }
    if(TxId.txHash){
      gethashData(TxId.txHash)
    }
  }, [TxId]);

  const Chains = useChains();
  return (
    <div className="TransactionRoot">
      {data && (
        <>
          <div className="txStatus">
            Status for {" "}
            {data.inputTxHash}
          </div>
          <div className="TransactionBlockWrap">
            <TxBlock
              type={"Source"}
              status={data.status}
              hash={data.inputTxHash}
              chain_id={data.inputChainID}
              token={formatEther(data.inputChainAmount)}
              timeStamp={data.createdAt}
              address={data.inputAddress ?? "NA"}
            />
            <img src={arrow} alt={"arrow"} />
            <TxBlock
              type={"Destination"}
              status={data.status}
              hash={data.outputTxHash ?? "NA"}
              chain_id={data.outputChainID}
              token={formatEther(data.outputChainAmount)}
              timeStamp={data.updatedAt}
              address={data.outputAddress ?? "NA"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Transaction;
