import React from 'react'
import { Button, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatHelpText, StatLabel, StatNumber, useDisclosure } from "@chakra-ui/react";

type Props = {
    onClose:any,
    isOpen:any,
    children:any
}

const CommonModal = ({onClose,isOpen,children}: Props) => {
  return (
    <>
    <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset='slideInBottom'
          size={"xl"}
          
        >
          <ModalOverlay backgroundColor={"rgba(0,0,0,0.7)"} zIndex={"5"}/>
          <ModalContent 
            borderRadius={"26px"}  
            sx={{
              backgroundColor:"#0D1116",
              border: "1px solid #222729",
              zIndex:"5"
            }}>
            <ModalHeader>
            </ModalHeader>
            <ModalBody zIndex={"5"}>
                {children}
            </ModalBody>
          </ModalContent>
        </Modal>
        </>
  )
}

export default CommonModal