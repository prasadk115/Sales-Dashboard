import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title: "Revenue Studio | Sales analytics", description: "A sales management and analytics dashboard." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip" href="#main-content">Skip to content</a>{children}</body></html>}
