import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import { SplashProvider } from "../contexts/SplashContext";
import GlobalSplashScreen from "../components/GlobalSplashScreen";
import HideDevIndicator from "../components/HideDevIndicator";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          /* Nuclear option: Hide ALL fixed position elements except necessary ones */
          body > *[style*="position: fixed"]:not(#__next):not([role="dialog"]):not([role="alert"]) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Hide badge widgets */
          [class*="badge"][style*="fixed"],
          [id*="badge"][style*="fixed"],
          [class*="widget"][style*="fixed"],
          [id*="widget"][style*="fixed"] {
            display: none !important;
          }
          
          /* Hide Next.js dev tools indicator - all possible selectors */
          button#next-logo,
          button[id*="next-logo"],
          #devtools-indicator,
          [id*="devtools-indicator"],
          .nextjs-toast,
          [class*="nextjs-toast"],
          [class*="nextjs-portal"],
          nextjs-portal {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          /* Hide the SVG inside Next.js logo */
          button#next-logo svg,
          button[id*="next"] svg[viewBox="0 0 40 40"] {
            display: none !important;
          }
        `}</style>
      </head>
      <body>
        <HideDevIndicator />
        <SplashProvider>
          <GlobalSplashScreen />
          <Providers>{children}</Providers>
        </SplashProvider>
      </body>
    </html>
  );
}

