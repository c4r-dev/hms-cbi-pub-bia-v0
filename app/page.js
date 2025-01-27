"use client"; // Required for client components

import { useState } from "react";
import "../styles/globals.css"; // Ensure global styles are loaded

export default function Page() {
  const [sampleSize, setSampleSize] = useState(5); // Default Sample Size = 5
  const [biasAmount, setBiasAmount] = useState(0); // Default Bias Amount = 0

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

      {/* Sample Size Slider */}
      <div className="sliderContainer">
        <label htmlFor="sampleSizeSlider" className="sliderLabel">
          Sample Size: <strong>{sampleSize}</strong>
        </label>
        <div className="sliderWrapper">
          <span className="sliderMin">5</span>
          <input
            type="range"
            id="sampleSizeSlider"
            min="5"
            max="500"
            step="5"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
          <span className="sliderMax">500</span>
        </div>
      </div>

      {/* Bias Amount Slider */}
      <div className="sliderContainer">
        <label htmlFor="biasAmountSlider" className="sliderLabel">
          Bias Amount: <strong>{biasAmount.toFixed(2)}</strong>
        </label>
        <div className="sliderWrapper">
          <span className="sliderMin">0</span>
          <input
            type="range"
            id="biasAmountSlider"
            min="0"
            max="1"
            step="0.01"
            value={biasAmount}
            onChange={(e) => setBiasAmount(parseFloat(e.target.value))}
            className="slider"
          />
          <span className="sliderMax">1</span>
        </div>
      </div>
    </div>
  );
}
