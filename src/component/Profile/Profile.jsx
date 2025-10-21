import './profile.css'
import React, { useEffect, useState } from "react";
// import { fetchUserProfile } from "../../mockapi";
import verified from '/src/assets/image/verified.png'
import share from '/src/assets/image/share.png'
import follow from '/src/assets/image/follow.png'
import apple from '/src/assets/image/Apple.png'
import google from '/src/assets/image/Google.png'

function UserProfile({ userId = "USER-17468269976523805" }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_URL = "https://api.votecity.ng/v1/user"
    // Real fetch
    const [showPopup, setShowPopup] = useState(false)
    const [Copied, setCopied] = useState(false)

    const Link  = `https://vocity.vercel.app/${userId}`
       const handleCopy = (e) =>{
        navigator.clipboard.writeText(Link);
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000);
        alert("Link copied: " + Link);
       } 
    useEffect(() => {
        fetch(`${BASE_URL}/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                console.log("User Data:", data?.data?.user);
                setUser(data?.data?.user || null);
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, [userId]);
    if (loading) return <p>Loading user profile...</p>;
    if (!user) return <p>No user found</p>;
    // console.log("Verified status:", user.id_verified, typeof user.id_verified);
    return (
        <div className="user-profile">
            {/* <p>User ID: {user.id}</p> */}
            {/* <p>image:</p> */}
            {/* <p>verified: {user.id_verified}</p> */}
            <div id="O">
                <div id="name">
                    <div id="userNaVe">
                        <p id='full'>{user.fullname}</p>
                        {user.id_verified === 1 && (
                            <img src={verified} alt="" />
                        )}
                    </div>
                    <p>@{user.username}</p>
                </div>
                <div id="img">
                    <img className='profile' src={`https://api.votecity.ng${user.thumbnail?.url}`} alt={user.fullname || "User avatar"} />
                </div>
                <div id="follow">
                    <div id="fol">
                        <p><span>{user.following}</span> Following</p>
                        <p><span>{user.followers}</span> Followers</p>
                    </div>
                    <div id="folBtn">
                        <button className='bbb' onClick={() => setShowPopup(true)}>Follow <img id='btnn' src={follow} alt="" /></button>
                        {showPopup && (
                            <div id='popOver'>
                                <div id='popUp'>
                                    <p id='downn'>Download the App to follow</p>
                                    <div id="apGo">
                                        <a href="" className='goAp'><img src={google} alt="" /></a>
                                        <a href="" className='goAp'><img src={apple} alt="" /></a>
                                    </div>
                                    <p>Available both on <br />Play store and Apple store</p>
                                    <button id='cls' onClick={() => setShowPopup(false)}>close</button>
                                </div>
                            </div>
                        )}
                        <button onClick={handleCopy} className='bbb' id='btnT'>Share Profile  <img src={share} alt="" /></button>
                    </div>
                </div>
            </div>
            <div id="T"></div>
        </div>
    );
}

export default UserProfile;