import { useEffect, useState } from "react";
import SubtractCoin from "../../assets/coins/Subtract.svg";
import "./QuoteSection.css";
import { Spinner } from "@chakra-ui/react";
import quoteLoader from '../../assets/animations/quoteLoader.json'
import Lottie from "lottie-react";

type quoteProp = {
  address: string | undefined;
  transactionTime: string;
  fees: string | null;
  chain1: any;
};
const QuoteSection = ({
  address,
  transactionTime,
  fees,
  chain1,
}: quoteProp) => {
  const [showLoader, setShowLoader] = useState(true);

  const ShowFees = () =>{
    if(fees === "undefined" || fees === "" || fees === null){
      return (<>
      N/A
      </>)
    }else{
      return (<>
      ${roundDecimal(fees)} USD
      </>)
    }
  }
  const roundDecimal = (numStr:string) => {
      const num = parseFloat(numStr);
      const decimalPlaces = numStr.split('.')[1]?.length || 0;
      
      
      if (decimalPlaces > 4) {
        return num.toFixed(4);
      } else {
        return num.toFixed(decimalPlaces);
      }
    
   
  };

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 1 seconds

    return () => clearTimeout(timer);
  }, [address, transactionTime, fees, chain1]);

  return (
    <>
      <div className="quoteRoot">
        {showLoader ? (
          <>
          <div className="loader">
            {/* <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            /> */}
            <Lottie
              animationData={quoteLoader}
              loop={true}
              style={{ height: "100px", width: "400px" }}
              />
            </div>
          </>
        ) : (
          <>
            {/* <div className="quote_row">
              <div className="quote_column col1">Points Earned</div>
              <div className="quote_column col2">
                
                <span className="coin"></span>
                +400
              </div>
            </div> */}
            <div className="quote_row">
              <div className="quote_column col1">Estimated Time</div>
              <div className="quote_column col2">~ 10 sec</div>
            </div>
            <div className="quote_row">
              <div className="quote_column col1">Network</div>
              <div className="quote_column col2">{chain1}</div>
            </div>
            <div className="quote_row">
              <div className="quote_column col1">Network Fee</div>
              <div className="quote_column col2"><ShowFees /></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuoteSection;
