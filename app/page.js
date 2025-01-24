"use client"; // Required for client components

import { useState, useEffect } from "react";
import "../styles/globals.css"; // Ensure global styles are loaded
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// ✅ Register Chart.js components (Fix for the "point" error)
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Home() {
  const [effectSize, setEffectSize] = useState(0); // Mean (μ)
  const [sampleSize, setSampleSize] = useState(250); // Dynamic sample size
  const [biasAmount, setBiasAmount] = useState(0.5); // ✅ Default Bias Amount = 0.5
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    generateGaussianData();
  }, [effectSize, sampleSize, biasAmount]);

  function generateGaussianData() {
    let xValues = [];
    let yValues = [];

    const mean = effectSize;
    const stdDev = biasAmount;
    const minX = mean - 4 * stdDev; // Dynamically adjust range
    const maxX = mean + 4 * stdDev;
    const step = (maxX - minX) / sampleSize; // Adjust number of points dynamically

    for (let x = minX; x <= maxX; x += step) {
      const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      xValues.push(x.toFixed(2));
      yValues.push(y);
    }

    setChartData({
      labels: xValues,
      datasets: [
        {
          label: "Gaussian Distribution",
          data: yValues,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.4, // Smooth curve
          pointRadius: 0, // Hide points
        },
      ],
    });
  }

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

      {/* First Slider: Effect Size with Bias */}
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

      {/* Second Slider: Sample Size */}
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

      {/* Third Slider: Bias Amount (✅ Default Value = 0.5) */}
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

      {/* Gaussian Distribution Line Plot */}
      <div className="chartContainer">
        {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
      </div>
    </div>
  );
}
