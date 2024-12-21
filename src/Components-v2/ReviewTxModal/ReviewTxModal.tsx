import React from 'react'
import CommonModal from '../Modal/CommonModal'

type Props = {}

const ReviewTxModal = (props: Props) => {
    const onClose = () =>{

    }
  return (
    <CommonModal isOpen={true} onClose={onClose} size={"md"} header=''>
        <>Heelo</>
    </CommonModal>
  )
}

export default ReviewTxModal