/*
- Wraps every page in the app
- Import global CSS here (e.g., globals.css)
- Add context providers, layouts, or logic shared across all pages
- Receives Component (the active page) and pageProps (props for that page)
- Essential for global styles and shared logic
*/

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
