import { makeAutoObservable } from "mobx"

class AppStore{
    showWalletModal:boolean = false
    tokenVal2:any = "0"
    tokenVal1inUSD:any = "0"
    tokenVal2inUSD:any = "0"

    constructor(){
        makeAutoObservable(this)
    }
    setWalletModal = (data:boolean) => {this.showWalletModal = data}
    settokenVal2 = (data:any) =>{
        if(Number.isNaN(data)) {
            this.tokenVal2  = "0"
        }else{
            this.tokenVal2 = data
        }
    }
    settokenVal1inUSD = (data:any) => {
        if(Number.isNaN(data)) {
            this.tokenVal1inUSD  = "0"
        }else{
            this.tokenVal1inUSD = data
        }
        
    }
    settokenVal2inUSD = (data:any) => {this.tokenVal2inUSD = data}
}

export default new AppStore()