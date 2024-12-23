import React, { useEffect, useLayoutEffect } from "react";
import "./App.css";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Header from "./Components-v2/Header/Header";
import Bridge from "./Components/Bridge/Bridge";
import SelectChainModal from "./Components/SelectChainModal/SelectChainModal";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import BridgeNew from "./Components/BridgeNew/BridgeNew";
import TransactionPopup from "./Components/TransactionPopup/TransactionPopup";
// import PrivyDemo from './Components/PrivyDemo/PrivyDemo?';
import { observer } from "mobx-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explorer from "./Components-v2/Explorer/Explorer";
import Liquidity from "./Components/Liquidity/Liquidity";
import { useAccount, useChains } from "wagmi";
import { FetchPortfolioBalance, getUSDAmount } from "./Config/utils";
import FormStore from "./Config/Store/FormStore";
import BridgeApp from "./Components-v2/BridgeApp/BridgeApp";
import widgetLogo from './assets/v2/bridge/widgets.svg'
import operationalLogo from './assets/v2/bridge/operational.svg'
import ConnectWallet from "./Components-v2/ConnectWallet/ConnectWallet";
import AppstoreV2 from "./Config/Store/AppstoreV2";
import Transaction from "./Components-v2/Transaction/Transaction";

const App = observer(() => {

  const token = ['ETH','MOVE','BERA']
  const Chains = useChains()
  const {address} = useAccount()

  const getAllUSDValues = async(chain:any) =>{
    await Promise.all(
    chain.map(async(ele:any)=>{
      const res = await getUSDAmount(ele);
      console.log("getAllUSDValues",res,ele.name)
      FormStore.updateTokenRate(ele,res)
    }))
  }
  const fetchPortfolio = async (address: any) => {
    // const result = await PortfolioAPI(address);
    const result = await FetchPortfolioBalance(Chains, address)
    // console.log("portfolio", result);
    // setportfolio(result);
    // setAccountBalance(result);
  };

  useLayoutEffect(() => {
    getAllUSDValues(token)
  }, [])
  useEffect(() => {
      
  }, [])
  useEffect(() => {
    fetchPortfolio(address)
  }, [address])
  
  

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <BridgeApp />
                  
                  
                  {/* <BridgeNew /> */}
                </>
              }
            />
            <Route
              path="/explorer"
              element={
                <>
                  <Header />
                  <Explorer />
                </>
              }
            />

           {/*  <Route
              path="/liquidity"
              element={
                <>
                  <Header />
                  <Liquidity />
                </>
              }
            /> */}

            <Route
              path="/tx/:id"
              element={
                <>
                  <Header />
                  <Transaction />
                </>
              }
            />
            <Route
              path="/txHash/:txHash"
              element={
                <>
                  <Header />
                  <Transaction />
                </>
              }
            />

            <Route path="*" element={<>Page Not Found!</>} />
          </Routes>
        </Router>
        {/* <div className="toolkits">
            <img src={widgetLogo} alt="" />
            <img src={operationalLogo} alt="" />
          </div> */}
          {AppstoreV2.showWalletModal && <ConnectWallet />}
      </div>
    </ChakraProvider>
  );
});

export default App;
