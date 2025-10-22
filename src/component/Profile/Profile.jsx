import './profile.css';
import React, { useEffect, useState } from "react";
import verified from '/src/assets/image/verified.png';
import share from '/src/assets/image/share.png';
import follow from '/src/assets/image/follow.png';
import apple from '/src/assets/image/Apple.png';
import creation from '/src/assets/image/creation.png';
import folllow from '/src/assets/image/follows.png';
import google from '/src/assets/image/Google.png';

function UserProfile({ userId = "USER-17468269976523805" }) {
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingListings, setLoadingListings] = useState(true);
    const [sort, setSort] = useState("ongoing");
    const [activeTab, setActiveTab] = useState("listings"); // ✅ Added
    const [showPopup, setShowPopup] = useState(false);
    const [Copied, setCopied] = useState(false);

    const BASE_URL_USER = "https://api.votecity.ng/v1/user";
    const BASE_URL_LISTINGS = "https://api.votecity.ng/v1/post/create/listings";

    const Link = `https://vocity.vercel.app/${userId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(Link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied: " + Link);
    };

    // 🔹 Fetch User Profile
    useEffect(() => {
        fetch(`${BASE_URL_USER}/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setUser(data?.data?.user || null);
            })
            .catch(err => console.error("Fetch user error:", err))
            .finally(() => setLoadingUser(false));
    }, [userId]);

    // 🔹 Fetch Listings
    useEffect(() => {
        const page = 1;
        setLoadingListings(true);

        fetch(`${BASE_URL_LISTINGS}/${userId}?sort=${sort}&page=${page}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                console.log(`Listings for ${sort}:`, data);
                setListings(data?.data?.posts || []);
            })
            .catch(err => console.error("Fetch listings error:", err))
            .finally(() => setLoadingListings(false));
    }, [userId, sort]);

    if (loadingUser) return <p>Loading user profile...</p>;
    if (!user) return <p>No user found</p>;

    return (
        <div className="user-profile">
            <div id="O">
                <div id="name">
                    <div id="userNaVe">
                        <p id='full'>{user.fullname}</p>
                        {user.id_verified === 1 && <img src={verified} alt="Verified" />}
                    </div>
                    <p>@{user.username}</p>
                </div>

                <div id="img">
                    <img
                        className='profile'
                        src={`https://api.votecity.ng${user.thumbnail?.url}`}
                        alt={user.fullname || "User avatar"}
                    />
                </div>

                <div id="follow">
                    <div id="fol">
                        <p><span>{user.following}</span> Following</p>
                        <p><span>{user.followers}</span> Followers</p>
                    </div>
                    <div id="folBtn">
                        <button className='bbb' onClick={() => setShowPopup(true)}>
                            Follow <img id='btnn' src={follow} alt="" />
                        </button>
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
                        <button onClick={handleCopy} className='bbb' id='btnT'>
                            Share Profile <img src={share} alt="" />
                        </button>
                    </div>
                </div>
            </div>
            <div id="T">
                {/* ✅ Toggle Tabs */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === "listings" ? "active" : ""}`} onClick={() => setActiveTab("listings")}
                    >
                        <img src={creation} alt="" /> Creations
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "followers" ? "active" : ""}`}
                        onClick={() => setActiveTab("followers")}
                    >
                        <img src={folllow} alt="" />  Follows
                    </button>
                </div>

                {/* ✅ Tab Content */}
                <div className="tab-content">
                    {activeTab === "listings" ? (
                        <div id="Tt">
                            <h3></h3>

                            {/* 🔹 Sort Buttons */}
                            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                                {["upcoming", "ongoing", "ended"].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setSort(option)}
                                        style={{
                                            padding: "8px 15px",
                                            borderRadius: "5px",
                                            fontSize: "1rem",
                                            fontWeight: sort === option ? "bolder" : "",
                                            border: sort === option ? "none" : "none",
                                            background: sort === option ? "#fff" : "transparent",
                                            color: sort === option ? "rgba(41, 41, 41, 1)" : "#fff",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* 🔹 Listing Results */}
                            {loadingListings ? (
                                <p>Loading {sort} listings...</p>
                            ) : listings.length === 0 ? (
                                <p>No {sort} Post found</p>
                            ) : (
                                <div className='listings-scroll'>
                                    {listings.map(listing => (
                                        <div key={listing.id} className='listing-item'>
                                            <img
                                                src={`https://api.votecity.ng${listing.thumbnail?.url}`}
                                                alt="Listing thumbnail"
                                            />
                                            <p>{listing.title || listing.text || "Untitled post"}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="followers-text">My Followers</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;