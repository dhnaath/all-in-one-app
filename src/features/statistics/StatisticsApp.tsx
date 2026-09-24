import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  LineChart,
  Plus,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  BellRing,
  Download,
  Sliders,
  Calendar,
  Sparkles,
  ShieldAlert,
  PieChart,
  LayoutGrid,
} from "lucide-react";
import { useStatisticsStore } from "./store";
import { MetricCategory, AlertSeverity, AlertCondition } from "./types";

type ViewTab = "cockpit" | "catalog" | "correlations" | "alerts" | "report";

export function StatisticsApp() {
  const {
    metrics,
    dashboards,
    selectedDashboardId,
    setSelectedDashboardId,
    alertRules,
    correlations,
    timeSeriesData,
    createDashboard,
    addWidgetToDashboard,
    removeWidget,
    createAlertRule,
    toggleAlertRule,
    deleteAlertRule,
  } = useStatisticsStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("cockpit");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  const [alertMetricId, setAlertMetricId] = useState(metrics[0]?.id || "");
  const [alertCondition, setAlertCondition] = useState<AlertCondition>("less_than");
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>("warning");
  const [alertChannel, setAlertChannel] = useState("#engineering-leads");

  // Active Dashboard
  const currentDashboard = useMemo(() => {
    return dashboards.find((d) => d.id === selectedDashboardId) || dashboards[0] || null;
  }, [dashboards, selectedDashboardId]);

  // Filtered metrics
  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [metrics, categoryFilter, searchQuery]);

  // Stats calculation per specification
  const stats = useMemo(() => {
    const totalMetrics = metrics.length;
    const totalDashboards = dashboards.length;
    const activeAlerts = alertRules.filter((a) => a.isActive).length;
    const triggeredCount = alertRules.filter((a) => a.lastTriggeredAt).length;

    return {
      totalMetrics,
      totalDashboards,
      activeAlerts,
      triggeredCount,
      freshnessLag: "< 3s real-time",
    };
  }, [metrics, dashboards, alertRules]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const met = metrics.find((m) => m.id === alertMetricId);
    if (!met) return;

    createAlertRule({
      metricId: met.id,
      metricName: met.name,
      condition: alertCondition,
      threshold: Number(alertThreshold),
      severity: alertSeverity,
      notifyChannels: [alertChannel],
    });

    setIsNewAlertOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              #24 Statistics
            </span>
            <span className="text-xs text-slate-400">Cross-App Metric Aggregator • Time Series, Trends & Threshold Alerts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Operational Intelligence
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Ecosystem Data Freshness: {stats.freshnessLag}
            </span>
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-sm">
          <button
            onClick={() => setActiveTab("cockpit")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "cockpit" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Executive Cockpit
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "catalog" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Metric Catalog ({metrics.length})
          </button>
          <button
            onClick={() => setActiveTab("correlations")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "correlations" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Correlations & Trends
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "alerts" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            Alerts ({alertRules.length})
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "report" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            Snapshot Export
          </button>
        </div>

        <button
          onClick={() => setIsNewAlertOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <BellRing className="w-4 h-4" />
          Set Alert Rule
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: EXECUTIVE COCKPIT */}
        {activeTab === "cockpit" && currentDashboard && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {metrics.slice(0, 3).map((met) => {
                const diff = met.previousValue ? met.currentValue - met.previousValue : 0;
                const isPositive = diff >= 0;

                return (
                  <div key={met.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {met.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Target: {met.targetValue} {met.unit}
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl font-extrabold text-white">
                        {met.currentValue} <span className="text-sm font-normal text-slate-400">{met.unit}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200 mt-1">{met.name}</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                      <span className={`flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`} vs last cycle
                      </span>
                      <span className="text-slate-400 text-[11px]">from {met.sourceApps[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Series Multi-Line Progress Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-emerald-400" />
                    Multi-Metric Time Series Trajectory (Past 4 Weeks)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Normalized tracking of productivity, deliverable compliance, and SLA adherence.
                  </p>
                </div>
              </div>

              {/* Chart Visual Simulation */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                {["Week 1 (09-01)", "Week 2 (09-08)", "Week 3 (09-15)", "Week 4 (09-22)"].map((wk, idx) => (
                  <div key={wk} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">{wk}</span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                          <span>Velocity</span>
                          <span className="text-white font-mono">{timeSeriesData["m-prod-comp"]?.[idx]?.value || 40} t/wk</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${((timeSeriesData["m-prod-comp"]?.[idx]?.value || 40) / 50) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                          <span>DoD Compliance</span>
                          <span className="text-white font-mono">{timeSeriesData["m-dod-compliance"]?.[idx]?.value || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${timeSeriesData["m-dod-compliance"]?.[idx]?.value || 85}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                          <span>Workflow SLA</span>
                          <span className="text-white font-mono">{timeSeriesData["m-sla-pipeline"]?.[idx]?.value || 80}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-violet-500 h-full rounded-full"
                            style={{ width: `${timeSeriesData["m-sla-pipeline"]?.[idx]?.value || 80}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: METRIC CATALOG */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-white font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="productivity">Productivity</option>
                  <option value="quality">Quality</option>
                  <option value="operational">Operational</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Metric Name & Description</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Calculation</th>
                    <th className="py-3 px-4 font-semibold">Current Value</th>
                    <th className="py-3 px-4 font-semibold">Target Value</th>
                    <th className="py-3 px-4 font-semibold">Source Ecosystem Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredMetrics.map((met) => (
                    <tr key={met.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{met.name}</div>
                        <div className="text-slate-400 text-[11px] leading-relaxed">{met.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {met.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{met.calculationMethod}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                        {met.currentValue} {met.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {met.targetValue ? `${met.targetValue} ${met.unit}` : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {met.sourceApps.map((app) => (
                            <span key={app} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400 border border-slate-800">
                              {app}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CORRELATIONS & TRENDS */}
        {activeTab === "correlations" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Cross-Metric Statistical Correlations</h2>
              <p className="text-xs text-slate-400">
                Automated statistical regression discovering hidden operational dependencies between apps.
              </p>
            </div>

            <div className="space-y-4">
              {correlations.map((c, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{c.metricA}</span>
                      <span className="text-slate-400">↔</span>
                      <span className="font-bold text-white text-sm">{c.metricB}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: r = {c.correlationScore}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                    💡 <strong>Operational Insight:</strong> {c.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS MANAGEMENT */}
        {activeTab === "alerts" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Configured Threshold Alert Rules</h2>
                <p className="text-xs text-slate-400">
                  Real-time monitors triggering warnings when critical SLA or quality thresholds are breached.
                </p>
              </div>

              <button
                onClick={() => setIsNewAlertOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Alert Rule
              </button>
            </div>

            <div className="space-y-3">
              {alertRules.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        alt.severity === "critical"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="font-bold text-white text-sm">{alt.metricName}</span>
                    </div>
                    <div className="text-slate-400">
                      Condition: Trigger when value is <strong>{alt.condition.replace("_", " ")} {alt.threshold}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Dispatched to: {alt.notifyChannels.join(", ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlertRule(alt.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${
                        alt.isActive
                          ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {alt.isActive ? "Active Monitoring" : "Muted"}
                    </button>

                    <button
                      onClick={() => deleteAlertRule(alt.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REPORT GENERATOR */}
        {activeTab === "report" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Executive Brief</span>
                <h2 className="text-xl font-bold text-white mt-1">Ecosystem Operational Snapshot</h2>
                <div className="text-xs text-slate-400 mt-1">Generated for: PT Nusantara Digital Workspace • Date: 2026-09-24</div>
              </div>

              <button
                onClick={() => alert("Report downloaded as consolidated audit PDF snapshot.")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm">Key Metric Benchmarks</h3>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => (
                  <div key={m.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-300">{m.name}:</span>
                    <span className="font-mono font-bold text-emerald-400">{m.currentValue} {m.unit}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-white text-sm pt-2">Executive Summary</h3>
              <p className="text-slate-300 leading-relaxed">
                Overall system velocity is trending upward (+21% sprint over sprint). Deliverable definition-of-done compliance has reached 92%, satisfying the minimum required threshold of 85%. Automated regression shows that thorough DoD acceptance reduces subsequent bug reports by 44%.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Alert Modal */}
      {isNewAlertOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Metric Threshold Alert</h3>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Metric</label>
                <select
                  value={alertMetricId}
                  onChange={(e) => setAlertMetricId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {metrics.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Condition</label>
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as AlertCondition)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="less_than">Less than</option>
                    <option value="greater_than">Greater than</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Threshold</label>
                  <input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Severity</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as AlertSeverity)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Notify Channel</label>
                <input
                  type="text"
                  value={alertChannel}
                  onChange={(e) => setAlertChannel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAlertOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
