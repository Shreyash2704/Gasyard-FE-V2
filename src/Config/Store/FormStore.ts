import { action, makeAutoObservable,observable } from "mobx"
import { chainType } from "../types"


class FormStore{
    chain1:any = ""
    chain2:any = ""
    inputToken:any = ""
    outputToken:any = ""
    transactionHash:any = ""
    TokenUSDRates = observable.map<string, number>({})

    constructor(){
        makeAutoObservable(this,{
            setChain1:action,
            setChain2:action,
            setInputToken:action,
            setOuputToken:action,
            setTransactionHash:action
        })
    }
    setChain1= (data:any) =>{this.chain1 = data}
    setChain2 = (data:any) =>{this.chain2 = data}
    setInputToken = (data:any) =>{this.inputToken = data}
    setOuputToken = (data:any) =>{this.outputToken = data}
    setTransactionHash = (data:any) =>{this.transactionHash = data}
    
    updateTokenRate = (key:string, value:number) => {
        this.TokenUSDRates.set(key, value);
    }
    getTokenRateKey(key: string): number | undefined {
        return this.TokenUSDRates.get(key);
    }
}

export default new FormStore()