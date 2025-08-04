import React, {useEffect,useRef} from 'react'
import './howitwork.css'
import RevealOnScroll from '../onscroll/ReavealOnScroll'
// import { useRef } from 'react'

const HowitworkProb = ({img,span,p,pp}) => {  return (
    
    <div className='HowitworkProb'>
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