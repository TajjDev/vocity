import React from 'react'
// import { Link } from 'react-router-dom'
// import "./join.css"
const Btn = ({idd,href,text,the,fon,bod,img,id}) => {
  return (
    <>
        {/* <Link to={www.facebook.com}></Link> */}
        <a id={idd} style={{color:the,background:fon,border:bod}} href={href}><img src={img} id={id} alt="" /><p id='ppp'>{text}</p></a>
    </>
  )
}

export default Btn