import { MobileNavigation } from "@/components/layout/mobile-navigation"; import { Sidebar } from "@/components/layout/sidebar"; import { Topbar } from "@/components/layout/topbar";
export default function DashboardLayout({children}:{children:React.ReactNode}){ return <div className="shell"><Sidebar/><div className="page-area"><Topbar/>{children}</div><MobileNavigation/></div> }
