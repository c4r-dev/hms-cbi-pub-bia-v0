import styles from "../styles/globals.css";

export default function Home() {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <img
          src="/favicon.ico"
          alt="Favicon"
          className="favicon"
        />
        <h1 className="title">Help researchers navigate a path to masking their study</h1>
      </div>

      {/* Centered Title */}
      <h2 className="centeredTitle">Select a team to help</h2>
    </div>
  );
}
