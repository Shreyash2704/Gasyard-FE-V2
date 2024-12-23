import React, { useEffect, useLayoutEffect } from "react";
import "./App.css";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Header from "./Components/Header/Header";
import Bridge from "./Components/Bridge/Bridge";
import SelectChainModal from "./Components/SelectChainModal/SelectChainModal";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import BridgeNew from "./Components/BridgeNew/BridgeNew";
import TransactionPopup from "./Components/TransactionPopup/TransactionPopup";
// import PrivyDemo from './Components/PrivyDemo/PrivyDemo?';
import { observer } from "mobx-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explorer from "./Components/Explorer/Explorer";
import Liquidity from "./Components/Liquidity/Liquidity";
import { useChains } from "wagmi";
import { getUSDAmount } from "./Config/utils";
import FormStore from "./Config/Store/FormStore";

const App = observer(() => {

  const token = ['ETH','MATIC','MOVE','BERA']

  const getAllUSDValues = async(chain:any) =>{
    await Promise.all(
    chain.map(async(ele:any)=>{
      const res = await getUSDAmount(ele);
      console.log("getAllUSDValues",res,ele.name)
      FormStore.updateTokenRate(ele,res)
    }))
  }

  useLayoutEffect(() => {
    getAllUSDValues(token)
  }, [])
  useEffect(() => {
      
  }, [])
  

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
                  <BridgeNew />
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

            <Route
              path="/liquidity"
              element={
                <>
                  <Header />
                  <Liquidity />
                </>
              }
            />

            <Route path="*" element={<>Page Not Found!</>} />
          </Routes>
        </Router>
      </div>
    </ChakraProvider>
  );
});

export default App;
