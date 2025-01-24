import "../styles/globals.css"; // Ensure global styles are loaded

export default function Home() {
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
    </div>
  );
}
