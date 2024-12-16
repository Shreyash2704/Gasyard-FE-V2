import { Tooltip } from '@chakra-ui/react'
import React from 'react'

type Props = {
    iconUrl:string,
    label:string,
    callBack:any,
}

const TooltipWrappedImg = ({iconUrl,label,callBack}: Props) => {
  return (
    <Tooltip label={label} bg="#161616">
            <img
              src={iconUrl}
              alt="copy"
              onClick={callBack}
            />
          </Tooltip>
  )
}

export default TooltipWrappedImg