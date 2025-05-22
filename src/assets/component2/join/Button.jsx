import React from 'react'
// import { Link } from 'react-router-dom'
import "./join.css"
const Button = ({href,text,the,fon,bod,img,id}) => {
  return (
    <>
        {/* <Link to={www.facebook.com}></Link> */}
        <a style={{color:the,background:fon,border:bod}} href={href}>{text}</a>
    </>
  )
}

export default Button