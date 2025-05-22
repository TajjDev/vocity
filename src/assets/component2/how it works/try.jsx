import React, { useState, useEffect } from "react";
import imageone from "/src/assets/imageone.png"
import imagetwo from "/src/assets/imagetwo.png"
import imagethree from "/src/assets/imagethree.png"
import imagefour from "/src/assets/imagefour.png"
import imagefive from "/src/assets/imagefive.png"
import "./howitworks.css"

const AutoSwipeCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [images.length]);

    return (
    <div id="vi">
            <p id="men">Some InApp <span>Views</span></p>
            <div id="vid" style={styles.carouselContainer}>
                {/* Image Display */}
                {images.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.imageContainer,
                            display: index === currentIndex ? "block" : "none",
                        }}
                    >
                        <img id="images" src={image} alt={`Slide ${index + 1}`} style={styles.image} />
                    </div>
                ))}

                {/* Dots Navigation */}
                <div id="mine" style={styles.dotsContainer}>
  `     `                  {images.map((_, index) => (
                        <div id="mine"
                            key={index}
                            style={{
                                ...styles.dot,
                                backgroundColor: index === currentIndex ? "orange" : "white",
                            }}
                        ></div>
                    ))}
                </div>
            </div>
            </div>
            );
};

            const styles = {
                carouselContainer: {
                width: "100%",
            // Adjust to your preferred size
            overflow: "hidden",
            display:"flex",
            marginBottom:"60px",
            // justifySelf:"center",
            position: "relative",
 },

            imageContainer: {
                position: "absolute",
            top: 0,
            left: 0,
            width: "99%",
            height: "99.7%",
 },
            image: {
                width: "100%",
            height: "100%",
   // objectFit: "cover",
 },
 
            dotsContainer: {
                position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
  },
            dot: {
                width: "12px", // Size of the dots
            height: "12px",
            borderRadius: "50%",
            border: "3px solid white", // White border for styling
            backgroundColor: "white", // Default color
            transition: "background-color 0.3s ease", // Smooth transition
  },
};

            export default function Minee() {
  const images = [
    imageone,imagethree,imagefour,imagetwo,imagefive
            ];

            return (
            <div id="view">
                {/* <h1>Auto-Swiping Carousel</h1> */}
                <AutoSwipeCarousel images={images} />
            </div>
            );
}