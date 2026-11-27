import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Detection - Me or Not",
  description: "Upload an image to detect if it's you using Ultralytics model",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}