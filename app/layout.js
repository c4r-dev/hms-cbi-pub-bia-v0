import "./globals.css";

export const metadata = {
  title: "Assessment Bias",
  description: "Explore the impact of bias.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
