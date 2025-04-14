"use client";

import { useState, useEffect, useRef } from "react";
import jStat from "jstat";
import { Chart, registerables } from "chart.js";

// 1. Import the annotation plugin
import annotationPlugin from 'chartjs-plugin-annotation';
// 2. Register the annotation plugin along with other registerables
Chart.register(...registerables, annotationPlugin);

function calculateNoncentralTCDF(x, df, ncp) {
  // When the ncp is very small, it's close to central t-distribution
  if (Math.abs(ncp) < 1e-10) {
    return jStat.studentt.cdf(x, df);
  }

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

    // Compute power (one-sided test)
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
    chartInstanceRef.current.update();
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [], // Will be populated by updateChart
        datasets: [
          {
            label: "Unbiased",
            data: [], // Will be populated by updateChart
            borderColor: "#00C802",
            borderWidth: 6, // Changed from 2 to 6
            fill: false,
            pointRadius: 0, // Hide points for cleaner line
            tension: 0.1 // Slight tension for smoother curves
          },
          {
            label: "Biased",
            data: [], // Will be populated by updateChart
            borderColor: "#FF5A00",
            borderWidth: 6, // Changed from 2 to 6
            fill: false,
            pointRadius: 0, // Hide points for cleaner line
            tension: 0.1 // Slight tension for smoother curves
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          // 3. Configure the annotation plugin
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                xScaleID: 'x', // Use the ID of your x-axis scale
                xMin: 0,       // Start x value
                xMax: 0,       // End x value (same as xMin for vertical line)
                borderColor: 'black', // Line color
                borderWidth: 3,      // Changed from 1 to 3
              }
            }
          }
        },
        scales: {
          x: {
            // Make sure this ID matches xScaleID in annotation
            // The default ID is 'x', so this should work unless changed
            type: 'linear', // Ensure x-axis is treated as linear for positioning
            title: { display: true, text: "True Effect Size (d)" },
            min: -2, // Set explicit min/max if needed for annotation positioning
            max: 2,
            ticks: {
              stepSize: 0.5 // Adjust stepSize for desired tick marks
            }
          },
          y: {
            title: { display: true, text: "Probability of Detecting an Effect" },
            min: 0,
            max: 1,
          },
        },
        // Optional: improve performance for large datasets
        // animation: false,
        // parsing: false,
      },
    });

    // Initial chart update
    updateChart();

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, []); // Rerun effect only on mount/unmount

  // Update chart only when relevant state changes
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
      <div className="sliderContainer biasSliderContainer">
        <label htmlFor="biasAmountSlider" className="sliderLabel">
          Bias Amount: <strong>{biasAmount.toFixed(2)}</strong>
        </label>
        <div className="sliderWrapper">
          <span className="sliderMin">0</span>
          <div className="sliderInputWrapper">
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
            <div className="sliderTicks">
              <div className="tick" style={{ left: "28%" }}>
                <span className="tickLabel">0.28</span>
              </div>
              <div className="tick" style={{ left: "91%" }}>
                <span className="tickLabel">0.91</span>
              </div>
              <div
                className="tickRangeLabel"
              >
                Estimated Range if you Fail to Mask
              </div>
            </div>
          </div>
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