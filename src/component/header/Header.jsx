import {React,useEffect,useState} from 'react'
import './header.css'
import Phone from '/src/assets/image/desktopPh.png'
import Phone3 from '/src/assets/image/tabletPhe.png'
import Phone2 from '/src/assets/image/tabletPh.png'

const Header = () => {
    const mobileImage = Phone3
    const tabletImage = Phone2
    const defaultImage = Phone
    const [imageSrc , setImageSrc] = useState(defaultImage)
   
   
   
    const handleResize = () =>{
        const width = window.innerWidth;
        if (width <= 424){
            setImageSrc(mobileImage)
        } else if (width <= 899){
            setImageSrc(tabletImage)
        } else {
            setImageSrc(defaultImage)
        }
    }
    
    useEffect (() =>{
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    return (
        <div id='header'>
            <div id="headWord">
                <h5>Join the movement with <span id='headSpan'>VOCITY</span></h5>
                <p>VoteCity empowers you to participate in community decisions, stay updated on events, support local causes, and engage in announcements</p>
                
                <div id="headBtn">
                <a id='downloadHead' href="#">Download now</a>
                <a id='downloadHead2' href="#">Learn more</a>
               
                </div>
            </div>
            <div id="phone">
                <img src={imageSrc} alt="" />
            </div>
        </div>
    )
}

export default Header