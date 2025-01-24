"use client"; // Required for client components

import { useState } from "react";
import "../styles/globals.css"; // Ensure global styles are loaded

export default function Home() {
  const [effectSize, setEffectSize] = useState(0); // State for the slider

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <img src="/favicon.ico" alt="Favicon" className="favicon" />
        <h1 className="title">
          Understanding the Impact of Bias in Assessment on Published Results
        </h1>
      </div>

      {/* Centered Title */}
      <h2 className="centeredTitle">
        By adjusting the amount of bias and the sample size, students will explore how these factors distort the relationship between true effect size and the probability of statistical significance.
      </h2>

      {/* Slider Section */}
      <div className="sliderContainer">
        <label htmlFor="effectSizeSlider" className="sliderLabel">
          Effect Size with Bias: <strong>{effectSize.toFixed(2)}</strong>
        </label>
        <div className="sliderWrapper">
          <span className="sliderMin">-3</span>
          <input
            type="range"
            id="effectSizeSlider"
            min="-3"
            max="3"
            step="0.1"
            value={effectSize}
            onChange={(e) => setEffectSize(parseFloat(e.target.value))}
            className="slider"
          />
          <span className="sliderMax">3</span>
        </div>
      </div>
    </div>
  );
}
