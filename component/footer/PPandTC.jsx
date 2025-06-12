import React from 'react'
import { useState } from 'react'
import "./ppandtc.css"

const PPandTC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => {
        setIsOpen(true)
        //   document.body.style.overflowY = "hidden"
        document.body.style.overflowY = "hidden"
        // document.body.style.filter = "blur(2px)"
    }
    const handleClose = () => {
        setIsOpen(false)
        document.body.style.overflowY = "auto"
    }
    const [isOpenn, setIsOpenn] = useState(false)
    const handleOpenn = () => {
        setIsOpenn(true)
        document.body.style.overflowY = "hidden"
    }
    const handleClosen = () => {
        setIsOpenn(false)
        document.body.style.overflowY = "auto"
    }
    return (
        <></>
    )
}

export default PPandTC