import React, { useEffect, useState } from 'react'

import { useAccount, useEnsName } from 'wagmi';
import { shortenAddress } from '../../Config/utils';

type Props = {
    address:any
}
const WalletEnsName = ({ address }:Props) => {
    const{chain} = useAccount()
    const [name, setname] = useState("")
  const { data: ensName,error } = useEnsName({
    address: address,
    chainId: 1,
  });

  useEffect(() => {
    console.log("ensName",ensName,error)
   if(ensName){

    setname(ensName)
   }
  }, [ensName,error])
  

  

  return (
    <>{name !== "" ? name : shortenAddress(address)}</>
  );
};

export default WalletEnsName;
