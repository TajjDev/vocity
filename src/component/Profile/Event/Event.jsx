import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import load from '/src/assets/image/load.png';
import view from '/src/assets/image/view.png';
import participant from '/src/assets/image/participant.png';
import comment from '/src/assets/image/comment.png';
import saved from '/src/assets/image/saves.png';
import alt from '/src/assets/image/alt.jpg';
import event from '/src/assets/image/eventMenu.png';
import verified from '/src/assets/image/verified.png';

import "./event.css"
import EventCountdown from "./EventCountdown";
const Event = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedPostId, setResolvedPostId] = useState(null); // ✅ store the true post_id here
    const [error, setError] = useState("");

    const BASE_URL_POST = "https://api.votecity.ng/v1/post";

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // go to previous page
    };

// Utility function
const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
    useEffect(() => {
        if (!postId) return; // Safety: don't fetch without ID

        setIsLoading(true);
        setError("");

        fetch(`${BASE_URL_POST}/${postId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const postData = data?.data?.post || null;
                setPost(postData);
                console.log(data);
                // ✅ This is the "React correct" version of: postId = post.post_id
                if (postData?.post_id) {
                    setResolvedPostId(postData.post_id);
                }
            })
            .catch((err) => {
                console.error("Fetch post error:", err);
                setError("Failed to load post");
            })
            .finally(() => setIsLoading(false));
    }, [postId]);
    const timeOnly = new Date(post?.datetime_start)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        .replace(' ', '')
    //   .toLowerCase();

    
    console.log(timeOnly);
    // 🌀 Loading state

    // ⚠️ Error or missing post
    if (isLoading) return <div style={{
        width: "100%", height: "100vh", display: "flex", alignItems:
            "center", justifyContent: "center"
    }} > <img src={load} alt="" /></div>;
    if (!post) return <p>No post found</p>;

    // ✅ You can now use resolvedPostId anywhere you would have used postId = post.post_id
    console.log("Resolved Post ID:", resolvedPostId);

    return (
        <div className="post">
            <div id="Op">
                <div id="ev">
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                        <button id="bm"
                            onClick={handleGoBack}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                            }}
                        >
                            {/* SVG Back Arrow */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                style={{ width: "24px", height: "24px", marginRight: "8px" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <span style={{ fontSize: "1rem" }}>Back</span>
                        </button>
                    </div>

                </div>
                <div id="imOp" className="image-wrapper">
                    <img
                        className="thUrl"
                        src={`https://api.votecity.ng${post.thumbnail?.url}`}
                        alt={post.title}
                    />

                    <div className="date-badge">
                        <p className="day">{new Date(post.datetime_start).getDate()}</p>
                        <p className="month">
                            {new Date(post.datetime_start)
                                .toLocaleString("en-US", { month: "short" })
                                .toUpperCase()}
                        </p>
                    </div>

                    <div className="type-badge">
                        {post.post_type}
                    </div>
                </div>
                <div id="tit">
                    <div style={{width:"45%", display:"flex",flexDirection:"column", justifyContent:"space-between"}} id="from">
                        <p style={{fontSize:"0.9rem"}}>From</p>
                        <p className="timee">{formatDateTime(post.datetime_start)}</p>
                    </div>
                    <hr style={{borderRight:"none",height:"30px",borderLeft:"0.1rem solid #fff", borderTop:"none", borderBottom:"none", display:"flex", alignSelf:"center",justifySelf:"center"}} />
                    <div style={{width:"45%",flexDirection:"column", display:"flex",alignItems:"end", justifyContent:"space-between"}} id="to">
                        <p style={{fontSize:"0.9rem"}}>To</p>
                        <p className="timee">{formatDateTime(post.datetime_end)}</p>
                    </div>
                </div>
                <div className="post-title">
                    <p style={{ textTransform: "uppercase", fontSize:"0.8rem"}} id='short'>{post.title || post.text || "Untitled post"}</p>
                    <div className="views">
                        <p><img src={comment} alt="" />{post.comments_count}</p>
                        <p><img src={participant} alt="" />{post.participants_count}</p>
                        <p><img src={saved} alt="" />{post.saves_count}</p>
                        <p><img src={view} alt="" />{post.view_count}</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }} id="useRx">
                    <img style={{ height: "55px", objectFit: "cover", objectPosition: "center", borderRadius: "100px", width: "55px" }} src={post?.user?.thumbnail?.url ? `https://api.votecity.ng${post?.user?.thumbnail?.url}` : alt} alt="" />
                    <div id="pst">
                        <p style={{ display: "flex" }}>Posted by&nbsp;<span style={{ fontWeight: "bold" }}> {post.user?.fullname}</span> {post.user?.id_verified === 1 && (
                            <img
                                style={{
                                    height: "15px",
                                    paddingLeft: "4px",
                                    display: "flex",
                                    alignSelf: "center",
                                }}
                                src={verified}
                                alt="Verified"
                            />
                        )}
                        </p>
                        <p style={{ color: "#ffffffb4" }}>@{post.user?.username}</p>
                    </div>
                </div>
                <div id="discb">
                    <p style={{ fontSize: "1.1rem" }}>Event Description</p>
                    <p style={{ color: "rgb(192, 192, 197)" }}>{post.description}</p>
                </div>
            </div>
            <div id="Tp">
                <div style={{ background: "#0000003d", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", padding: "20px" }} id="countd">
                    <p style={{ textAlign: "center", color: "#ffffffb4" }}> POLL START IN APPROXIMATELY:</p>
                    <EventCountdown startTime={post.datetime_start} />
                </div>
            </div>
        </div>
    );
};


export default Event;






