import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import React, { useRef } from 'react'
import "./NavDrawer.css"
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons'

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

              <Menu>
                <MenuButton as={Button} background={"none"} rightIcon={<ChevronDownIcon />}>
                  Don’t have funds?
                </MenuButton>
                <MenuList background={"#EEEAE6"}>
                  <MenuItem background={"#EEEAE6"} minH='48px'>
                    <a href="https://faucet.movementlabs.xyz/" target="_blank">Movement Faucet</a>
                  </MenuItem>
                  <span className='divider'></span>
                  <MenuItem background={"#EEEAE6"} minH='40px'>
                    <a href="https://web.telegram.org/k/#@gasyardbot" target="_blank">TG bot Faucet</a>
                  </MenuItem>
                </MenuList>
              </Menu>
              
              </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavDrawer