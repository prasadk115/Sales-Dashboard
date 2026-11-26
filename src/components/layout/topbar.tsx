import { Bell, Search } from "lucide-react";
import { AccountMenu } from "@/components/auth/account-menu";
export function Topbar({ email }: { email: string }) { return <header className="topbar"><label className="search"><Search size={17}/><input aria-label="Search" placeholder="Search anything..." /></label><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={18}/></button><AccountMenu email={email}/></div></header> }
