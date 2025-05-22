import React from 'react'
import './howitwork.css'

const HowitworkProb = ({img,span,p,pp}) => {
  return (
    <div id='HowitworkProb'>
        <div id="imgWordHiw">
            <div id="imgHiw">
                <img src={img} alt="" />
            </div>
            <hr />
            <div id="wordHiw">
                
                <p><span>{span}</span> <br />{p} <br /> {pp}</p>
            </div>
        </div>
    </div>
  )
}

export default HowitworkProb