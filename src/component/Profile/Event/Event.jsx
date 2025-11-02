import React, { useState, useEffect } from "react";
import load from '/src/assets/image/load.png';
import alt from '/src/assets/image/alt.jpg';
import event from '/src/assets/image/eventMenu.png';
import verified from '/src/assets/image/verified.png';

import "./event.css"
const Event = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedPostId, setResolvedPostId] = useState(null); // ✅ store the true post_id here
    const [error, setError] = useState("");

    const BASE_URL_POST = "https://api.votecity.ng/v1/post";

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
                    <img src={event} alt="" />
                    <p id="OpP">Event</p>
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
                            <p style={{ color: "#ffffffb4" }}>Starting time: {new Date(post.datetime_start)
                                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                .replace(' ', '')
                                .toLowerCase()}
                            </p>
                            <p style={{ fontSize: "1rem" }}>{post.title}</p>
                        </div>
                        <div style={{display:"flex",gap:"5px", alignItems:"center"}} id="useRx">
                            <img style={{ height: "45px", objectFit: "cover", objectPosition: "center", borderRadius: "100px", width: "45px" }} src={ post?.user?.thumbnail?.url ? `https://api.votecity.ng${post?.user?.thumbnail?.url}`: alt} alt="" />
                            <div  id="pst">
                                <p style={{display:"flex"}}>Posted by&nbsp;<span style={{ fontWeight: "bold" }}> {post.user?.fullname}</span> {post.user?.id_verified === 1 && (
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
                                )}</p>
                                <p style={{color: "#ffffffb4"}}>@{post.user?.username}</p>
                            </div>
                        </div>
            </div>
            <div id="Tp"></div>
        </div>
    );
};

export default Event;