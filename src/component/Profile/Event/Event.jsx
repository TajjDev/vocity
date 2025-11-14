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

    // Subtab state & cache
    const [subTabCache, setSubTabCache] = useState({}); // { comments: [...], tickets: [...], ... }
    const [subTabData, setSubTabData] = useState([]);
    const [isLoadingSubTab, setIsLoadingSubTab] = useState(false);
    const [subTabError, setSubTabError] = useState("");

    const [countdownPhase, setCountdownPhase] = useState("start"); // "start" | "end" | "ended"

    // Leaderboard-specific persistent state
    const [leaderboardLoaded, setLeaderboardLoaded] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]); // persistent UI state for leaderboard

    // Refs for SSE and previous ranks
    const esRef = useRef(null);
    const prevLeaderboardRef = useRef({}); // { [contestantId]: previousRank }

    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const options = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
        return new Intl.DateTimeFormat("en-US", options).format(date);
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
            .catch(err => {
                console.error("Fetch post error:", err);
            })
            .finally(() => setIsLoadingPost(false));
    }, [postId]);

    // ---------- COUNTDOWN PHASE ----------
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

        checkPhase();
        const interval = setInterval(checkPhase, 1000);
        return () => clearInterval(interval);
    }, [post]);

    // ---------- SUB-TABS (dynamic) ----------
    const subTabs = post?.post_type === "event"
        ? ["comments", "tickets"]
        : post?.post_type === "project"
            ? ["comments", "donations"]
            : post?.post_type === "poll"
                ? ["comments", "contestants", "leaderboard"]
                : ["comments"];

    // ---------- HELPER: fetch generic subtab endpoint ----------
    const fetchSubTabSnapshot = async (tab, id) => {
        // returns array or throws
        let url = "";
        switch (tab) {
            case "comments": url = `${BASE_URL_POST}/comment/${id}`; break;
            case "tickets": url = `${BASE_URL_POST}/create/ticket/${id}`; break;
            case "donations": url = `${BASE_URL_POST}/process/donation/${id}`; break;
            case "contestants": url = `${BASE_URL_POST}/create/contestant/${id}`; break;
case "leaderboard": url = `https://api.votecity.ng/v1/leaderboard/${id}`; break;            default: throw new Error("Unknown tab");
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Map to expected shapes per tab
        switch (tab) {
            case "comments": return data?.data?.comments || [];
            case "tickets": return data?.data?.tickets || [];
            case "donations": return data?.data?.donations || [];
            case "contestants": return data?.data?.contestants || [];
            case "leaderboard":
                return (
                    data?.data?.leaderboard ||
                    data?.data?.contestants ||
                    data?.leaderboard ||
                    data?.contestants ||
                    []
                );

            default: return [];
        }
    };

    // ---------- SUB-TAB EFFECT (fetch + caching + leaderboard SSE) ----------
    useEffect(() => {
        if (!resolvedPostId) return;

        let isMounted = true; // guard for setting state after unmount

        const loadTab = async () => {
            setSubTabError("");
            setIsLoadingSubTab(true);

            // If cached, use that immediately
            if (subTabCache[activeSubTab]) {
                setSubTabData(subTabCache[activeSubTab]);
                setIsLoadingSubTab(false);
                // For leaderboard, ensure leaderboardData syncs with cache
                if (activeSubTab === "leaderboard" && subTabCache.leaderboard) {
                    setLeaderboardData(subTabCache.leaderboard);
                    setLeaderboardLoaded(true);
                }
                return;
            }

            // Special handling for leaderboard: fetch initial snapshot and then set up SSE
            if (activeSubTab === "leaderboard") {
                try {
                    const raw = await fetchSubTabSnapshot("leaderboard", resolvedPostId);
                    // raw should be an array of contestants
                    // sort and assign rank, use prev ref if present
                    const prevRanks = { ...prevLeaderboardRef.current };

                    const ranked = raw
                        .slice()
                        .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                        .map((c, idx) => ({
                            ...c,
                            rank: idx + 1,
                            prevRank: prevRanks[c.id] ?? idx + 1
                        }));

                    // set persistent leaderboard state & cache
                    if (!isMounted) return;
                    setLeaderboardData(ranked);
                    setSubTabData(ranked);
                    setSubTabCache(prev => ({ ...prev, leaderboard: ranked }));
                    setLeaderboardLoaded(true);

                    // update prev ref AFTER updating state so arrows calculate against old values next time
                    ranked.forEach(c => {
                        prevLeaderboardRef.current[c.id] = c.rank;
                    });

                } catch (err) {
                    console.error("Initial leaderboard fetch error:", err);
                    if (!isMounted) return;
                    setLeaderboardData([]);
                    setSubTabData([]);
                    setSubTabCache(prev => ({ ...prev, leaderboard: [] }));
                } finally {
                    if (isMounted) setIsLoadingSubTab(false);
                }

                // SETUP SSE: open only if not already open for this post
                // If an EventSource exists for a prior post, close it first
                if (esRef.current && esRef.current.postId !== resolvedPostId) {
                    try { esRef.current.instance.close(); } catch (e) { /* ignore */ }
                    esRef.current = null;
                }

                if (!esRef.current) {
                    const es = new EventSource(`https://api.votecity.ng/v1/sse/leaderboard/${resolvedPostId}`);
                    // store wrapper so we can attach postId
                    esRef.current = { instance: es, postId: resolvedPostId };
                    es.addEventListener("leaderboard", (e) => {
                        try {
                            const payload = JSON.parse(e.data);
                            if (!Array.isArray(payload)) return;

                            // snapshot prev ranks
                            const prevRanks = { ...prevLeaderboardRef.current };

                            const ranked = payload
                                .slice()
                                .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                                .map((c, idx) => ({
                                    ...c,
                                    rank: idx + 1,
                                    prevRank: prevRanks[c.id] ?? idx + 1
                                }));

                            // Update UI state
                            setLeaderboardData(ranked);
                            setSubTabData(ranked);
                            setSubTabCache(prev => ({ ...prev, leaderboard: ranked }));

                            // After updating state, update previous ranks ref
                            ranked.forEach(c => {
                                prevLeaderboardRef.current[c.id] = c.rank;
                            });
                        } catch (err) {
                            console.error("Error parsing SSE data:", err);
                        }
                    });

                    es.onerror = (err) => {
                        console.error("Leaderboard SSE error:", err);
                        try { es.close(); } catch (e) { /* ignore */ }
                        esRef.current = null;
                    };
                }

                return;
            }

            // non-leaderboard tabs
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
            // When leaving leaderboard tab, close SSE (to avoid multiple live connections).
            // We keep prevLeaderboardRef so when user returns arrows compare correctly.
            if (activeSubTab !== "leaderboard" && esRef.current) {
                try { esRef.current.instance.close(); } catch (e) { /* ignore */ }
                esRef.current = null;
            }
        };
    }, [activeSubTab, resolvedPostId]); // intentionally not including subTabCache (we read it inside)

    // Close SSE on unmount
    useEffect(() => {
        return () => {
            if (esRef.current) {
                try { esRef.current.instance.close(); } catch (e) { /* ignore */ }
                esRef.current = null;
            }
        };
    }, []);

    // UI guards
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

                <div style={{ display: "flex", gap: "5px", alignItems: "center" }} id="useRx">
                    <img className="fitt" src={post?.user?.thumbnail?.url ? `https://api.votecity.ng${post?.user?.thumbnail?.url}` : alt} alt="" style={{ height: "45px", width: "45px", objectFit: "cover", borderRadius: "100px" }} />
                    <div id="pst">
                        <p className="frTo" style={{ display: "flex", alignItems: "center" }}>
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

                <div style={{ display: "flex", justifyContent: "center", gap: "10px", paddingBottom: "10px", marginBottom: "15px", borderBottom: "1px solid #fff" }}>
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
                        <p>Loading {activeSubTab}...</p>
                    ) : activeSubTab === "comments" ? (
                        subTabData.length === 0 || subTabData.every(c => !c.comment) ? (
                            <p>No comment found</p>
                        ) : (
                            subTabData.map(c => (
                                <div key={c.id} style={{ borderRadius: "10px", border: "1px solid #ffffff22", background: "#0000003d", marginBottom: "10px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "left", padding: "15px 20px" }}>
                                    <div style={{ width: "20%", display: "flex", alignItems: "center" }}>
                                        <img className="fitt" src={c.user?.thumbnail?.url ? `https://api.votecity.ng${c.user?.thumbnail.url}` : alt} alt={c.title} style={{ width: "50px", height: "50px", borderRadius: "100px", marginTop: "5px" }} />
                                    </div>
                                    <div style={{ width: "80%" }}>
                                        <p style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                                {c.user?.fullname || "Anonymous"}
                                                {c.user?.id_verified === 1 && <img src={verified} alt="Verified" style={{ height: "15px", paddingLeft: "4px" }} />}
                                            </span>
                                            <span style={{ color: "rgba(255, 255, 255, 0.706)" }}>
                                                {c.user?.username ? `@${c.user.username}` : ""}
                                            </span>
                                        </p>
                                        <p style={{ paddingTop: "5px" }}>{c.comment}</p>
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
                                <div key={d.id} style={{ marginBottom: "10px", textAlign: "left" }}>
                                    <p>{d.user_name || "Anonymous"} donated {d.amount}</p>
                                </div>
                            ))
                    ) : activeSubTab === "contestants" ? (
                        subTabData.length === 0 ? <p>No contestant found</p> :
                            subTabData.map(c => (
                                <div key={c.id} style={{ borderRadius: "10px", border: "1px solid #ffffff22", padding: "15px 20px", background: "#0000003d", marginBottom: "10px", textAlign: "left", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <div style={{ width: "20%" }}>
                                        <img className="fitt" src={c.thumbnail?.url ? `https://api.votecity.ng${c.thumbnail.url}` : alt} alt={c.title} style={{ width: "50px", height: "50px", borderRadius: "100px", marginTop: "5px" }} />
                                    </div>
                                    <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{c.title}</p>
                                        <p style={{ fontSize: "0.85rem" }}>{c.description}</p>
                                    </div>
                                </div>
                            ))
                    ) : activeSubTab === "leaderboard" ? (
                        <>
                            {isLoadingSubTab ? (
                                <p>Loading leaderboard...</p>
                            ) :
                                leaderboardData.length === 0 ? (
                                    <p>No leaderboard data found</p>
                                )

                                    : (
                                        leaderboardData.map((c) => {
                                            const movedUp = c.prevRank !== undefined && c.rank < c.prevRank;
                                            const movedDown = c.prevRank !== undefined && c.rank > c.prevRank;


                                            return (
                                                <div key={c.id} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "10px 15px",
                                                    background: "#0000003d",
                                                    border: "1px solid #ffffff22",
                                                    borderRadius: "10px",
                                                    marginBottom: "10px"
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <span style={{ fontWeight: "bold", width: "25px" }}>{c.rank}</span>
                                                        <img className="fitt"
                                                            src={c.thumbnail?.url ? `https://api.votecity.ng${c.thumbnail.url}` : alt}
                                                            alt={c.title}
                                                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                                        />
                                                        <span style={{ fontWeight: "bold" }}>{c.title}</span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <span>{c.total_votes} votes</span>
                                                        {movedUp && <span style={{ color: "limegreen", fontWeight: "bold" }}>⬆</span>}
                                                        {movedDown && <span style={{ color: "red", fontWeight: "bold" }}>⬇</span>}
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
