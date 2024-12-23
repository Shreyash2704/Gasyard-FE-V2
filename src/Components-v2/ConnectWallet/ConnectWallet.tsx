import React, { useEffect } from 'react'
import './ConnectWallet.css'
import { AptosConnectButton, useAptosWallet } from '@razorlabs/wallet-kit';
import { Observer, observer } from 'mobx-react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Image, useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import RazorWallet from './razorWallet';
import { portfolioStore } from '../../Config/Store/Portfolio';
import { iconMap, SymbolsMap } from '../../Config/data';
import { getUSDAmount, roundDecimal, shortenAddress } from '../../Config/utils';
import FormStore from '../../Config/Store/FormStore';
import logoutIcon from '../../assets/v2/header/logout.svg'
import WalletEnsName from '../Explorer/WalletEnsName';


const ConnectWallet = observer(() => {
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  const wallet = useAptosWallet();
  console.log('wallet status', wallet.status);
  console.log('connected wallet name', wallet.name);
  console.log('connected account info', wallet.account);

  const { portfolio } = portfolioStore;
  console.log(JSON.stringify(portfolioStore.portfolio, null, 2))
  
  useEffect(() => {
    if(isDisconnected){
      portfolioStore.clearPortfolio()
    }
  }, [isDisconnected])
  

  return (
    
    <div className="ConnectWalletRoot">
      <div className="title">Your Account</div>
      <div className="wallet-conector-wrap">
        {/* <AptosConnectButton label="Connect Your Aptos Wallet" /> */}
        {/* <RazorWallet /> */}
        
        {/* {wallet.account ?
        <div className='evm-address' >
        <div className="lables">
          <div className="lable">aptos</div>
          <div className="address">${shortenAddress(wallet.account.address) }</div>
        </div>
        <img src={logoutIcon} onClick={() => wallet.disconnect()} />
      </div>
      :<AptosConnectButton>Connect Your Aptos Wallet</AptosConnectButton>
        } */}
        {address ?
          <div className='evm-address' >
            <div className="lables">
              <div className="lable">eth</div>
              <div className="address"> 
                {/* {shortenAddress(address) } */}
                <WalletEnsName address={address}/>
                </div>
            </div>
            <img src={logoutIcon} onClick={() => open()} />
          </div>

          : <button className='evm-wallet' onClick={() => open()}>{address ? address : "Connect Your EVM Wallet" }</button>
        }
        
        
      </div>

      <div className="balanceWrap">
          <div className="balanceWraptitle">Your Balance</div>
          
          {Object.entries(portfolio).map(([id, portfolioObject]) => {
           if(id === "1") return <></>
          return(
            <div className="chain">
              <Image src={iconMap[id]} className='chain-logo' width={32} height={32} alt='img' />
              <div className="chainInfo">
                <div className="chain-name">{portfolioObject.networkName}</div>
                <div className="balance">{roundDecimal(portfolioObject.balance)}</div>
              </div>
              <div className="balanceInUSD">${roundDecimal(String(portfolioObject.balanceinusd),2)}</div>
          </div>
          )})}
        </div>
    </div>
  )
})

export default ConnectWallet