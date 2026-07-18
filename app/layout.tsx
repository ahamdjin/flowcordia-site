import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://flowcordia.com"),
  title: {
    default: "Flowcordia — Build visually. Govern as code.",
    template: "%s — Flowcordia",
  },
  description:
    "A Git-native workflow platform where visual builders and developers collaborate on the same reviewed workflow.",
  openGraph: {
    title: "Flowcordia — Build visually. Govern as code.",
    description:
      "Canvas, typed code, Git review, preview deployment, and runtime execution connected to one workflow identity.",
    type: "website",
    url: "https://flowcordia.com",
    siteName: "Flowcordia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowcordia — Build visually. Govern as code.",
    description:
      "Canvas, typed code, Git review, preview deployment, and runtime execution connected to one workflow identity.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem("flowcordia-theme");var dark=saved?saved==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=dark?"dark":"light"}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
