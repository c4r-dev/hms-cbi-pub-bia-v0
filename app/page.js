"use client";

import { useState, useEffect, useRef } from "react";
import jStat from "jstat";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function calculateNoncentralTCDF(x, df, ncp) {
  // When the ncp is very small, it's close to central t-distribution
  if (Math.abs(ncp) < 1e-10) {
    return jStat.studentt.cdf(x, df);
  }

  // Approximation for non-central t-distribution
  // This uses a normal approximation which is reasonable for df > 10
  // For smaller df, this is a rough approximation

  const z = (x - ncp) / Math.sqrt(1 + (x * x) / (2 * df));
  return jStat.normal.cdf(z, 0, 1);
}

export default function Page() {
  const [sampleSize, setSampleSize] = useState(5);
  const [biasAmount, setBiasAmount] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const calculateProbability = (d, b, n, alpha = 0.05) => {
    d = d + b;

    // Critical t-value for the given alpha (one-sided test)
    const tCritical = jStat.studentt.inv(1 - alpha, n - 1);


    // Non-centrality parameter
    const ncp = d * Math.sqrt(n);

    // Compute power (two-sided test)
    const powerLower = calculateNoncentralTCDF(-tCritical, n - 1, ncp);
    const powerUpper = 1 - calculateNoncentralTCDF(tCritical, n - 1, ncp);

    return powerUpper;
  }

  const updateChart = () => {
    if (!chartInstanceRef.current) return;

    const effectSizes = Array.from({ length: 401 }, (_, i) => -2 + i * 0.01);

    const probabilities05 = effectSizes.map((d) =>
      calculateProbability(d, 0, sampleSize)
    );
    const probabilities01 = effectSizes.map((d) =>
      calculateProbability(d, biasAmount, sampleSize)
    );

    chartInstanceRef.current.data.labels = effectSizes;
    chartInstanceRef.current.data.datasets[0].data = probabilities05;
    chartInstanceRef.current.data.datasets[1].data = probabilities01;
    // chartInstanceRef.current.data.datasets[2].data = probabilities001;
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
            label: "Unbiased",
            data: [],
            borderColor: "#00C802",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Biased",
            data: [],
            borderColor: "#FF5A00",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // title: {
          //   display: true,
          //   text: "Probability of Statistical Significance",
          //   font: { size: 16, weight: "bold" },
          //   padding: { top: 10, bottom: 10 },
          // },
          legend: { display: true },
        },
        scales: {
          x: {
            title: { display: true, text: "True Effect Size (d)" },
            ticks: {
              // callback: function(value, index, values) {
              callback: function (index) {
                // Display ticks for -1, -0.5, 0, 0.5, 1
                const tickValue = -1 + index * 0.1; // Calculate the actual value based on index
                if ([-1, -0.5, 0, 0.5, 1].includes(parseFloat(tickValue.toFixed(1)))) {
                  return tickValue.toFixed(1);
                }
                return ''; // Return empty string for other ticks
              },
              stepSize: 0.1, // Ensure all potential ticks are considered
              autoSkip: false // Prevent automatic skipping of labels
            }
          },
          y: {
            title: { display: true, text: "Probability of Detecting an Effect" },
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
        {/* Changed onClick handler */}
        <button onClick={() => window.location.reload()} className="favicon-button">
          <img src="/favicon.ico" alt="Favicon" className="favicon" />
        </button>
        <h1 className="title">
          Explore the impact of bias.
        </h1>
      </div>

      {/* Centered Title */}
      <h2 className="centeredTitle">
        Explore how sample size and bias influence discovery of effects.
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
            max="100"
            step="1"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
          <span className="sliderMax">100</span>
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