import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import load from '/src/assets/image/load.png';
import view from '/src/assets/image/view.png';
import participant from '/src/assets/image/participant.png';
import commentIcon from '/src/assets/image/comment.png';
import saved from '/src/assets/image/saves.png';
import alt from '/src/assets/image/alt.jpg';
import verified from '/src/assets/image/verified.png';
import EventCountdown from "./EventCountdown";
import "./event.css";

const Event = ({ postId }) => {
    const [activeSubTab, setActiveSubTab] = useState("comments");
    const [post, setPost] = useState(null);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [resolvedPostId, setResolvedPostId] = useState(null);
    const [subTabData, setSubTabData] = useState([]);
    const [isLoadingSubTab, setIsLoadingSubTab] = useState(false);
    const [error, setError] = useState("");
    const [countdownPhase, setCountdownPhase] = useState("start"); // "start" or "end"

    const navigate = useNavigate();
    const BASE_URL_POST = "https://api.votecity.ng/v1/post";

    const handleGoBack = () => navigate(-1);

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const options = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };


    useEffect(() => {
    if (!post?.datetime_start || !post?.datetime_end) return;

    const checkPhase = () => {
        const now = new Date();
        const startTime = new Date(post.datetime_start);
        const endTime = new Date(post.datetime_end);

        if (now >= startTime && now < endTime) {
            setCountdownPhase("end");
        } else if (now >= endTime) {
            setCountdownPhase("ended");
        } else {
            setCountdownPhase("start");
        }
    };

    checkPhase(); // run immediately
    const interval = setInterval(checkPhase, 1000);
    return () => clearInterval(interval);
}, [post]);
    // Fetch main post
    useEffect(() => {
        if (!postId) return;

        setIsLoadingPost(true);
        setError("");
        fetch(`${BASE_URL_POST}/${postId}`)
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
            .then(data => {
                const postData = data?.data?.post || null;
                setPost(postData);
                if (postData?.post_id) setResolvedPostId(postData.post_id);
            })
            .catch(err => {
                console.error("Fetch post error:", err);
                setError("Failed to load post");
            })
            .finally(() => setIsLoadingPost(false));
    }, [postId]);

    // Determine sub-tabs dynamically
    const subTabs = post?.post_type === "event"
        ? ["comments", "tickets"]
        : post?.post_type === "project"
            ? ["comments", "donations"]
            : post?.post_type === "poll"
                ? ["comments", "contestants", "leaderboard"]
                : ["comments"];

    // Fetch sub-tab data whenever tab changes
    useEffect(() => {
        if (!resolvedPostId) return;

        const fetchSubTabData = async () => {
            let url = "";
            switch (activeSubTab) {
                case "comments": url = `${BASE_URL_POST}/comment/${resolvedPostId}`; break;
                case "tickets": url = `${BASE_URL_POST}/create/ticket/${resolvedPostId}`; break;
                case "donations": url = `${BASE_URL_POST}/process/donation/${resolvedPostId}`; break;
                case "contestants": url = `${BASE_URL_POST}/create/contestant/${resolvedPostId}`; break;
                default: url = ""; break;
            }
            if (!url) return setSubTabData([]);

            setIsLoadingSubTab(true);
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                console.log(`Fetched ${activeSubTab}:`, data);

                let result = [];
                switch (activeSubTab) {
                    case "comments": result = data?.data?.comments || []; break;
                    case "tickets": result = data?.data?.tickets || []; break;
                    case "donations": result = data?.data?.donations || []; break;
                    case "contestants": result = data?.data?.contestants || []; break;
                    case "leaderboard": result = data?.data || []; break;
                    default: result = []; break;
                }
                setSubTabData(result);
            } catch (err) {
                console.error(`Error fetching ${activeSubTab}:`, err);
                setSubTabData([]);
            } finally {
                setIsLoadingSubTab(false);
            }
        };

        fetchSubTabData();
    }, [activeSubTab, resolvedPostId]);

    if (isLoadingPost) return (
        <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={load} alt="Loading post..." />
        </div>
    );

    if (!post) return <p>No post found</p>;

    return (
        <div className="post">
            {/* Main Post Info */}
            <div id="Op">
                <div id="ev">
                    <button onClick={handleGoBack} id="bm" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#fff", marginBottom: "15px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px", marginRight: "8px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                <div id="imOp" className="image-wrapper">
                    <img className="thUrl" src={`https://api.votecity.ng${post.thumbnail?.url}`} alt={post.title} />
                    <div className="date-badge">
                        <p className="day">{new Date(post.datetime_start).getDate()}</p>
                        <p className="month">{new Date(post.datetime_start).toLocaleString("en-US", { month: "short" }).toUpperCase()}</p>
                    </div>
                    <div className="type-badge">{post.post_type}</div>
                </div>

                <div id="tit">
                    <div style={{ width: "45%" }}>
                        <p className="frTo">From</p>
                        <p className="timee">{formatDateTime(post.datetime_start)}</p>
                    </div>
                          <hr style={{borderRight:"none",height:"30px",borderLeft:"0.1rem solid #fff", borderTop:"none", borderBottom:"none", display:"flex", alignSelf:"center",justifySelf:"center"}} />
                    <div style={{ width: "45%", textAlign: "end" }}>
                        <p className="frTo">To</p>
                        <p className="timee">{formatDateTime(post.datetime_end)}</p>
                    </div>
                </div>

                <div className="post-title">
                    <p className="frTo" style={{ textTransform: "uppercase" }}>{post.title || post.text || "Untitled post"}</p>
                    <div className="views">
                        <p><img src={commentIcon} alt="" />{post.comments_count}</p>
                        <p><img src={participant} alt="" />{post.participants_count}</p>
                        <p><img src={saved} alt="" />{post.saves_count}</p>
                        <p><img src={view} alt="" />{post.view_count}</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "5px", alignItems: "center" }} id="useRx">
                    <img className="fitt" src={post?.user?.thumbnail?.url ? `https://api.votecity.ng${post?.user?.thumbnail?.url}` : alt} alt="" style={{ height: "55px", width: "55px", objectFit: "cover", borderRadius: "100px" }} />
                    <div id="pst">
                        <p className="frTo" style={{ display: "flex" }}>
                            Posted by &nbsp;<span style={{ fontWeight: "bold" }}>{post.user?.fullname}</span>
                            {post.user?.id_verified === 1 && <img src={verified} alt="Verified" style={{ height: "15px", paddingLeft: "4px" }} />}
                        </p>
                        <p className="timee" style={{ color: "#ffffffb4" }}>@{post.user?.username}</p>
                    </div>
                </div>

                <div id="discb">
                    <p className="desci">Event Description</p>
                    <p id="cap" className="frTo" style={{ color: "rgb(192, 192, 197)" }}>{post.description}</p>
                </div>
            </div>

            {/* Countdown & Tabs */}
            <div id="Tp">
                {post.post_type && countdownPhase !== "ended" && (
    <div style={{
        background: "#0000003d",
        border: "1px solid rgba(255, 255, 255, 0.133)",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "15px"
    }}>
        <p style={{
            textAlign: "center",
            color: "#ffffffb4",
            textTransform: "uppercase",
            fontSize: "0.9rem"
        }}>
            {post.post_type} {countdownPhase === "start" ? "STARTS" : "ENDS"} IN APPROXIMATELY:
        </p>

        <EventCountdown
            startTime={countdownPhase === "start" ? post.datetime_start : post.datetime_end}
        />
    </div>
)}

