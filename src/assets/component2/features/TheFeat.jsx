import React from 'react'

const TheFeat = ({text,img,text2,span}) => {
  return (
    <>
    <div id="each">
        <h3>{text} <span>{span}</span></h3>
        <img id='imm' src={img} alt="" />
        <p>{text2}</p>
    </div>
    </>
  )
}

export default TheFeat