import axios from "axios";
import { chainType } from "../types";


const domain = process.env.REACT_APP_BACKEND_API_V2

export const fetchQuote = async(c1:number,c2:number,value:string) =>{
    console.log(c1,c2,value,parseFloat(value),parseFloat(value)*1000000000000000000)
    try{
        const url = `${domain}/api/quote`;
   
        const options = {
          method: "POST",
          body: JSON.stringify({
            inputNetwork: c1,
            outputNetwork: c2,
            inputTokenAmount: parseFloat(value) * 1000000000000000000,
          }),
          headers: {
            "Content-type": "application/json",
          },
        };
       
        const response = await fetch(url, options);
    
        if (response.status === 200) {
            const data = await response.json(); // Extracts the JSON data
            return data; // Return the parsed data
        }
        return null;
    }
    catch(err){
        console.error("Error fetching quote",err)
        return null;
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