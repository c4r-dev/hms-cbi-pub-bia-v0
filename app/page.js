"use client"; // Required for client components

import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "../styles/globals.css"; // Ensure global styles are loaded

Chart.register(...registerables); // Register Chart.js modules

export default function Page() {
  const [sampleSize, setSampleSize] = useState(5);
  const [biasAmount, setBiasAmount] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const calculateProbability = (d, b, n, criticalValue) => {
    const iterations = 1000;
    let significantCount = 0;

    for (let i = 0; i < iterations; i++) {
      const sampleMean = d + b + Math.random() * Math.sqrt(1 / n);
      const tStatistic = sampleMean / (1 / Math.sqrt(n));

      if (tStatistic > criticalValue) {
        significantCount++;
      }
    }

    return significantCount / iterations;
  };

  const updateChart = () => {
    if (!chartInstanceRef.current) return;

    const effectSizes = Array.from({ length: 21 }, (_, i) => -1 + i * 0.1);
    const probabilities05 = effectSizes.map((d) =>
      calculateProbability(d, biasAmount, sampleSize, 1.645)
    );
    const probabilities01 = effectSizes.map((d) =>
      calculateProbability(d, biasAmount, sampleSize, 2.33)
    );
    const probabilities001 = effectSizes.map((d) =>
      calculateProbability(d, biasAmount, sampleSize, 3.09)
    );

    chartInstanceRef.current.data.labels = effectSizes;
    chartInstanceRef.current.data.datasets[0].data = probabilities05;
    chartInstanceRef.current.data.datasets[1].data = probabilities01;
    chartInstanceRef.current.data.datasets[2].data = probabilities001;
    chartInstanceRef.current.update();
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "p < 0.05",
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "p < 0.01",
            data: [],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "p < 0.001",
            data: [],
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows custom sizing
        plugins: {
          title: {
            display: true,
            text: "Probability of Statistical Significance",
            font: { size: 16, weight: "bold" },
            padding: { top: 10, bottom: 10 },
          },
          legend: { display: true },
        },
        scales: {
          x: {
            title: { display: true, text: "True Effect Size (d)" },
          },
          y: {
            title: { display: true, text: "Probability" },
            min: 0,
            max: 1,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    updateChart();
  }, [biasAmount, sampleSize]);

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
        By adjusting the amount of bias and the sample size, students will
        explore how these factors distort the relationship between true effect
        size and the probability of statistical significance.
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

      {/* Chart Container */}
      <div className="chartContainer">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
