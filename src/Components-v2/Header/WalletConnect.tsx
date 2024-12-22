import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import AppstoreV2 from '../../Config/Store/AppstoreV2';
import { observer } from 'mobx-react';
import avatarLogo from '../../assets/v2/header/avatar.svg'
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useConnectWallet } from '@privy-io/react-auth';

export const WalletConnect = observer(() => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const {open, } = useWeb3Modal()
  const {connectWallet} = useConnectWallet()

  const handleClick = () =>{
      console.log("Clicked!")
      AppstoreV2.setWalletModal(!AppstoreV2.showWalletModal)
    }
  // Simulate loading to avoid delay issue
  useEffect(() => {
    console.log("isConnected",isConnected,typeof(isConnected))
    if (isConnected !== undefined) {
      setIsLoading(false);
    }
  }, [isConnected]);

  if (isLoading) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <>
      {address ? (
        <div className="avatar-sec" onClick={handleClick}>
          <img src={avatarLogo} alt="" />
        </div>
      ) : isLoading ? <></> :(
        <button className="wallet-sync" onClick={connectWallet}>
          Connect Wallet {isConnected}
        </button>
      )}
    </>
  );
})
