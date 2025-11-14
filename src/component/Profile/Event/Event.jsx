import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
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

const BASE_URL_POST = "https://api.votecity.ng/v1/post";

const Event = ({ postId }) => {
    const [activeSubTab, setActiveSubTab] = useState("comments");
    const [post, setPost] = useState(null);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [resolvedPostId, setResolvedPostId] = useState(null);

    const [subTabCache, setSubTabCache] = useState({});
    const [subTabData, setSubTabData] = useState([]);
    const [isLoadingSubTab, setIsLoadingSubTab] = useState(false);
    const [subTabError, setSubTabError] = useState("");

    const [countdownPhase, setCountdownPhase] = useState("start");

    const [leaderboardLoaded, setLeaderboardLoaded] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);

    const [searchQuery, setSearchQuery] = useState(""); // Added for contestant search

    const esRef = useRef(null);
    const prevLeaderboardRef = useRef({});

    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const options = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };
    // Convert ISO date → "time ago"
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        const minutes = Math.floor(diff / 60);
        const hours = Math.floor(diff / 3600);
        const days = Math.floor(diff / 86400);
        const months = Math.floor(diff / 2592000);

        if (diff < 60) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hrs ago`;
        if (days < 30) return `${days} days ago`;
        return `${months} months ago`;
    };
    const formatDonationDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-US", options); // e.g., "01 Oct, 2025"
    };


    // ---------- POST FETCH ----------
    useEffect(() => {
        if (!postId) return;

        setIsLoadingPost(true);
        setPost(null);

        fetch(`${BASE_URL_POST}/${postId}`)
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
            .then(data => {
                const postData = data?.data?.post || null;
                setPost(postData);
                if (postData?.post_id) setResolvedPostId(postData.post_id);
            })
            .catch(err => console.error("Fetch post error:", err))
            .finally(() => setIsLoadingPost(false));
    }, [postId]);

    // ---------- COUNTDOWN PHASE ----------
    useEffect(() => {
        if (!post?.datetime_start || !post?.datetime_end) return;

        const checkPhase = () => {
            const now = new Date();
            const startTime = new Date(post.datetime_start);
            const endTime = new Date(post.datetime_end);

            if (now >= startTime && now < endTime) setCountdownPhase("end");
            else if (now >= endTime) setCountdownPhase("ended");
            else setCountdownPhase("start");
        };

        checkPhase();
        const interval = setInterval(checkPhase, 1000);
        return () => clearInterval(interval);
    }, [post]);

    // ---------- SUB-TABS ----------
    const subTabs = post?.post_type === "event"
        ? ["comments", "tickets"]
        : post?.post_type === "project"
            ? ["comments", "donations"]
            : post?.post_type === "poll"
                ? ["comments", "contestants", "leaderboard"]
                : ["comments"];

    // ---------- FETCH SUBTAB ----------
    const fetchSubTabSnapshot = async (tab, id) => {
        let url = "";
        switch (tab) {
            case "comments": url = `${BASE_URL_POST}/comment/${id}`; break;
            case "tickets": url = `${BASE_URL_POST}/create/ticket/${id}`; break;
            case "donations": url = `${BASE_URL_POST}/process/donation/${id}`; break;
            case "contestants": url = `${BASE_URL_POST}/create/contestant/${id}`; break;
            case "leaderboard": url = `https://api.votecity.ng/v1/leaderboard/${id}`; break;
            default: throw new Error("Unknown tab");
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        switch (tab) {
            case "comments": return data?.data?.comments || [];
            case "tickets": return data?.data?.tickets || [];
            case "donations": return data?.data?.donations || [];
            case "contestants": return data?.data?.contestants || [];
            case "leaderboard": return data?.data?.leaderboard || data?.data?.contestants || data?.leaderboard || data?.contestants || [];
            default: return [];
        }
    };

    // ---------- SUB-TAB EFFECT ----------
    useEffect(() => {
        if (!resolvedPostId) return;

        let isMounted = true;

        const loadTab = async () => {
            setSubTabError("");
            setIsLoadingSubTab(true);

            if (subTabCache[activeSubTab]) {
                setSubTabData(subTabCache[activeSubTab]);
                setIsLoadingSubTab(false);
                if (activeSubTab === "leaderboard" && subTabCache.leaderboard) {
                    setLeaderboardData(subTabCache.leaderboard);
                    setLeaderboardLoaded(true);
                }
                return;
            }

            if (activeSubTab === "leaderboard") {
                try {
                    const raw = await fetchSubTabSnapshot("leaderboard", resolvedPostId);
                    const prevRanks = { ...prevLeaderboardRef.current };

                    const sorted = raw.slice().sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0));
                    let currentRank = 0;
                    let lastVotes = null;

                    const ranked = sorted.map((c) => {
                        if (c.total_votes !== lastVotes) {
                            currentRank += 1;
                            lastVotes = c.total_votes;
                        }
                        return {
                            ...c,
                            rank: currentRank,
                            prevRank: prevRanks[c.id] ?? currentRank
                        };
                    });

                    if (!isMounted) return;
                    setLeaderboardData(ranked);
                    setSubTabData(ranked);
                    setSubTabCache(prev => ({ ...prev, leaderboard: ranked }));
                    setLeaderboardLoaded(true);

                    ranked.forEach(c => prevLeaderboardRef.current[c.id] = c.rank);

                } catch (err) {
                    console.error("Initial leaderboard fetch error:", err);
                    if (!isMounted) return;
                    setLeaderboardData([]);
                    setSubTabData([]);
                    setSubTabCache(prev => ({ ...prev, leaderboard: [] }));
                } finally {
                    if (isMounted) setIsLoadingSubTab(false);
                }

                // --- SSE Setup ---
                if (esRef.current && esRef.current.postId !== resolvedPostId) {
                    try { esRef.current.instance.close(); } catch { }
                    esRef.current = null;
                }

                if (!esRef.current) {
                    const es = new EventSource(`https://api.votecity.ng/v1/sse/leaderboard/${resolvedPostId}`);
                    esRef.current = { instance: es, postId: resolvedPostId };

                    es.addEventListener("leaderboard", (e) => {
                        try {
                            const payload = JSON.parse(e.data);
                            if (!Array.isArray(payload)) return;

                            const prevRanks = { ...prevLeaderboardRef.current };
                            const sorted = payload.slice().sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0));
                            let currentRank = 0;
                            let lastVotes = null;

                            const ranked = sorted.map((c) => {
                                if (c.total_votes !== lastVotes) {
                                    currentRank += 1;
                                    lastVotes = c.total_votes;
                                }
                                return {
                                    ...c,
                                    rank: currentRank,
                                    prevRank: prevRanks[c.id] ?? currentRank
                                };
                            });

                            setLeaderboardData(ranked);
                            setSubTabData(ranked);
                            setSubTabCache(prev => ({ ...prev, leaderboard: ranked }));
                            ranked.forEach(c => prevLeaderboardRef.current[c.id] = c.rank);

                        } catch (err) {
                            console.error("Error parsing SSE data:", err);
                        }
                    });

                    es.onerror = (err) => {
                        console.error("Leaderboard SSE error:", err);
                        try { es.close(); } catch { }
                        esRef.current = null;
                    };
                }

                return;
            }

            // Non-leaderboard tabs
            try {
                const items = await fetchSubTabSnapshot(activeSubTab, resolvedPostId);
                if (!isMounted) return;
                setSubTabData(items);
                setSubTabCache(prev => ({ ...prev, [activeSubTab]: items }));
            } catch (err) {
                console.error(`Error fetching ${activeSubTab}:`, err);
                if (!isMounted) return;
                setSubTabData([]);
                setSubTabError(`Failed to load ${activeSubTab}`);
            } finally {
                if (isMounted) setIsLoadingSubTab(false);
            }
        };

        loadTab();

        return () => {
            isMounted = false;
            if (activeSubTab !== "leaderboard" && esRef.current) {
                try { esRef.current.instance.close(); } catch { }
                esRef.current = null;
            }
        };
    }, [activeSubTab, resolvedPostId]);

    // Close SSE on unmount
    useEffect(() => {
        return () => {
            if (esRef.current) {
                try { esRef.current.instance.close(); } catch { }
                esRef.current = null;
            }
        };
    }, []);

    if (isLoadingPost) return (
        <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={load} alt="Loading post..." />
        </div>
    );

    if (!post) return <p>No post found</p>;

    // ---------- Render ----------
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
                    <hr style={{ borderRight: "none", height: "30px", borderLeft: "0.1rem solid #fff", borderTop: "none", borderBottom: "none", display: "flex", alignSelf: "center", justifySelf: "center" }} />
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

                <div key={post.id} id="useRx">
                    <Link to={`/profile/${post?.user.user_id}`} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <img className="fitt" src={post?.user?.thumbnail?.url ? `https://api.votecity.ng${post?.user?.thumbnail?.url}` : alt} alt="" style={{ height: "45px", width: "45px", objectFit: "cover", borderRadius: "100px" }} />
                        <div id="pst">
                            <p className="frTo" style={{ display: "flex", alignItems: "center" }}>
                                Posted by &nbsp;<span style={{ fontWeight: "bold" }}>{post.user?.fullname}</span>
                                {post.user?.id_verified === 1 && <img src={verified} alt="Verified" style={{ height: "15px", paddingLeft: "4px" }} />}
                            </p>
                            <p className="timee" style={{ color: "#ffffffb4" }}>@{post.user?.username}</p>
                        </div>
                    </Link>
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

                <div style={{ display: "flex", justifyContent: "center", gap: "10px", paddingBottom: "15px", marginBottom: "15px", borderBottom: "1px solid #fff" }}>
                    {subTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize: "0.9rem",
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
                <div id="constAll" style={{ textAlign: "center", color: "#fff", marginTop: "10px" }}>
                    {isLoadingSubTab ? (
                        <>
                            <div style={{ gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
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
                            <div style={{ gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
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
                            <div style={{ gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
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
                            <div style={{ gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
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
                        </>
                    ) : activeSubTab === "comments" ? (
                        subTabData.length === 0 || subTabData.every(c => !c.comment) ? (
                            <p>No comment found</p>
                        ) : (
                            subTabData.map(c => (
                                <div key={c.id} style={{ gap: "15px", borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "start", textAlign: "left", padding: "10px 20px" }}>
                                    <div style={{ display: "flex" }}>
                                        <img className="fitt" src={c.user?.thumbnail?.url ? `https://api.votecity.ng${c.user?.thumbnail.url}` : alt} /*alt={c.title}*/ style={{ width: "40px", height: "40px", borderRadius: "100px", marginTop: "5px" }} />
                                    </div>
                                    <div>
                                        <p style={{ display: "flex", flexDirection: "column" }}>
                                            {/* <span style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}> */}
                                            {/* {c.user?.fullname || "Anonymous"} */}
                                            {/* {c.user?.id_verified === 1 && <img src={verified} alt="Verified" style={{ height: "15px", paddingLeft: "4px" }} />} */}
                                            {/* </span> */}
                                            <span id="sk" key={c.id} style={{ color: "#fff", fontSize: "0.9rem" }}>
                                                <Link to={`/profile/${c?.user.user_id}`} style={{ display: "flex", gap: "5px", alignItems: "center" }}>

                                                    {c.user?.fullname ? `@${c.user.fullname}` : ""}
                                                </Link>
                                            </span>
                                            <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                                                {new Date(c.created_time).toLocaleDateString()} • {timeAgo(c.created_time)}
                                            </p>
                                        </p>
                                        <p style={{ paddingTop: "5px", textTransform: "capitalize", fontSize: "0.9rem" }}>"{c.comment}"</p>
                                    </div>
                                </div>
                            ))
                        )
                    ) : activeSubTab === "tickets" ? (
                        subTabData.length === 0 ? <p>No ticket found</p> :
                            subTabData.map(t => (
                                <div key={t.id} style={{ marginBottom: "10px", textAlign: "left", display: "flex", justifyContent: "space-between", padding: "15px 20px", background: "rgba(0, 0, 0, 0.24)", border: "1px solid rgba(255, 255, 255, 0.133)", borderRadius: "10px" }}>
                                    <div>
                                        <p style={{ fontWeight: "bold" }}>{t.title}</p>
                                        <p style={{ color: "rgb(192, 192, 197)" }}>{t.description}</p>
                                    </div>
                                    <div>
                                        <p>₦{t.price}</p>
                                    </div>
                                </div>
                            ))
                    ) : activeSubTab === "donations" ? (
                        subTabData.length === 0 ? <p>No donation found</p> :
                            subTabData.map(d => (
                                <div key={d.id} style={{ background: "rgba(0, 0, 0, 0.24)", border: "1px solid rgba(255, 255, 255, 0.133)", padding: "10px 10px", marginBottom: "10px", gap: "10px", display: "flex", flexDirection: "column", textAlign: "left", borderRadius: "10px" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <img className="fitt" src={d.user?.thumbnail?.url ? `https://api.votecity.ng${d.user?.thumbnail?.url}` : alt} style={{ width: "40px", height: "40px", borderRadius: "100px", marginTop: "5px" }} />
                                        <div >
                                            <p style={{ fontSize: "0.9rem" }}>{d.user?.fullname || "Anonymous"}</p>
                                            <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.706)" }}>@{d.user?.username}</p>
                                        </div>
                                    </div>
                                    <hr style={{ width: "100%", borderBottom: "1px solid rgba(255, 255, 255, 0.133)", borderTop: "0", borderLeft: "0", borderRight: "0" }} />
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <p style={{ display: "flex", flexDirection: "column", fontWeight: "bold", fontSize: "0.9rem" }}>Paid on: <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>{formatDonationDate(d.created_time)}</span></p>

                                        </div>
                                        <div>
                                            <p style={{ display: "flex", flexDirection: "column", fontWeight: "bold", fontSize: "0.9rem" }}>Amount <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>₦{d.amount}</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : activeSubTab === "contestants" ? (
                        <>
                            {/* Search Bar */}
                            <div style={{ marginBottom: "15px", textAlign: "center" }}>
                                <input
                                    type="text"
                                    placeholder="Search for contestants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: "15px 15px",
                                        borderRadius: "10px",
                                        border: "1px solid #ffffff22",
                                        background: " rgba(0, 0, 0, 0.447)",
                                        color: "#fff",
                                        fontSize: "0.9rem",
                                        width: "100%",
                                        maxWidth: "400px",
                                    }}
                                />
                            </div>

                            {/* Filtered contestants */}
                            {subTabData.length === 0 ? <p>No contestant found</p> :
                                subTabData
                                    .filter(c => (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                                        <div key={c.id} style={{ gap: "10px", borderRadius: "10px", border: "1px solid #ffffff22", padding: "15px 20px", background: "#0000003d", marginBottom: "10px", textAlign: "left", display: "flex", justifyContent: "start", alignItems: "center" }}>
                                            <div>
                                                <img className="fitt" src={c.thumbnail?.url ? `https://api.votecity.ng${c.thumbnail.url}` : alt} style={{ width: "40px", height: "40px", borderRadius: "100px", marginTop: "5px" }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{c.title}</p>
                                                <p id="desci" style={{ fontSize: "0.85rem" }}>{c.description}</p>
                                            </div>
                                        </div>
                                    ))
                            }
                        </>
                    ) : activeSubTab === "leaderboard" ? (
                        <>
                            {isLoadingSubTab ? (
                                <p>Loading leaderboard...</p>
                            ) : leaderboardData.length === 0 ? (
                                <p></p>
                            )
                                : (
                                    leaderboardData.map((c) => {
                                        const movedUp = c.prevRank !== undefined && c.rank < c.prevRank;
                                        const movedDown = c.prevRank !== undefined && c.rank > c.prevRank;

                                        return (
                                            <div key={c.id} style={{
                                                position: "relative",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "5px 15px",
                                                background: "#0000003d",
                                                border: "1px solid #ffffff22",
                                                borderRadius: "10px",
                                                marginTop: "20px",
                                                marginBottom: "20px"
                                            }}>
                                                {/* Hanging Rank Badge */}
                                                <div style={{
                                                    position: "absolute",
                                                    top: "-10px",
                                                    right: "15px",
                                                    background: "#fff",
                                                    color: "#000",
                                                    width: "25px",
                                                    height: "25px",
                                                    borderTopRightRadius: "30%",
                                                    borderBottomLeftRadius: "30%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold",
                                                    fontSize: "0.9rem",
                                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                                }}>
                                                    {c.rank}
                                                </div>

                                                <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px", justifyContent: "space-between" }}>
                                                    <div>
                                                        <img className="fitt"
                                                            src={c.thumbnail?.url ? `https://api.votecity.ng${c.thumbnail.url}` : alt}
                                                            // alt={c.title}
                                                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                                        />
                                                    </div>


                                                    <div style={{ width: "85%", display: "flex", flexDirection: "column", alignItems: "start" }}>
                                                        <span style={{ fontWeight: "bold", textAlign: "start", fontSize: "0.85rem" }}>{c.title}</span>
                                                        <span style={{ color: " rgb(192, 192, 197)" }}>{c.total_votes} votes</span>
                                                    </div>
                                                </div>
                                            </div>

                                        );
                                    })
                                )}
                        </>
                    ) : (
                        <p>No {activeSubTab} found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Event;

