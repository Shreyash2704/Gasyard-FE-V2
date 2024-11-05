import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChains } from "wagmi";
import "./ResubmitTxPopup.css";
import CloseBtn from "../../assets/CloseIcon.svg";
import { sendTransaction } from "../../Config/API/api";

type Props = {
  isOpen: any;
  onClose: any;
};

function ResubmitTxPopup({ isOpen, onClose }: Props) {
  const Chains = useChains();
  const [chain, setchain] = useState<any>(null);
  const [error, seterror] = useState("")
  const [input, setinput] = useState<string>("");

  const onChangeInput = (e:any) =>{
    var value = e.target.value;
    if (!value.match(/^0x[a-fA-F0-9]{64}$/)) {
      seterror("Address must be a EVM WalletAddress");
    }
    else if(e === ""){
        seterror("Please enter the valid address.")
    } else {
        seterror("");
    }
    setinput(value);
  }
  const onSubmit = () => {
    if (input.startsWith("0x")) {
      sendTransaction(input as `0x${string}`, chain.id);
      onClose();
      setinput("");
      setchain(null);
    }
  };
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={"26px"}
          sx={{
            boxShadow: `0px 16px 32px -12px #07204540, 
                        0px 1px 2px 0px #1D4F810A, 
                        0px 0px 0px 1px #12376914`,
          }}
        >
          <ModalHeader>
            <div className="header">
              Resubmit Transaction
              <img src={CloseBtn} onClick={onClose} />
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="modal-cont">
              <input
                type="text"
                placeholder="Search by transaction hash or address"
                value={input}
                onChange={onChangeInput}
              />
              <Menu>
                <MenuButton
                  as={Button}
                  disabled
                  sx={{
                    backgroundColor: "#727272",
                    borderRadius: "24px",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    textAlign: "left",
                    color: "#fff",
                    width: "200px",
                    boxShadow:
                      "0px -1px 1px 0px #0000000A inset,0px 1px 3px 0px #00000033",
                  }}
                  rightIcon={<ChevronDownIcon />}
                >
                  {chain ? chain.name : "Select Network"}
                </MenuButton>
                <MenuList>
                  {Chains.map((chain) => {
                    if (chain.id === 1) return <></>;
                    return (
                      <MenuItem key={chain.id} onClick={() => setchain(chain)}>
                        {chain.name}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>

              <button
                className="resubmit-btn"
                disabled={chain === null || input === "" || error !== ""}
                onClick={onSubmit}
              >
                Resubmit
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ResubmitTxPopup;
