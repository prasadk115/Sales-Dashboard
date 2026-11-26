import { ArrowUpRight, Banknote, ShoppingBag, Target, UsersRound } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { Kpi } from "@/types/dashboard";
const icons = [Banknote, ShoppingBag, Target, UsersRound];
export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) { const Icon = icons[index]; const value = kpi.kind === "currency" ? formatCurrency(kpi.value) : kpi.kind === "percent" ? `${kpi.value.toFixed(1)}%` : kpi.value.toLocaleString("en-IN"); return <article className="card kpi"><div className="kpi-head"><span>{kpi.label}</span><span className="kpi-icon"><Icon size={16}/></span></div><div className="kpi-value">{value}</div><div>{kpi.change ? <span className="change"><ArrowUpRight size={13} strokeWidth={2.5}/> {kpi.change}%</span> : null}<span className="comparison">{kpi.comparison}</span></div></article> }
