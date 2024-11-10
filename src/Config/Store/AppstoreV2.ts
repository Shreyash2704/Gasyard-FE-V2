import { makeAutoObservable } from "mobx"

class AppStore{
    showWalletModal:boolean = false
    constructor(){
        makeAutoObservable(this)
    }
    setWalletModal = (data:boolean) => {this.showWalletModal = data}
}

export default new AppStore()