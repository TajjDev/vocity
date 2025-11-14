import './profile.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import verified from '/src/assets/image/verified.png';
import share from '/src/assets/image/share.png';
import follow from '/src/assets/image/follow.png';
import apple from '/src/assets/image/Apple.png';
import creation from '/src/assets/image/creation.png';
import folllow from '/src/assets/image/follows.png';
import google from '/src/assets/image/Google.png';
import view from '/src/assets/image/view.png';
import participant from '/src/assets/image/participant.png';
import comment from '/src/assets/image/comment.png';
import saved from '/src/assets/image/saves.png';
import alt from '/src/assets/image/alt.jpg';
import load from '/src/assets/image/load.png';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Listings caching
    const [listingsCache, setListingsCache] = useState({
        upcoming: [],
        ongoing: [],
        ended: []
    });
    const [loadingListings, setLoadingListings] = useState({
        upcoming: false,
        ongoing: false,
        ended: false
    });
    const [sort, setSort] = useState("ongoing");

    // Followers/Following caching
    const [followCache, setFollowCache] = useState({
        followers: [],
        following: []
    });
    const [loadingFollow, setLoadingFollow] = useState({
        followers: false,
        following: false
    });
    const [errorFollow, setErrorFollow] = useState({
        followers: "",
        following: ""
    });
    const [sortII, setSortII] = useState("followers");
    const [q, setQ] = useState("");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Shots
    const [shots, setShots] = useState([]);
    const [loadingShots, setLoadingShots] = useState(true);

    // Tabs
    const [activeTab, setActiveTab] = useState("listings");

    // Popup
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupImages, setPopupImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Follow popup
    const [showPopup, setShowPopup] = useState(false);
    const [Copied, setCopied] = useState(false);

    const BASE_URL_USER = "https://api.votecity.ng/v1/user";
    const BASE_URL_LISTINGS = "https://api.votecity.ng/v1/post/create/listings";
    const BASE_URL_SHOTS = "https://api.votecity.ng/v1/shot/user";
    const PLink = `https://vocity.vercel.app/profile/${userId}`;

    // 🔹 Fetch user profile
    useEffect(() => {
        setLoadingUser(true);
        fetch(`${BASE_URL_USER}/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setUser(data?.data?.user || null))
            .catch(err => console.error("Fetch user error:", err))
            .finally(() => setLoadingUser(false));
    }, [userId]);

    // 🔹 Fetch listings with caching
    useEffect(() => {
        if (listingsCache[sort]?.length > 0) return;

        setLoadingListings(prev => ({ ...prev, [sort]: true }));

        fetch(`${BASE_URL_LISTINGS}/${userId}?sort=${sort}&page=1`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setListingsCache(prev => ({ ...prev, [sort]: data?.data?.posts || [] }));
            })
            .catch(err => console.error("Fetch listings error:", err))
            .finally(() => setLoadingListings(prev => ({ ...prev, [sort]: false })));
    }, [userId, sort]);

    // 🔹 Fetch shots
    useEffect(() => {
        setLoadingShots(true);
        fetch(`${BASE_URL_SHOTS}/${userId}`)
            .then(res => res.json())
            .then(data => setShots(data?.data?.shots || []))
            .catch(err => console.error("Fetch shots error:", err))
            .finally(() => setLoadingShots(false));
    }, [userId]);

    // 🔹 Fetch followers/following with caching
    const fetchFollowData = (type) => {
        if (followCache[type]?.length > 0) {
            setList(followCache[type]);
            return;
        }

        setLoadingFollow(prev => ({ ...prev, [type]: true }));
        setErrorFollow(prev => ({ ...prev, [type]: "" }));

        const params = new URLSearchParams({
            sort: type,
            ...(q && { q }),
        });

        fetch(`https://api.votecity.ng/v1/user/follow/${userId}?${params}`)
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
            })
            .then(data => {
                const followList = data?.data?.follows || [];
                setList(followList);
                setFollowCache(prev => ({ ...prev, [type]: followList }));
            })
            .catch(err => {
                console.error("Error fetching follow data:", err);
                setErrorFollow(prev => ({ ...prev, [type]: "Failed to load followers/following" }));
            })
            .finally(() => setLoadingFollow(prev => ({ ...prev, [type]: false })));
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchFollowData(sortII);
        }, 500);
        return () => clearTimeout(timeout);
    }, [sortII, q]);

    // 🔹 Popup handlers
    const openPopup = (images, index = 0) => {
        setPopupImages(images);
        setCurrentIndex(index);
        setPopupOpen(true);
    };
    const closePopup = () => setPopupOpen(false);
    const nextImage = () => popupImages.length > 1 && setCurrentIndex(prev => (prev + 1) % popupImages.length);
    const prevImage = () => popupImages.length > 1 && setCurrentIndex(prev => (prev - 1 + popupImages.length) % popupImages.length);

    // 🔹 Swipe handlers
    let touchStartX = 0, touchEndX = 0;
    const handleTouchStart = e => touchStartX = e.changedTouches[0].screenX;
    const handleTouchEnd = e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextImage();
        if (touchEndX - touchStartX > 50) prevImage();
    };

    // 🔹 Copy profile link
    const handleCopy = () => {
        navigator.clipboard.writeText(PLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied: " + PLink);
    };

    if (loadingUser) return <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={load} alt="" /></div>;
    if (!user) return <p>No user found</p>;

    const currentListings = listingsCache[sort] || [];
    const isLoadingListings = loadingListings[sort];
    const currentFollowList = followCache[sortII] || [];
    const isLoadingFollow = loadingFollow[sortII];
    const errorCurrentFollow = errorFollow[sortII];

    return (
        <div className="user-profile">
            {/* User Info */}
            <div id="O">
                <div id="name">
                    <div id="userNaVe">
                        <p id="full">{user.fullname}</p>
                        {user.id_verified === 1 && <img src={verified} alt="Verified" />}
                    </div>
                    <p id="userrr">@{user.username}</p>
                </div>
                <div id="img">
                    <img
                        id="dp"
                        className="profile"
                        src={user.thumbnail?.url ? `https://api.votecity.ng${user.thumbnail.url}` : alt}
                        alt={user.fullname || "User avatar"}
                        style={{ cursor: "pointer", border: "2px solid #fff", padding: "3px" }}
                        onClick={() => openPopup([`https://api.votecity.ng${user.thumbnail?.url}`])}
                    />
                </div>
                {/* Follow & Share */}
                <div id="followw">
                    <div id="fol">
                        <p><span style={{ fontSize: "0.9rem" }}>{user.followers}</span> Followers</p>
                        <p><span style={{ fontSize: "0.9rem" }}>{user.following}</span> Following</p>
                    </div>
                    <div id="folBtn">
                        <button className="bbb" onClick={() => setShowPopup(true)}>
                            Follow <img id="btnn" src={follow} alt="" />
                        </button>
                        {showPopup && (
                            <div id="popOver">
                                <div id="popUp">
                                    <p id="downn">Download the App to follow</p>
                                    <div id="apGo">
                                        <a href="" className="goAp"><img src={google} alt="" /></a>
                                        <a href="" className="goAp"><img src={apple} alt="" /></a>
                                    </div>
                                    <p>Available both on <br /> Play store and Apple store</p>
                                    <button id="cls" onClick={() => setShowPopup(false)}>Close</button>
                                </div>
                            </div>
                        )}
                        <button onClick={handleCopy} className="bbb" id="btnT">
                            Share Profile <img src={share} alt="" />
                        </button>
                    </div>
                </div>

                {/* Shots */}
                <div id="shots-section">
                    {loadingShots ? <p>Loading shots...</p> : shots.length === 0 ? null : (
                        <div className="shots-scroll">
                            {shots.map((shot, index) => (
                                <div key={shot.id} className="shot-item">
                                    <img
                                        src={`https://api.votecity.ng${shot.photo.url}`}
                                        alt={shot.text || "User shot"}
                                        className="shot-thumbnail"
                                        style={{ cursor: "pointer", objectFit: "cover" }}
                                        onClick={() => openPopup(shots.map(s => `https://api.votecity.ng${s.photo.url}`), index)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Popup */}
                {popupOpen && (
                    <div className="popup-overlay" onClick={closePopup} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                        <div className="popup-content" onClick={e => e.stopPropagation()}>
                            <img src={popupImages[currentIndex]} alt="popup" style={{ objectFit: "cover", borderRadius: "10px" }} />
                            {popupImages.length > 1 && (
                                <>
                                    <button style={{ background: "#808080" }} className="popup-arrow left" onClick={prevImage}>‹</button>
                                    <button style={{ background: "#808080" }} className="popup-arrow right" onClick={nextImage}>›</button>
                                </>
                            )}
                            <button style={{ background: "#808080" }} className="popup-close" onClick={closePopup}>✕</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div id="T">
                <div className="profile-tabs">
                    <button className={`tab-btn ${activeTab === "listings" ? "active" : ""}`} onClick={() => setActiveTab("listings")}>
                        <img src={creation} alt="" /> Creations
                    </button>
                    <button className={`tab-btn ${activeTab === "followers" ? "active" : ""}`} onClick={() => setActiveTab("followers")}>
                        <img src={folllow} alt="" /> Follows
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "listings" ? (
                        <div id="Tt">
                            <div id='butt' style={{ display: "flex", marginBottom: "10px" }}>
                                {["upcoming", "ongoing", "ended"].map(option => (
                                    <button key={option} onClick={() => setSort(option)}
                                        style={{
                                            borderRadius: "5px",
                                            fontWeight: sort === option ? "bolder" : "",
                                            border: "none",
                                            background: sort === option ? "#fff" : "transparent",
                                            color: sort === option ? "rgba(41, 41, 41, 1)" : "#fff",
                                            cursor: "pointer"
                                        }}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {isLoadingListings ? (
                                <p>Loading {sort} listings...</p>
                            ) : currentListings.length === 0 ? (
                                <p style={{ textAlign: "center" }}>No {sort} posts found</p>
                            ) : (
                                <div className='listings-scroll'>
                                    {currentListings.map(listing => (
                                        <div key={`${listing.id}-${listing.post_id}`} className='listing-item'>
                                            <Link to={`/post/${listing.post_id}`}>
                                                <div className="listing-image-container">
                                                    <img src={`https://api.votecity.ng${listing.thumbnail?.url}`} alt="Listing thumbnail" className="listing-image" />
                                                    <p className={`status-label ${sort}`}>{listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : sort}</p>
                                                    <p id='g'>{listing.post_type}</p>
                                                </div>
                                                <div className="listing-title">
                                                    <p style={{ textTransform: "uppercase" }} id='short'>{listing.title || listing.text || "Untitled post"}</p>
                                                    <div id="views">
                                                        <p><img src={comment} alt="" />{listing.comments_count}</p>
                                                        <p><img src={participant} alt="" />{listing.participants_count}</p>
                                                        <p><img src={saved} alt="" />{listing.saves_count}</p>
                                                        <p><img src={view} alt="" />{listing.view_count}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div id="follow">
                            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                                <button onClick={() => { setSortII("followers"); setQ(""); }}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: sortII === "followers" ? "#fff" : "none",
                                        color: sortII === "followers" ? "#000" : "#fff",
                                        fontWeight: sortII === "followers" ? "bold" : "normal",
                                    }}>Followers</button>
                                <button onClick={() => { setSortII("following"); setQ(""); }}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: sortII === "following" ? "#fff" : "none",
                                        color: sortII === "following" ? "#000" : "#fff",
                                        fontWeight: sortII === "following" ? "bold" : "normal",
                                    }}>Following</button>
                            </div>

                            {isLoadingFollow && <>
                                <div style={{ width: "100%", gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
                                    <div style={{ display: "flex" }}>
                                        <img className="fitt" src={alt} /*alt={c.title}*/ style={{ width: "40px", height: "40px", borderRadius: "100px", marginTop: "5px" }} />
                                    </div>
                                    <div>
                                        <p style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ color: "#fff", fontSize: "0.9rem" }}>
                                                {/* username */}
                                            </span>
                                            <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                                                {/* date */}
                                            </p>
                                        </p>
                                        <p style={{ paddingTop: "5px", textTransform: "capitalize", fontSize: "0.9rem" }}> </p>
                                    </div>
                                </div>
                            </>}
                            {/* {errorCurrentFollow && <p style={{ textAlign: "center", color: "red" }}>{errorCurrentFollow}</p>} */}

                            {!isLoadingFollow && !errorCurrentFollow && (
                                currentFollowList.length === 0 ? (
                                    <p style={{ textAlign: "center", color: "#fff", marginTop: "20px" }}>
                                        {sortII === "followers" ? "No followers found" : "No followings found"}
                                    </p>
                                ) : (
                                    <ul id='ull' style={{ listStyle: "none", width: "100%", padding: 0 }}>
                                        {currentFollowList.map(item => (
                                            <li key={item.user_id} onClick={() => window.location.href = `https://vocity.vercel.app/profile/${item.user_id}`}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: "10px",
                                                    marginBottom: "15px", padding: "10px",
                                                    borderRadius: "8px", width: "100%",
                                                    cursor: "pointer", textDecoration: "none", color: "inherit",
                                                    transition: "background 0.2s ease"
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                            >
                                                <img src={item.thumbnail?.url ? `https://api.votecity.ng${item.thumbnail.url}` : alt} alt={item.username}
                                                    style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }} />
                                                <div>
                                                    <p style={{ margin: 0, display: "flex", fontSize: "0.9rem", fontWeight: "bold", color: "#fff" }}>
                                                        {item.fullname} {item.id_verified === 1 && <img style={{ height: "15px", paddingLeft: "2px", display: "flex", alignSelf: "center" }} src={verified} alt="Verified" />}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>@{item.username}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
