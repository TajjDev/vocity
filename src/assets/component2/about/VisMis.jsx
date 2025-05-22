import React from 'react'

const VisMis = ({textH3,read, p,id}) => {
  return (
    <div id={id}>
        <h3>Our <span>{textH3}</span></h3>
        <p>{p} <span className='read'>{read}</span></p>
    </div>
  )
}

export default VisMis