import React, { useEffect, useState } from "react";

const EventCountdown = ({ startTime }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(startTime) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div style={styles.container}>
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} style={styles.timeBox}>
          <div id="counttt" style={styles.value}>{String(value).padStart(2, "0")}</div>
          <div id="label" style={styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
};

// --- Inline Styles ---
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    // gap: "40px",
    padding:" 0 10px",
    marginTop: "15px",
  },
  timeBox: {
    display: "flex",
    border:"1px solid #fffff22",
    flexDirection: "column",
    alignItems: "center",
    background: "rgb(10, 14, 21)",
    color: "#fff",
    borderRadius: "10px",
    width: "60px",
    // padding: "10px 0",
  },
  value: {
    // fontSize: "23px",
    fontWeight: "600",
  },
  label: {
    textTransform: "uppercase",
    marginTop: "5px",
    display:"flex",

    // opacity: 0.8,
  },
};

export default EventCountdown;
