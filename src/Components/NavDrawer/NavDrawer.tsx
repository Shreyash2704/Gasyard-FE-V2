import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Input, MenuButton, useDisclosure } from '@chakra-ui/react'
import React, { useRef } from 'react'
import "./NavDrawer.css"
import { HamburgerIcon } from '@chakra-ui/icons'

type Props = {}

const NavDrawer = (props: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
        const btnRef = useRef<HTMLButtonElement>(null)
  return (
    <>
       <Button ref={btnRef} onClick={onOpen}>
       <HamburgerIcon />
      </Button> 
      {/* <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
            onClick={onOpen}
        /> */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader> */}
          <DrawerBody>
          
            
            <div className="navigation">
              <a className="na-transfer" href="/explorer" onClick={onClose}>
               Explorer
              </a>

              <a className="na-history" href="/liquidity" onClick={onClose}>
                {" "}
                Liquidity
              </a>
              
              </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavDrawer