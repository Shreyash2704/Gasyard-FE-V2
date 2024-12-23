import { Button, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatHelpText, StatLabel, StatNumber, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useChains } from "wagmi";
import { chainType } from "../../Config/types";
import "./SelectChainModal.css"
import SearchIcon from '../../assets/search_logo.svg'
import CloseBtn from '../../assets/CloseIcon.svg'
import { observer } from "mobx-react";

type Props = {
    open:any
    setModal:any
    chain_1:any
    chain_2:any
    toselectChain:any
    portfolio:any
    isOpen?:any
    onOpen?:any
     onClose?:any
}

const SelectChainModalNew = observer(({open,isOpen,onOpen, onClose,setModal,chain_1,chain_2,toselectChain,portfolio}: Props) => {
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const Chains = useChains()

    const [chainList, setchainList] = useState<readonly chainType[]>(Chains)
    const onChainSelect = (chain:any) =>{
        setModal(false,chain)
        onClose()
    }
    const handleInputChange = (e:any) =>{
        var value = e.target.value
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
          <ModalOverlay />
          <ModalContent borderRadius={"26px"}  sx={{
            boxShadow: `0px 16px 32px -12px #07204540, 
                        0px 1px 2px 0px #1D4F810A, 
                        0px 0px 0px 1px #12376914`
          }}>
            <ModalHeader>
            <div className="header">
              Select Network
              <img src={CloseBtn} onClick={onClose}/>
            </div>          
            </ModalHeader>
            <ModalBody>
            <div className='search-chain-parent'>
              <div className="search-chain">
                <img src={SearchIcon} className="search-logo" />
                <input type="text"  placeholder='Search by name' onChange={handleInputChange}/>
              </div>
              
              
            </div>
            <div className="chains-body">
            {chainList.map((chain)=>{
                    var key = chain.name
                    if(chain.id === 1) return ""
                    if(toselectChain === 1 && (chain.id === 30732)){
                      return("")
                    }
                    if(toselectChain === 2 && chain.id !== 30732){
                        return("")
                    }
                    if(toselectChain === 2 && chain.id === 30732){
                      return(
                        <>
                        <div className="chains" key={chain.id} onClick={() => onChainSelect(chain)}>
                            <img className="chain-img" src={chain.iconUrl}/>
                            <div className='chain-info'>
                                <div className="chain-name">{chain.name}</div>
                                {/* <div className="chain-token">{chain.nativeCurrency.symbol}</div> */}
                            </div>
                            <div className="chain-balance">
                              
                                {/* { portfolio && portfolio["bsc"] && key === "BNB Smart Chain" ? Math.round(portfolio["bsc"].balance * 100000) / 100000
                                : portfolio && key === "Arbitrum One" ? Math.round(portfolio["arbitrum"].balance * 100000) / 100000 
                                : portfolio && portfolio[key.toLowerCase()] ? Math.round(portfolio[key.toLowerCase()].balance * 100000)/100000 : ""}
                                {" "} */}

                                {/* {portfolio && toselectChain === 1 && chain_1 ? portfolio[String(chain_1.id)].balance : chain_2 && portfolio[String(chain_2.id)].balance } */}
                                
                                {portfolio && chain && portfolio[chain.id] ? (portfolio[chain.id].balance * 100000)/100000 :"N/A" }
                                {" "}
                                {chain.nativeCurrency.symbol}
                            </div>
                            
                        </div>
                        <div className="chains disabled" key={chain.id}>
                            <img className="chain-img" src={chain.iconUrl}/>
                            <div className='chain-info'>
                                <div className="chain-name">Move-AptosVM</div>
                            </div>
                            <div className="chain-balance">
                            (Coming soon)
                            </div>
                            
                        </div>
                        </>
                       
                      )
                    }
                    return(
                        <div className="chains" key={chain.id} onClick={() => onChainSelect(chain)}>
                            <img className="chain-img" src={chain.iconUrl}/>
                            <div className='chain-info'>
                                <div className="chain-name">{chain.name}</div>
                                {/* <div className="chain-token">{chain.nativeCurrency.symbol}</div> */}
                            </div>
                            <div className="chain-balance">
                              
                                {/* { portfolio && portfolio["bsc"] && key === "BNB Smart Chain" ? Math.round(portfolio["bsc"].balance * 100000) / 100000
                                : portfolio && key === "Arbitrum One" ? Math.round(portfolio["arbitrum"].balance * 100000) / 100000 
                                : portfolio && portfolio[key.toLowerCase()] ? Math.round(portfolio[key.toLowerCase()].balance * 100000)/100000 : ""}
                                {" "} */}

                                {/* {portfolio && toselectChain === 1 && chain_1 ? portfolio[String(chain_1.id)].balance : chain_2 && portfolio[String(chain_2.id)].balance } */}
                                
                                {portfolio && chain && portfolio[chain.id] ? (portfolio[chain.id].balance * 100000)/100000 :"N/A" }
                                {" "}
                                {chain.nativeCurrency.symbol}
                            </div>
                            
                        </div>
                    )
                })}
                </div>
                
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  })

export default SelectChainModalNew