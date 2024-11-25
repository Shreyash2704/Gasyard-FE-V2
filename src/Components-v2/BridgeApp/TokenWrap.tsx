import React from 'react'
import  "./BridgeApp.css"
import downArrow from '../../assets/v2/bridge/down-arrow.svg'
import { observer } from 'mobx-react'

type Props = {
    label:any,
    inputVal:any,
    inputInDollars:any,
    token:any,
    balance:any,
    tokenImg:any,
    onClick:any,
    readonly?:boolean,
    className?:string,
    onChange?:any
    id:number
}

const TokenWrap = observer(({id,label,inputVal,inputInDollars,token,balance,tokenImg,onClick,readonly=false,className,onChange}: Props) => {
    const isNumberKey = (evt: any) => {
        const charCode = evt.which ? evt.which : evt.keyCode;
    
        // Check if the character is a dot (.)
        if (charCode === 46) {
          // Allow the dot if it's not already present in the input value
          if (inputVal.indexOf(".") === -1) {
            return true;
          } else {
            return false;
          }
        } else {
          // Allow digits (0-9)
          if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
          }
        }
    
        return true;
      };
  return (
    <div className='TokenWrapRoot d-flex-row'>
        <div className="left-sec d-flex-col">
            <div className="label">{label}</div>
            {readonly ? (
                <input type="text" className={className} value={inputVal} placeholder='0.001' readOnly/>
            ):(
                <input type="text" className={className} onChange={onChange} 
                    value={inputVal} 
                    onKeyPress={(e) => {
                        if (!isNumberKey(e)) {
                            e.preventDefault();
                        }
                    }} 
                    placeholder='0.001' />
            )}
            
            <div className="input-in-dollars">${inputInDollars}</div>
        </div>
        <div className="right-sec d-flex-col">
            <div className="select-token d-flex-row" onClick={() => onClick(id)}>
                {token ? (
                    <>
                    <img src={tokenImg} alt="" />
                    {token}
                    </>
                ) :(
                    <>Select Network</>
                )}
                
                <img src={downArrow} className="down-arrow" alt="" />
            </div>
            <div className="balance-sec">
                Balance:<span>{balance}</span>
            </div>
        </div>
    </div>
  )
})

export default TokenWrap