{countdownPhase === "ended" && (
    <div style={{
        background: "#0000003d",
        border: "1px solid rgba(255, 255, 255, 0.133)",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "15px"
    }}>
        <p style={{
            textAlign: "center",
            color: "#ffffffb4",
            textTransform: "uppercase",
            fontSize: "0.9rem"
        }}>
            {post.post_type} HAS ENDED
        </p>
    </div>
)}

                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "15px", borrerBottom:"1px solod #fff"}}>
                    {subTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize:"0.9rem",
                                cursor: "pointer",
                                background: activeSubTab === tab ? "#fff" : "none",
                                color: activeSubTab === tab ? "#000" : "#fff",
                                fontWeight: activeSubTab === tab ? "bold" : "normal",
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
               

                {/* Sub-tab Content */}
                <div style={{ textAlign: "center", color: "#fff", marginTop: "10px" }}>
                    {isLoadingSubTab ? (
                        <p>Loading {activeSubTab}...</p>
                    ) : (
                        activeSubTab === "comments" ? (
                            subTabData.length === 0 || subTabData.every(c => !c.comment) ? (
                                <p>No comment found</p>
                            ) : (
                                subTabData.map(c => (
                                    <div key={c.id} style={{borderRadius:"10px",border:"1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex",flexDirection:"row",justifyContent:"space-between", textAlign: "left", padding:"15px 20px" }}>
                                            <div style={{width:"20%"}}>
                                            <img className="fitt" src={c.user?.thumbnail?.url ? `https://api.votecity.ng${c.user?.thumbnail.url}` : alt} alt={c.title} style={{ width: "50px", height: "50px", borderRadius: "100px", marginTop: "5px" }}></img>
                                            </div>
                                            <div style={{width:"80%"}}>
                                                <p  style={{display:"flex", flexDirection:"column"}}>
                                                   <span id="uuu" style={{ fontWeight: "bold" }}>  {c.user?.fullname || "Anonymous"}</span>  <span id="uu" style={{color: "rgba(255, 255, 255, 0.706)"}} > {c.user?.username ? ` @${c.user.username}` : ""}</span>
                                                </p>
                                                <p>{c.comment}</p>
                                            </div>
                                    </div>
                                ))
                            )
                        ) : activeSubTab === "tickets" ? (
                            subTabData.length === 0 ? <p>No ticket found</p> :
                                subTabData.map(t => (
                                    <div key={t.id} style={{ marginBottom: "10px", textAlign: "left" }}>
                                        <p style={{ fontWeight: "bold" }}>{t.name}</p>
                                        <p>{t.description}</p>
                                        <p>Price: {t.price}</p>
                                    </div>
                                ))
                        ) : activeSubTab === "donations" ? (
                            subTabData.length === 0 ? <p>No donation found</p> :
                                subTabData.map(d => (
                                    <div key={d.id} style={{ marginBottom: "10px", textAlign: "left" }}>
                                        <p>{d.user_name || "Anonymous"} donated {d.amount}</p>
                                    </div>
                                ))
                        ) : activeSubTab === "contestants" ? (
                            subTabData.length === 0 ? <p>No contestant found</p> :
                                subTabData.map(c => (
                                    <div key={c.id} style={{ borderRadius: "10px",border:"1px solid #ffffff22", padding: "15px 20px", background: "#0000003d", marginBottom: "10px", textAlign: "left", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                                        <div style={{ width: "20%" }}>
                                            <img className="fitt" src={c.thumbnail?.url ? `https://api.votecity.ng${c.thumbnail.url}` : alt} alt={c.title} style={{ width: "50px", height: "50px", borderRadius: "100px", marginTop: "5px" }}
                                            />
                                        </div>
                                        <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{c.title}</p>
                                            <p id="desci" style={{ fontSize: "0.85rem" }}>{c.description}</p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p>No {activeSubTab} found</p>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default Event;










