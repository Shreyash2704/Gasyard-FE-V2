import React, { useEffect } from 'react'

type Props = {}

const BtcWalletConnect = (props: Props) => {
    const getBtcProvider = () => {
        if ("magicEden" in window) {
            const anyWindow: any = window;
            if (anyWindow.magicEden.bitcoin && anyWindow.magicEden.bitcoin.isMagicEden)
                return anyWindow.magicEden.bitcoin;
        }
        window.location.href = "https://wallet.magiceden.io/";
    };

    useEffect(() => {
        getBtcProvider()
    }, [])
    
  return (
    <div>

    </div>
  )
}

export default BtcWalletConnect