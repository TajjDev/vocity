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
import reload from '/src/assets/image/reload.png';

function UserProfile({ userId }) {

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [notFound, setNotFound] = useState(false);         // 404
    const [serverError, setServerError] = useState("")

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

    const [sort, setSort] = useState("upcoming");

    const [followCache, setFollowCache] = useState({
        followers: [],
        following: []
    });

    const [loadingFollow, setLoadingFollow] = useState({
        followers: false,
        following: false,
        following: [],
        followers: []
    });

    const [sortII, setSortII] = useState("followers");
    const [q, setQ] = useState("");
    const [list, setList] = useState([]);

    const [shots, setShots] = useState([]);
    const [loadingShots, setLoadingShots] = useState(true);

    const [activeTab, setActiveTab] = useState("listings");

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupImages, setPopupImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [Copied, setCopied] = useState(false);

    const BASE_URL_USER = "https://api.votecity.ng/v1/user";
    const BASE_URL_LISTINGS = "https://api.votecity.ng/v1/post/create/listings";
    const BASE_URL_SHOTS = "https://api.votecity.ng/v1/shot/user";
    const PLink = `https://vocity.vercel.app/profile/${userId}`;


    // ✅ USER FETCH
    const fetchUser = () => {
        setLoadingUser(true);
        setLoadingError(false);
        setNotFound(false);
        setServerError("");
        setUser(null);

        fetch(`${BASE_URL_USER}/${userId}`)
            .then(res => {
                if (res.ok) return res.json();
                if (res.status === 404) throw { type: "not-found" };
                throw { type: "server", status: res.status };
            })
            .then(data => {
                const userData = data?.data?.user || null;
                setUser(userData);
                if (!userData) throw { type: "not-found" };
            })
            .catch(err => {
                if (err?.type === "not-found") {
                    setNotFound(true);
                } else if (err?.type === "server") {
                    setServerError(`Server Error ${err.status}`);
                } else {
                    console.error("NETWORK ERROR:", err);
                    setLoadingError(true);
                }
            })
            .finally(() => setLoadingUser(false));
    };

    useEffect(() => {
        if (userId) fetchUser();
    }, [userId]);
    // ✅ LISTINGS FETCH
    useEffect(() => {

        if (listingsCache[sort]?.length > 0) return;

        setLoadingListings(prev => ({ ...prev, [sort]: true }));

        fetch(`${BASE_URL_LISTINGS}/${userId}?sort=${sort}&page=1`)
            .then(res => {
                if (!res.ok) throw new Error("Network error");
                return res.json();
            })
            .then(data => {
                setListingsCache(prev => ({ ...prev, [sort]: data?.data?.posts || [] }));
            })
            .catch(err => {
                console.error("Listings fetch error:", err);
                setLoadingError(true);
            })
            .finally(() => {
                setLoadingListings(prev => ({ ...prev, [sort]: false }));
            });
    }, [sort, userId]);


    // ✅ SHOTS FETCH
    useEffect(() => {

        setLoadingShots(true);

        fetch(`${BASE_URL_SHOTS}/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Network error");
                return res.json();
            })
            .then(data => {
                setShots(data?.data?.shots || []);
                setLoadingError(false);
            })
            .catch(err => {
                console.error("Shots fetch error:", err);
                setLoadingError(true);
            })
            .finally(() => setLoadingShots(false));

    }, [userId]);


    // ✅ FOLLOW FETCH
    const fetchFollowData = (type) => {

        if (followCache[type]?.length > 0) {
            setList(followCache[type]);
            return;
        }

        setLoadingFollow(prev => ({ ...prev, [type]: true }));

        const params = new URLSearchParams({
            sort: type,
            ...(q && { q }),
        });

        fetch(`https://api.votecity.ng/v1/user/follow/${userId}?${params}`)
            .then(res => {
                if (!res.ok) throw new Error("Network error");
                return res.json();
            })
            .then(data => {
                const follows = data?.data?.follows || [];
                setList(follows);
                setFollowCache(prev => ({ ...prev, [type]: follows }));
                setLoadingError(false);
            })
            .catch(err => {
                console.error("Follow fetch error:", err);
                setLoadingError(true);
            })
            .finally(() => {
                setLoadingFollow(prev => ({ ...prev, [type]: false }));
            });
    };


    // ✅ TRIGGER FOLLOW FETCH
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchFollowData(sortII);
        }, 400);

        return () => clearTimeout(timeout);
    }, [sortII, q]);


    // ✅ POPUP HANDLERS
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

    // ✅ COPY LINK
    const handleCopy = () => {
        navigator.clipboard.writeText(PLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied: " + PLink);
    };


    // ✅ UI STATES
    if (loadingError) {
        return (
            <div style={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "crimson"
            }}>
                <p style={{ fontSize: "1.2rem" }}>Internet Error</p>
                <button style={{ background: "none", marginTop: "10px", border: "none" }} onClick={fetchUser}>
                    <img style={{ height: "40px", width: "40px" }} src={reload} alt="reload" />
                </button>
            </div>
        );
    }

    if (loadingUser) {
        return (
            <div style={{
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <img style={{ height: "50px", width: "50px" }} src={load} alt="loading..." />
            </div>
        );
    }

    if (notFound) {
        return (
            <div  style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center", color: "rgb(192,192,197)",width:"100%",flexDirection:"column",gap:"15px" }}>
                <p id='unca' style={{width:"70px",height:"70px",borderRadius:"50px",display:"flex",justifyContent:"center",alignContent:"center",    flexWrap: "wrap",fontSize:"1.2rem",fontWeight:"bold"}}><p style={{fontWeight:"500",width:"25px",height:"25px", display: "flex", justifyContent: "center", alignItems: "center",flexWrap:"wrap",placeContent:"center",borderRadius:"50px",fontSize:"0.9rem"}}>!</p></p>
            <p  style={{color: "rgb(192,192,197)",padding:"0px 20px",textAlign:'center',fontSize:"1.3rem", fontWeight:"bold"}}>
                The profile your are looking for does not exist
            </p>
            <a style={{fontSize:"0.9rem"}} id='rtHo' href="https://vocity.vercel.app">Return to home</a>
            </div>
            
        );
    }

    if (serverError) {
        return (
            <div style={{ height: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "orange" }}>
                <p>Server error</p>
                <p>{serverError}</p>
                <button onClick={fetchUser}>
                    <img style={{ height: "40px", width: "40px" }} src={reload} alt="reload" />
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <p style={{
                height: '90vh',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgb(192,192,197)"
            }}>
                No user found
            </p>
        );
    }


    const currentListings = listingsCache[sort] || [];
    const isLoadingListings = loadingListings[sort];
    const currentFollowList = followCache[sortII] || [];
    const isLoadingFollow = loadingFollow[sortII];

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
                        onClick={() => openPopup([user.thumbnail?.url ? `https://api.votecity.ng${user.thumbnail?.url}` : alt])}
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
                            <img src={popupImages[currentIndex]} alt="popup" style={{ objectFit: "cover" }} />
                            {popupImages.length > 1 && (
                                <>
                                    <button
                                        style={{ background: "#808080", opacity: currentIndex === 0 ? 0.4 : 1 }}
                                        className="popup-arrow left"
                                        onClick={currentIndex === 0 ? null : prevImage}
                                        disabled={currentIndex === 0}
                                    >
                                        ‹
                                    </button>

                                    <button
                                        style={{ background: "#808080", opacity: currentIndex === popupImages.length - 1 ? 0.4 : 1 }}
                                        className="popup-arrow right"
                                        onClick={currentIndex === popupImages.length - 1 ? null : nextImage}
                                        disabled={currentIndex === popupImages.length - 1}
                                    >
                                        ›
                                    </button>

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
                                <>
                                    <div className='listings-scroll'>
                                        {/* {currentListings.map(listing => ( */}
                                        <div className='listing-item'>
                                            <div className="listing-image-container">
                                                <img style={{ background: "#fff", opacity: "0.3" }} src={null} alt="" className="listing-image" />
                                                <p className={`status-label ${sort}`}></p>
                                                <p id='g'></p>
                                            </div>
                                            <div style={{ background: "#fff", opacity: "0.3" }} className="listing-title">
                                                <p style={{ textTransform: "uppercase" }} id='short'></p>
                                                <div id="views">
                                                    <p><img src={null} alt="" /></p>
                                                    <p><img src={null} alt="" /></p>
                                                    <p><img src={null} alt="" /></p>
                                                    <p><img src={null} alt="" /></p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ))} */}
                                    </div>

                                </>
                            ) : currentListings.length === 0 ? (
                                <p style={{ textAlign: "center", color: " rgb(192, 192, 197)" }}>No {sort} posts yet</p>
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

                            {isLoadingFollow ? (
                                <>
                                    <div style={{ gap: "15px", borderRadius: "10px", background: "#0000003d", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px", width: "100%" }}>
                                        <div style={{ display: "flex" }}>
                                            <img className="fitt" src={null} /*alt={c.title}*/ style={{ width: "40px", height: "40px", opacity: "0.5", borderRadius: "100px", background: "#fff", marginTop: "5px" }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "space-evenly" }}>
                                            {/* <p style={{ display: "flex", flexDirection: "column" }}> */}
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "150px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>

                                            </p>
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "200px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>
                                                {/* date */}
                                            </p>
                                            {/* </p> */}
                                            {/* <p style={{ paddingTop: "5px", textTransform: "capitalize", fontSize: "0.9rem" }}> </p> */}
                                        </div>
                                    </div>
                                    <div style={{ gap: "15px", borderRadius: "10px", background: "#0000003d", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px", width: "100%" }}>
                                        <div style={{ display: "flex" }}>
                                            <img className="fitt" src={null} /*alt={c.title}*/ style={{ width: "40px", height: "40px", opacity: "0.5", borderRadius: "100px", background: "#fff", marginTop: "5px" }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "space-evenly" }}>
                                            {/* <p style={{ display: "flex", flexDirection: "column" }}> */}
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "150px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>

                                            </p>
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "200px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>
                                                {/* date */}
                                            </p>
                                            {/* </p> */}
                                            {/* <p style={{ paddingTop: "5px", textTransform: "capitalize", fontSize: "0.9rem" }}> </p> */}
                                        </div>
                                    </div>
                                    <div style={{ gap: "15px", borderRadius: "10px", background: "#0000003d", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px", width: "100%" }}>
                                        <div style={{ display: "flex" }}>
                                            <img className="fitt" src={null} /*alt={c.title}*/ style={{ width: "40px", height: "40px", opacity: "0.5", borderRadius: "100px", background: "#fff", marginTop: "5px" }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "space-evenly" }}>
                                            {/* <p style={{ display: "flex", flexDirection: "column" }}> */}
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "150px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>
                                            </p>
                                            <p style={{ color: "#fff", fontSize: "0.9rem", height: "10px", width: "200px", background: "#fff", opacity: "0.3", borderRadius: "10px" }}>
                                                {/* date */}
                                            </p>
                                            {/* </p> */}
                                            {/* <p style={{ paddingTop: "5px", textTransform: "capitalize", fontSize: "0.9rem" }}> </p> */}
                                        </div>
                                    </div>
                                </>) : currentFollowList.length === 0 ? (
                                    <p style={{ textAlign: "center", color: " rgb(192, 192, 197)", marginTop: "5px", width: "100%" }}>
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
                                                transition: "background 0.2s ease", background: "#0000003d"
                                            }}
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
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
