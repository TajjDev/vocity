import React from 'react'

const Pages = ({step,textSt,img,ttt,pp}) => {
  return (
    <>
      <div id="step1">
        <p id='mig' style={{bottom:"150px"}}><span>{step}: </span>{textSt}<br />
          {ttt}</p>
        <div id="bodyz">
          <img style={{bottom:"150px"}} id={pp} src={img} alt="" />
        </div>
        </div>
      </>
      )
}

      export default Pages