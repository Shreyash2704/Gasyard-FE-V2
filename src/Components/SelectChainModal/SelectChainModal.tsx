import React, { useState } from 'react'
import './SelectChainModal.css'
import { useChains, useSendTransaction } from "wagmi";
import { iconMap } from '../../Config/data';
import closeIcon from '../../assets/CloseIcon.svg'
import { chainType } from '../../Config/types';
type Props = {
    open:any
    setModal:any
    chain_1:any
    chain_2:any
    toselectChain:any
    portfolio:any
}

const SelectChainModal = ({open,setModal,chain_1,chain_2,toselectChain,portfolio}: Props) => {
    const Chains = useChains()

    const [chainList, setchainList] = useState<readonly chainType[]>(Chains)

    const onChainSelect = (chain:any) =>{
        setModal(false,chain)
    }

    const handleInputChange = (e:any) =>{
        var value = e.target.value
        if(value === ""){
            setchainList(Chains)
        }else{
            var newChain = chainList.filter(e => e.name.toLocaleLowerCase().startsWith(value))
            setchainList(newChain)
        }
        
    }
    
  return (
    <div className={`ModalWrapper ${!open ? "hideModal":""}` }>
        <div className="ModalContent">
            <div className="Header">
            <img className='close-icon' src={closeIcon} onClick={() => setModal(false)}/>
                <div className='search-chain'>
                    <input type="text"  placeholder='Search by name' onChange={handleInputChange}/>
                    
                </div>
            </div>
            <div className="Body">
                {chainList.map((chain)=>{
                    var key = chain.name
                    
                    if(toselectChain === 2 && chain.id === chain_1.id){
                        return("")
                    }
                    return(
                        <div className="chains" key={chain.id} onClick={() => onChainSelect(chain)}>
                            <img className="chain-img" src={chain.iconUrl}/>
                            <div className='chain-info'>
                                <div className="chain-name">{chain.name}</div>
                                <div className="chain-token">{chain.nativeCurrency.symbol}</div>
                            </div>
                            <div className="chain-balance">
                                {portfolio && portfolio[key.toLowerCase()] && portfolio[key.toLowerCase()].balance}
                            </div>
                            
                        </div>
                    )
                })}
                
            </div>
        </div>
    </div>
  )
}

export default SelectChainModal