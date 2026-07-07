"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, TrendingUp, ShoppingBag, Receipt, Star, ArrowUpRight } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import type { PaymentRecord } from "@/types/discord";
import SectionHeader from "@/components/SectionHeader";
import { CHART_TOOLTIP_STYLE } from "@/lib/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function BillingSection() {
  const { analytics } = useDataStore();
  const billing = analytics?.billing;
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"all" | "7d" | "30d" | "1y">("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "fiat" | "orb">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "pending" | "failed" | "refunded">("all");

  const formatCurrency = (amount: number, currency: string = "usd") => {
    const isCrypto = currency.toLowerCase().includes("orb");
    if (isCrypto) return `${amount} ORB`;
    
    const zeroDecimal = ["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"];
    const isZero = zeroDecimal.includes(currency.toLowerCase());
    const val = isZero ? amount : amount / 100;
    
    try {
      return new Intl.NumberFormat(undefined, { 
        style: 'currency', 
        currency: currency.toUpperCase(),
        minimumFractionDigits: isZero ? 0 : 2
      }).format(val);
    } catch {
      return `${val.toFixed(isZero ? 0 : 2)} ${currency.toUpperCase()}`;
    }
  };

  // Apply Date and Currency Filters (Base)
  const basePayments = useMemo(() => {
    if (!billing?.payments) return [];
    
    let filtered = billing.payments;
    
    if (timeRange !== "all") {
      const now = new Date().getTime();
      const rangeMs = timeRange === "7d" ? 7 * 86400000 
                    : timeRange === "30d" ? 30 * 86400000 
                    : 365 * 86400000;
      filtered = filtered.filter((p: PaymentRecord) => (now - new Date(p.created_at).getTime()) <= rangeMs);
    }
    
    if (currencyFilter !== "all") {
      filtered = filtered.filter((p: PaymentRecord) => {
        const isOrb = (p.currency || "").toLowerCase().includes("orb");
        return currencyFilter === "orb" ? isOrb : !isOrb;
      });
    }
    
    return filtered;
  }, [billing, timeRange, currencyFilter]);

  // Apply Status Filter for the Transaction History List
  const listPayments = useMemo(() => {
    if (statusFilter === "all") return basePayments;
    
    return basePayments.filter((p: PaymentRecord) => {
      const isSuccess = p.status === 1 || p.status === 0; // 1 = Completed, 0 = Pending (merged into success for UI simplicity)
      const isRefunded = p.status === 3 || p.status === 4; // 3 = Refunded, 4 = Canceled
      const isFailed = p.status === 2; // 2 = Failed
      
      if (statusFilter === "success") return p.status === 1;
      if (statusFilter === "pending") return p.status === 0;
      if (statusFilter === "refunded") return isRefunded;
      if (statusFilter === "failed") return isFailed;
      return true;
    });
  }, [basePayments, statusFilter]);

  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    basePayments.forEach((p: PaymentRecord) => {
      // Exclude failed from graph
      if (p.status === 2) return;
      
      const date = new Date(p.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      const zeroDecimal = ["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"];
      const isZero = zeroDecimal.includes((p.currency || "usd").toLowerCase());
      const val = isZero ? p.amount : p.amount / 100;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += val;
    });

    return Object.entries(monthlyData).map(([name, total]) => ({
      name,
      total
    }));
  }, [basePayments]);

  const sortedPaymentsDesc = useMemo(() => {
    return [...listPayments].sort((a: PaymentRecord, b: PaymentRecord) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [listPayments]);

  const dynamicStats = useMemo(() => {
    const spentByCur: Record<string, number> = {};
    let orbSpent = 0;
    
    basePayments.forEach((p: PaymentRecord) => {
      // Only include successful/refunded transactions in totals (exclude failed)
      if (p.status === 2) return;
      
      const c = (p.currency || "usd").toLowerCase();
      if (c.includes("orb")) {
        orbSpent += (p.amount || 0);
      } else {
        spentByCur[c] = (spentByCur[c] || 0) + (p.amount || 0);
      }
    });
    
    const spentArr = Object.entries(spentByCur).filter(([, amt]) => amt > 0);
    const spentStr = spentArr.length > 0
      ? spentArr.map(([cur, amt]) => formatCurrency(amt, cur)).join(" + ")
      : formatCurrency(0, "usd");

    return {
      spentStr,
      orbSpent,
      count: basePayments.length,
      first: sortedPaymentsDesc.length > 0 ? sortedPaymentsDesc[sortedPaymentsDesc.length - 1].created_at : undefined,
      last: sortedPaymentsDesc.length > 0 ? sortedPaymentsDesc[0].created_at : undefined
    };
  }, [basePayments, sortedPaymentsDesc]);

  const formatDate = (d: string | undefined) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!billing || billing.payments.length === 0) {
    return (
      <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
        <SectionHeader title="Billing & Purchases" />
        <div className="premium-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-2xl bg-[#12151A] border border-[#252B34] flex items-center justify-center mb-6">
            <Receipt size={32} className="text-[#5E6976]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Financial Data</h3>
          <p className="text-[#9DA7B3] max-w-sm">We couldn&apos;t find any payment history or active subscriptions in this data export.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      <SectionHeader title="Billing & Purchases" />

        <div className="flex flex-row flex-wrap items-center gap-3">
          <div className="flex bg-[#12151A] rounded-lg p-1 border border-[#252B34]">
            {[
              { id: "all", label: "All Currencies" },
              { id: "fiat", label: "Money" },
              { id: "orb", label: "Orbs" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setCurrencyFilter(t.id as "all" | "fiat" | "orb")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
                  currencyFilter === t.id ? "bg-[#9b59b6]/20 text-[#9b59b6] shadow-sm border border-[#9b59b6]/30" : "text-[#5E6976] hover:text-[#9DA7B3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex bg-[#12151A] rounded-lg p-1 border border-[#252B34]">
            {[
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "1y", label: "1Y" },
              { id: "all", label: "All Time" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as "all" | "7d" | "30d" | "1y")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
                  timeRange === t.id ? "bg-[#171B21] text-white shadow-sm border border-[#252B34]" : "text-[#5E6976] hover:text-[#9DA7B3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

      {/* Top Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${dynamicStats.orbSpent > 0 ? 'xl:grid-cols-5 lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
        {[
          { icon: DollarSign, label: "Total Spent", value: dynamicStats.spentStr, color: "#34D399" },
          ...(dynamicStats.orbSpent > 0 ? [{ icon: Star, label: "Total Orbs", value: `${dynamicStats.orbSpent.toLocaleString()}`, color: "#9b59b6", isOrb: true }] : []),
          { icon: Receipt, label: "Transactions", value: dynamicStats.count.toLocaleString(), color: "#5865F2" },
          { icon: Calendar, label: "First Purchase", value: formatDate(dynamicStats.first), color: "#F59E0B", isDate: true },
          { icon: TrendingUp, label: "Last Purchase", value: formatDate(dynamicStats.last), color: "#7C8CFF", isDate: true },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={`border-l pl-4 py-1 flex flex-col justify-between h-[76px] ${s.isOrb ? 'border-[#9b59b6]' : 'border-[#252B34]'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={12} style={{ color: s.color }} className="opacity-70" />
            </div>
            <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5 whitespace-nowrap truncate">
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 premium-card p-6 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-[#34D399]" /> 
              Spending Volume Over Time
            </h3>
            <p className="text-[#9DA7B3] text-xs mt-1">Aggregated successful transaction amounts by month.</p>
          </div>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(val: unknown) => [`$${Number(val).toFixed(2)}`, 'Spent']} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoveredBar === index ? '#34D399' : 'rgba(52, 211, 153, 0.4)'}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="transition-all duration-300 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Transaction History List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="premium-card flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-[#252B34] flex flex-row flex-wrap items-center justify-between gap-4">
            {/* Title Block: Forces inline row layout for Icon + Text */}
            <div className="flex flex-row items-center gap-2 flex-shrink-0">
              <ShoppingBag size={16} className="text-[#5865F2] flex-shrink-0" />
              <div>
                <h3 className="text-white text-base font-bold whitespace-nowrap">Transaction History</h3>
                <p className="text-[#9DA7B3] text-xs mt-1">Detailed list of all billing events.</p>
              </div>
            </div>
            
            {/* Filter Buttons Block: Forces horizontal layout */}
            <div className="flex flex-row flex-wrap items-center justify-start sm:justify-end gap-2 min-w-0">
              {[
                { id: "all", label: "All Statuses" },
                { id: "success", label: "Success" },
                { id: "failed", label: "Failed" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setStatusFilter(t.id as "all" | "success" | "pending" | "failed" | "refunded")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider border ${
                    statusFilter === t.id 
                      ? "bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30 shadow-sm" 
                      : "bg-[#12151A] text-[#5E6976] border-[#252B34] hover:text-[#9DA7B3] hover:border-[#3E454D]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[400px] space-y-2">
            {sortedPaymentsDesc.map((p: PaymentRecord, i: number) => {
              const isFailed = p.status === 2; // 2 = Failed
              const isSuccess = !isFailed;
              
              const statusLabel = isSuccess ? "Success" : "Failed";
              
              let bgColor = "bg-[#EF4444]/10 text-[#EF4444]";
              let icon = <span className="text-[10px] font-bold">X</span>;
              
              if (isSuccess) {
                bgColor = "bg-[#34D399]/10 text-[#34D399]";
                icon = <ArrowUpRight size={14} />;
              }

              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#12151A] transition-colors cursor-default border border-transparent hover:border-[#252B34] gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate" title={p.description || "Purchase"}>{p.description || "Purchase"}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[#5E6976] text-[10px] font-mono whitespace-nowrap">{formatDate(p.created_at)}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap ${bgColor.replace('text-', 'text-opacity-80 text-')}`}>{statusLabel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold font-mono ${isSuccess ? 'text-white' : 'text-[#9DA7B3] opacity-80'}`}>
                      {formatCurrency(p.amount, p.currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
