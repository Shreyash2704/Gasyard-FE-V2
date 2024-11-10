import { Button, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatHelpText, StatLabel, StatNumber, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useChains } from "wagmi";
import { chainType } from "../../Config/types";
import "./SelectChainModal.css"
import SearchIcon from '../../assets/v2/selectchainmodal/search.svg'
import CloseBtn from '../../assets/CloseIcon.svg'
import { observer } from "mobx-react";
import token from '../../assets/v2/bridge/eth.svg'
import { iconMap } from "../../Config/data";

type Props = {
    // open:any
    // setModal:any
    // chain_1:any
    // chain_2:any
    // toselectChain:any
    // portfolio:any
    isOpen?:any
    onOpen?:any
     onClose?:any
}
type nativeCurrencyType = {
  decimals: any
  name:any
  symbol:any
}

const SelectChainModal = observer(({isOpen,onOpen, onClose}: Props) => {
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const Chains = useChains()
    console.log("chain",Chains)
    const [chainList, setchainList] = useState<readonly chainType[]>(Chains)
    const [nativetokens, setnativetokens] = useState<nativeCurrencyType | null>(null)
    const onChainSelect = (chain:any) =>{
        // setModal(false,chain)
        onClose()
    }
    const handleInputChange = (e:any) =>{
        var value = e.target.value
        setnativetokens(null)
        if(value === ""){
            setchainList(Chains)
        }else{
            var newChain = chainList.filter(e => e.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
            setchainList(newChain)
        }
        
    }
    return (
      <>
        {/* <Button onClick={onOpen}>Open Modal</Button> */}
        <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset='slideInBottom'
          size={"xl"}
        >
          <ModalOverlay backgroundColor={"rgba(0,0,0,0.7)"}/>
          <ModalContent 
            borderRadius={"26px"}  
            sx={{
              backgroundColor:"#0D1116",
              border: "1px solid #222729"
            }}>
            <ModalHeader>
            <div className="header">
              Networks
              <img src={CloseBtn} onClick={onClose}/>
            </div>          
            </ModalHeader>
            <ModalBody>
              <div className="select-chain-wrap">
                <div className="search-chain">
                  <img src={SearchIcon} className="search-logo" />
                  <input type="text"  placeholder='Search Networks' onChange={handleInputChange}/>
                </div>
                <div className="network-wrap d-flex-row">
                  <div className="networks d-flex-col">
                    <div className="label">Networks</div>
                    {chainList && chainList.map((chain) =>{
                      return(<>
                      <div className="network d-flex-row" onClick={() => setnativetokens(chain.nativeCurrency)}>
                        <img src={chain.iconUrl} alt="" />
                        {chain.name}
                    </div>
                      </>)
                    })}
                  </div>
                  <div className="assets d-flex-col">
                  <div className="label">Assets</div>
                  {nativetokens && (
                    <div className="asset d-flex-row">
                      <img src={iconMap[nativetokens.symbol]} alt="" />
                      <div className="token d-flex-col">
                        {nativetokens.name} 
                        <span>{nativetokens.symbol}</span>
                      </div>
                      <div className="balance ml-auto">N/A</div>
                    </div>
                  )}
                    

                    {/* <div className="asset d-flex-row">
                      <img src={token} alt="" />
                      <div className="token d-flex-col">
                        Ethereum
                        <span>ETH</span>
                      </div>
                      <div className="balance ml-auto">2.32</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  })

export default SelectChainModal
