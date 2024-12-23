import axios from "axios";

const isTestnet = process.env.REACT_APP_SERVER === "testnet"
const domain = isTestnet ? process.env.REACT_APP_BACKEND_API_TESTNET : process.env.REACT_APP_BACKEND_API
console.log(domain,process.env.REACT_APP_SERVER)
export const PortfolioAPI = async(address:any) =>{
    console.log("portfolio api called")
    try{
        // const url = `${domain}/api/portfolio/0x875C02095ABB53428aa56A59FE6C8E712F48C762`
        const url = `${domain}/api/portfolio/${address}`
        const response = await fetch(url);
        const result = await response.json();
        console.log(result)
        return result
    }
    catch(Err){
        console.log("Unexpected Error! " ,Err)
        return null
    }
}

export const sendTransaction = async(hash:`0x${string}` | undefined,inputNetwork:number) => {
    console.log('send transaction called')
    inputNetwork = inputNetwork === 920637907288165 ? 1802203764 : inputNetwork
    try{
        if(hash){
            const url = `${domain}/api/submit-tx`
            const data = {
                    "transactionHash":hash,
                    "inputNetwork":inputNetwork
            }
            
            const res = await axios.post(url,data)
            console.log(res)
            return res.data
        }
    }catch(err){
        console.log(err)
        return {"status":400,"msg":err}
    }
    
}

export const fetchTransactionObject = async(id:string) =>{
    try{
        const url = `${domain}/api/list-transactions/${id}`
        const response = await axios.get(url)
        return response.data.results[0]
    }catch(err){
        console.log("Unexpected Error!",err)
        return null
    }
}

export const getListTransactions = async(page:number,inputAddress:`0x${string}`| string | null=null,chain1:number | null=null,chain2:number | null=null) => {
    try{
        var url = ""
        chain1 = chain1 === 920637907288165 ? 1802203764 : chain1
        chain2 = chain2 === 920637907288165 ? 1802203764 : chain2
        url = `${domain}/api/list-transactions?sortBy=updatedAt:desc&page=${page}&${inputAddress && `inputAddress=${inputAddress}`}&${chain1 && `inputChainID=${chain1}`}&outputChainID=30732`
        url = url.replace(/&null/g, "").replace("null","")
        const response = await axios.get(url)
        if(response.status === 400){
            console.log("400 error")
        }
        return response.data
    }catch(err){
        console.log("Unexpected Error!",err)
        return null
    }
}

export const notifyTransaction = async(chainid:number,trnx_hash:`0x${string}`) =>{
    console.log("notifyTransaction called!")
    try{
        const url = `${domain}/api/notify`
        const body = {
            inputNetwork:chainid,
            eventTxHash:trnx_hash
        }

        const res = await axios.post(url,body)
        console.log("notifyTransaction response",res.data)

    }catch(err){
        console.log(err)
    }
}

export const fetchRewards = async(walletId:any) =>{
    return null
    console.log("fetchreward called")
    try{
        const url = `${domain}/api/show-rewards/${walletId}`
        const res = await axios.get(url)
        console.log("fetchreward response",res)
        return res.data;
    }catch(err){
        console.log('err', err)
    }
}