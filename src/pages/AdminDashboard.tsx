import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    Users, FileText, Building2, Settings,
    LogOut, Bell, Search, LayoutGrid, CreditCard,
    ShieldCheck, Clock, CheckCircle2, Activity,
    BarChart3, Mail, Calendar, Plus, ExternalLink,
    X, Loader2, MessageCircle, FileCheck, History,
    Sparkles, LayoutList, Wallet, Moon, Sun,
    TrendingUp, TrendingDown, Target, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { PrymeAPI } from "@/lib/api";

// Enterprise Charting Integration
import {
    Area, AreaChart, CartesianGrid, Cell, Legend,
    Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip,
    XAxis, YAxis, BarChart, Bar
} from "recharts";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // UI & Navigation States
    const [activeTab, setActiveTab] = useState("overview");
    const [crmView, setCrmView] = useState<"list" | "kanban">("list");
    const [leadFilter, setLeadFilter] = useState<"all" | "queue">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Modal & Drawer States
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "documents" | "timeline">("details");
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

    // Data States
    const [applications, setApplications] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, pendingApplications: 0, approvedLoans: 0, totalDisbursed: 0 });

    // --- MOCK CONFIG & CHART DATA ---
    const employees = [
        { id: "EMP001", name: "Rahul Sharma (RM)" },
        { id: "EMP002", name: "Priya Desai (RM)" },
        { id: "EMP003", name: "Amit Patel (Sr. RM)" },
        { id: "UNASSIGNED", name: "Unassigned" }
    ];

    const pipelineStages = ["SUBMITTED", "PROCESSING", "VERIFIED", "APPROVED", "DISBURSED", "REJECTED"];

    const fallbackMockData = [
        { id: "101", applicationId: "PRY-9001", applicant: { name: "Aarav Gupta" }, loanType: "Personal Loan", requestedAmount: 500000, declaredCibilScore: 780, status: "SUBMITTED", assignee: "UNASSIGNED", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { id: "102", applicationId: "PRY-9002", applicant: { name: "Meera Reddy" }, loanType: "Home Loan", requestedAmount: 7500000, declaredCibilScore: 810, status: "PROCESSING", assignee: "EMP001", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { id: "103", applicationId: "PRY-9003", applicant: { name: "Vikram Singh" }, loanType: "Business Loan", requestedAmount: 2500000, declaredCibilScore: 690, status: "VERIFIED", assignee: "EMP002", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
        { id: "104", applicationId: "PRY-9004", applicant: { name: "Neha Joshi" }, loanType: "Personal Loan", requestedAmount: 300000, declaredCibilScore: 740, status: "APPROVED", assignee: "EMP001", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
        { id: "105", applicationId: "PRY-9005", applicant: { name: "Rohan Patel" }, loanType: "LAP", requestedAmount: 4000000, declaredCibilScore: 650, status: "REJECTED", assignee: "EMP003", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
        { id: "106", applicationId: "PRY-9006", applicant: { name: "Ananya Iyer" }, loanType: "Home Loan", requestedAmount: 5500000, declaredCibilScore: 765, status: "SUBMITTED", assignee: "UNASSIGNED", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() },
    ];

    // Enhanced Chart Data
    const revenueTrendData = [
        { month: "Oct", target: 3.5, volume: 2.4 }, { month: "Nov", target: 4.0, volume: 3.8 },
        { month: "Dec", target: 4.5, volume: 5.2 }, { month: "Jan", target: 5.0, volume: 4.8 },
        { month: "Feb", target: 6.0, volume: 6.8 }, { month: "Mar", target: 7.0, volume: 8.5 },
    ];

    const portfolioData = [
        { name: "Personal", value: 45, color: "#2aac64" }, { name: "Business", value: 30, color: "#3b82f6" },
        { name: "Home", value: 15, color: "#8b5cf6" }, { name: "LAP", value: 10, color: "#f59e0b" },
    ];

    const funnelData = [
        { stage: "Submitted", count: 145, color: "#94a3b8" },
        { stage: "Verified", count: 110, color: "#3b82f6" },
        { stage: "Approved", count: 75, color: "#8b5cf6" },
        { stage: "Disbursed", count: 42, color: "#2aac64" },
    ];

    const rmPerformanceData = [
        { name: "Rahul S.", volume: 4.2 },
        { name: "Priya D.", volume: 3.8 },
        { name: "Amit P.", volume: 5.1 },
        { name: "Kiran M.", volume: 2.9 },
    ];

    // --- INIT DATA ---
    useEffect(() => {
        const token = localStorage.getItem("pryme_token");
        if (!token) { navigate("/auth"); return; }

        if (localStorage.getItem("pryme_theme") === "dark") {
            setIsDarkMode(true); document.documentElement.classList.add("dark");
        }
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            let apps = await PrymeAPI.getApplications();
            if (!apps || apps.length === 0) apps = fallbackMockData;

            const augmentedApps = apps.map((app: any) => ({ ...app, assignee: app.assignee || "UNASSIGNED" }))
                .sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());

            setApplications(augmentedApps);
            setStats({
                totalUsers: 142,
                pendingApplications: augmentedApps.filter((a: any) => ['SUBMITTED', 'PENDING', 'PROCESSING'].includes(a.status)).length,
                approvedLoans: augmentedApps.filter((a: any) => ['APPROVED', 'DISBURSED'].includes(a.status)).length,
                totalDisbursed: augmentedApps.reduce((sum: number, app: any) => sum + (app.requestedAmount || 0), 0),
            });
            setUsers([{ id: "1", email: "admin@pryme.com", full_name: "Super Admin", created_at: new Date().toISOString(), role: "SUPER_ADMIN" }]);
        } catch (error) {
            toast({ title: "Using Offline Demo Mode", description: "Database connection failed. Mock data loaded." });
            setApplications(fallbackMockData);
            setStats({ totalUsers: 142, pendingApplications: 5, approvedLoans: 2, totalDisbursed: 14000000 });
        } finally {
            setIsLoading(false);
        }
    };

    // --- LIVE SEARCH & FILTER ---
    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.loanType.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesQueue = leadFilter === "all" || (leadFilter === "queue" && app.assignee !== "UNASSIGNED");
            return matchesSearch && matchesQueue;
        });
    }, [applications, searchQuery, leadFilter]);

    // --- ACTIONS ---
    const toggleTheme = () => {
        if (isDarkMode) { document.documentElement.classList.remove("dark"); localStorage.setItem("pryme_theme", "light"); setIsDarkMode(false); }
        else { document.documentElement.classList.add("dark"); localStorage.setItem("pryme_theme", "dark"); setIsDarkMode(true); }
    };

    const handleAssignLead = async (appId: string, employeeId: string) => {
        setApplications(prev => prev.map(app => app.applicationId === appId ? { ...app, assignee: employeeId } : app));
        if (selectedApp?.applicationId === appId) setSelectedApp({ ...selectedApp, assignee: employeeId });
        try { await PrymeAPI.assignLead(appId, employeeId); toast({ title: "Lead Assigned" }); } catch { toast({ title: "Offline mode: Assignment simulated." }); }
    };

    const handleUpdateStatus = async (appId: string, newStatus: string) => {
        setApplications(prev => prev.map(app => app.applicationId === appId ? { ...app, status: newStatus } : app));
        if (selectedApp?.applicationId === appId) setSelectedApp({ ...selectedApp, status: newStatus });
        try { await PrymeAPI.updateStatus(appId, newStatus); toast({ title: "Pipeline Updated" }); } catch { toast({ title: "Offline mode: Status simulated." }); }
    };

    const handleExportCSV = () => {
        const headers = "Application ID,Loan Type,Amount,CIBIL,Status,Assignee,Date\n";
        const csvRows = applications.map(app => `${app.applicationId},${app.loanType},${app.requestedAmount},${app.declaredCibilScore},${app.status},${app.assignee},${new Date(app.createdAt).toISOString()}`).join("\n");
        const blob = new Blob([headers + csvRows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.setAttribute("href", url); a.setAttribute("download", `pryme_pipeline.csv`);
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const handleSignOut = () => { localStorage.clear(); navigate("/auth"); };
    const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            SUBMITTED: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
            PROCESSING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
            VERIFIED: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
            APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
            DISBURSED: "bg-[#2aac64]/10 text-[#2aac64] border-[#2aac64]/20",
            REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        };
        return map[status] || "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 text-[#2aac64] animate-spin" /><p className="text-slate-500 font-medium">Booting CRM Workspace...</p></div>
            </div>
        );
    }

    const sidebarItems = [
        { id: "overview", label: "Analytics Overview", icon: BarChart3 }, { id: "applications", label: "CRM Pipeline", icon: LayoutGrid },
        { id: "users", label: "User Directory", icon: Users }, { id: "settings", label: "System Settings", icon: Settings },
    ];

    return (
        <>
            <Helmet><title>PRYME Admin - Ultimate CRM</title></Helmet>

            <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden lg:flex fixed h-full z-20">
                    <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#2aac64] to-emerald-700 rounded-lg flex items-center justify-center shadow-md"><ShieldCheck className="w-5 h-5 text-white" /></div>
                            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">PRYME<span className="text-slate-400 font-medium ml-1">Admin</span></span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Workspace</p>
                        {sidebarItems.map((item) => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200", activeTab === item.id ? "bg-slate-100 dark:bg-slate-800 text-[#2aac64] shadow-sm border border-slate-200/50 dark:border-slate-700" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white")}>
                                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-[#2aac64]" : "opacity-70")} />{item.label}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm"><span className="text-xs font-bold text-[#2aac64]">AD</span></div>
                            <div className="flex-1 text-left"><p className="text-sm font-bold text-slate-900 dark:text-white">Super Admin</p></div>
                        </div>
                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                </aside>

                {/* Main Canvas */}
                <main className="flex-1 lg:pl-64 flex flex-col h-screen overflow-hidden">
                    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block group">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2aac64] transition-colors" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search PRY-ID or Type..." className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-900 focus:border-[#2aac64]/50 focus:ring-2 focus:ring-[#2aac64]/20 outline-none transition-all w-64 text-slate-900 dark:text-white placeholder:text-slate-400" />
                            </div>
                            <button onClick={toggleTheme} className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
                            <button className="relative p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="max-w-[1400px] mx-auto space-y-6">

                            {/* OVERVIEW TAB - ENTERPRISE UPGRADE */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    {/* Top Stats Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total Disbursed", value: formatCurrency(stats.totalDisbursed), icon: Wallet, trend: "+18.2%", up: true },
                                            { label: "Active Pipeline", value: stats.pendingApplications, icon: Activity, trend: "+4.1%", up: true },
                                            { label: "Conversion Rate", value: "32.4%", icon: Target, trend: "-1.2%", up: false },
                                            { label: "New Users", value: stats.totalUsers, icon: Users, trend: "+22.8%", up: true }
                                        ].map((metric, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                                        <metric.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                    <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full", metric.up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400")}>
                            {metric.up ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>} {metric.trend}
                          </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">{metric.label}</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{metric.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Chart & Activity Feed */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Big Area Chart */}
                                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Volume Forecast vs Actual</h3>
                                                    <p className="text-sm text-slate-500">Values in ₹ Crores</p>
                                                </div>
                                                <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                                                    <option>Last 6 Months</option><option>This Year</option>
                                                </select>
                                            </div>
                                            <div className="flex-1 min-h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                                            </linearGradient>
                                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#2aac64" stopOpacity={0.4}/>
                                                                <stop offset="95%" stopColor="#2aac64" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b'}} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b'}} />
                                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }} />
                                                        <Legend verticalAlign="top" height={36} iconType="circle" />
                                                        <Area name="Target Volume" type="monotone" dataKey="target" stroke={isDarkMode ? '#64748b' : '#cbd5e1'} strokeWidth={2} fillOpacity={1} fill="url(#colorTarget)" />
                                                        <Area name="Actual Volume" type="monotone" dataKey="volume" stroke="#2aac64" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Live Feed */}
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Live Activity</h3>
                                            </div>
                                            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                                                {[
                                                    { title: "Loan Disbursed", desc: "PRY-9008 · ₹8.00 L", time: "2 min ago", color: "bg-emerald-50 text-emerald-600" },
                                                    { title: "New Application", desc: "Home Loan · ₹75.00 L", time: "15 min ago", color: "bg-blue-50 text-blue-600" },
                                                    { title: "Document Verified", desc: "PRY-9003 · Aadhaar & PAN", time: "1 hr ago", color: "bg-purple-50 text-purple-600" },
                                                    { title: "Application Rejected", desc: "Low CIBIL Score (< 650)", time: "2 hrs ago", color: "bg-red-50 text-red-600" },
                                                    { title: "System Update", desc: "HDFC API Sync Complete", time: "5 hrs ago", color: "bg-slate-100 text-slate-600" },
                                                ].map((event, i) => (
                                                    <div key={i} className="flex gap-4 items-start relative group">
                                                        {i !== 4 && <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100 dark:bg-slate-800" />}
                                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border border-white dark:border-slate-900", event.color, isDarkMode && "bg-opacity-20")}>
                                                            <div className="w-2 h-2 rounded-full bg-current" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.desc}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium mt-1">{event.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3 Column Bottom Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Pipeline Funnel */}
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Pipeline Funnel</h3>
                                            <div className="h-[220px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                                                        <XAxis type="number" hide />
                                                        <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b'}} />
                                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                                            {funnelData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Portfolio Mix */}
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Portfolio Mix</h3>
                                            <div className="h-[240px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                                            {portfolioData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                        </Pie>
                                                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value}%`, 'Share']} />
                                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Top Performers */}
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Top RM Performers (Cr)</h3>
                                            <div className="h-[220px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={rmPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b'}} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} hide />
                                                        <RechartsTooltip cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey="volume" fill="#2aac64" radius={[4, 4, 0, 0]} barSize={32} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 🧠 THE MASTER CRM: APPLICATIONS TAB */}
                            {activeTab === "applications" && (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-180px)] relative animate-in fade-in slide-in-from-bottom-2">

                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/30 rounded-t-2xl">
                                        <div className="flex gap-2">
                                            <Button onClick={() => setLeadFilter("all")} variant={leadFilter === "all" ? "default" : "outline"} size="sm" className={cn("h-9 rounded-full px-5 text-xs font-semibold shadow-sm transition-all", leadFilter === "all" && "bg-slate-900 dark:bg-white text-white dark:text-slate-900", leadFilter !== "all" && "dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800")}>All Leads</Button>
                                            <Button onClick={() => setLeadFilter("queue")} variant={leadFilter === "queue" ? "default" : "ghost"} size="sm" className={cn("h-9 rounded-full px-5 text-xs font-semibold transition-all", leadFilter === "queue" && "bg-slate-900 dark:bg-white text-white dark:text-slate-900", leadFilter !== "queue" && "dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800")}>Active Queue</Button>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Button onClick={handleExportCSV} variant="outline" size="sm" className="h-9 rounded-full text-xs font-semibold hidden md:flex border-slate-200 dark:border-slate-700">Export CSV</Button>
                                            <div className="flex bg-slate-200/50 dark:bg-slate-950 p-1 rounded-full">
                                                <button onClick={() => setCrmView("list")} className={cn("p-1.5 rounded-full transition-all", crmView === "list" ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}><LayoutList className="w-4 h-4" /></button>
                                                <button onClick={() => setCrmView("kanban")} className={cn("p-1.5 rounded-full transition-all", crmView === "kanban" ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}><LayoutGrid className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VIEW 1: List View */}
                                    {crmView === "list" && (
                                        <div className="flex-1 overflow-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-[0_1px_0_0_#e2e8f0] dark:shadow-[0_1px_0_0_#1e293b] z-10">
                                                <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                                                    <th className="px-6 py-4">Application Info</th><th className="px-6 py-4">Risk Profile</th>
                                                    <th className="px-6 py-4">Assigned RM</th><th className="px-6 py-4">Pipeline Stage</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                                                {filteredApplications.length === 0 ? (
                                                    <tr><td colSpan={5} className="p-12 text-center"><div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3"><LayoutGrid className="w-5 h-5 text-slate-300 dark:text-slate-500" /></div><p className="text-slate-500 dark:text-slate-400">No leads found in this queue.</p></td></tr>
                                                ) : (
                                                    filteredApplications.map((app) => (
                                                        <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelectedApp(app)}>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700 group-hover:border-[#2aac64]/50 group-hover:text-[#2aac64] transition-all">
                                                                        {app.loanType?.substring(0, 2).toUpperCase() || "PL"}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-900 dark:text-white">{app.applicationId}</p>
                                                                        <p className="font-medium text-slate-500 mt-1">{formatCurrency(app.requestedAmount)} • {app.loanType}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="space-y-1.5 text-xs">
                                                                    <div className="flex items-center gap-2 text-slate-500 font-medium"><Activity className="w-3.5 h-3.5" />CIBIL: <strong className={app.declaredCibilScore >= 750 ? "text-emerald-500" : "text-amber-500"}>{app.declaredCibilScore}</strong></div>
                                                                    <div className="flex items-center gap-2 text-slate-500 font-medium"><Calendar className="w-3.5 h-3.5" />{new Date(app.createdAt || Date.now()).toLocaleDateString()}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top" onClick={(e) => e.stopPropagation()}>
                                                                <select value={app.assignee} onChange={(e) => handleAssignLead(app.applicationId, e.target.value)} className={cn("text-xs font-bold px-3 py-2 rounded-lg border outline-none cursor-pointer transition-all w-full max-w-[160px] dark:bg-slate-800", app.assignee === "UNASSIGNED" ? "bg-red-50/50 text-red-600 border-red-200 dark:bg-red-900/10 dark:border-red-800/50" : "bg-slate-50 border-slate-200 dark:border-slate-700 dark:text-slate-300")}>
                                                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4 align-top" onClick={(e) => e.stopPropagation()}>
                                                                <select value={app.status} onChange={(e) => handleUpdateStatus(app.applicationId, e.target.value)} className={cn("text-xs font-bold px-3 py-2 rounded-lg border outline-none cursor-pointer transition-all appearance-none", getStatusColor(app.status))}>
                                                                    {pipelineStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => {}} className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 hover:text-[#2aac64] transition-all shadow-sm"><ExternalLink className="w-4 h-4" /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* VIEW 2: Kanban Board */}
                                    {crmView === "kanban" && (
                                        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-slate-50/30 dark:bg-slate-950/30">
                                            <div className="flex gap-6 h-full items-start w-max">
                                                {pipelineStages.map((stage) => (
                                                    <div key={stage} className="w-[340px] flex flex-col max-h-full bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                                                        <div className="flex items-center justify-between mb-4 px-2 pt-1">
                                                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{stage}</h3>
                                                            <span className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                                {filteredApplications.filter(a => a.status === stage).length}
                              </span>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto space-y-3 p-1 hide-scrollbar">
                                                            {filteredApplications.filter(a => a.status === stage).map(app => (
                                                                <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#2aac64]/50 hover:-translate-y-0.5 transition-all cursor-pointer group">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <span className="text-xs font-bold text-slate-500 group-hover:text-[#2aac64] transition-colors">{app.applicationId}</span>
                                                                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">{app.loanType}</span>
                                                                    </div>
                                                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{formatCurrency(app.requestedAmount)}</p>
                                                                    <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-700/50 pt-3">
                                                                        <span className={cn("flex items-center gap-1 font-bold", app.declaredCibilScore >= 750 ? "text-emerald-500" : "text-amber-500")}><Activity className="w-3.5 h-3.5"/> {app.declaredCibilScore}</span>
                                                                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                                                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-[9px] font-bold border border-slate-200 dark:border-slate-700">
                                                                                {employees.find(e=>e.id===app.assignee)?.name.substring(0,2).toUpperCase()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* USERS TAB */}
                            {activeTab === "users" && (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Directory</h3>
                                        <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-full h-8"><Plus className="w-4 h-4 mr-1"/> Invite</Button>
                                    </div>
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50"><tr className="text-xs uppercase tracking-wider text-slate-500 font-bold"><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Joined</th></tr></thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                            {u.full_name?.substring(0, 2).toUpperCase() || "US"}
                                                        </div>
                                                        <div><p className="font-bold text-slate-900 dark:text-white">{u.full_name}</p><p className="text-xs text-slate-500">{u.email}</p></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><span className="inline-flex items-center rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-400">{u.role}</span></td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">{new Date(u.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>

            {/* 🧠 SALESFORCE-TIER PROFILE DRAWER */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
                    <div className="w-[500px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right border-l border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <div className="flex items-center gap-3 mb-1.5"><h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedApp.applicationId}</h2><span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold uppercase", getStatusColor(selectedApp.status))}>{selectedApp.status}</span></div>
                                <p className="text-sm font-medium text-slate-500">Applied: {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all"><X className="w-4 h-4 text-slate-600 dark:text-slate-300"/></button>
                        </div>

                        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-4 gap-6 bg-slate-50 dark:bg-slate-900/50">
                            {[
                                { id: "details", label: "Overview", icon: FileText },
                                { id: "documents", label: "Documents", icon: FileCheck },
                                { id: "timeline", label: "History", icon: History },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveDrawerTab(tab.id as any)} className={cn("pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-all", activeDrawerTab === tab.id ? "border-[#2aac64] text-[#2aac64]" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                            {activeDrawerTab === "details" && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex gap-4 items-start">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mt-0.5"><Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
                                        <div><h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">AI Risk Insight</h4><p className="text-xs font-medium text-indigo-700/80 dark:text-indigo-400/80 mt-1 leading-relaxed">High probability of instant approval. Applicant's declared CIBIL is in the top 15% percentile for this product line.</p></div>
                                    </div>

                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4 mt-8">Application Data</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Requested Amount</p><p className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(selectedApp.requestedAmount)}</p></div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Line</p><p className="font-bold text-lg text-slate-900 dark:text-white">{selectedApp.loanType}</p></div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CIBIL Score</p><p className={cn("font-bold text-lg", selectedApp.declaredCibilScore >= 750 ? "text-emerald-500" : "text-amber-500")}>{selectedApp.declaredCibilScore}</p></div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Applicant Name</p><p className="font-bold text-lg text-slate-900 dark:text-white truncate">{selectedApp.applicant?.name || 'Unknown'}</p></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={handleEmail} className="w-full font-bold text-slate-600 dark:text-slate-300 rounded-xl h-11"><Mail className="w-4 h-4 mr-2"/> Email Client</Button>
                            <Button onClick={() => { handleUpdateStatus(selectedApp.applicationId, "VERIFIED"); setSelectedApp(null); }} className="w-full font-bold bg-[#2aac64] hover:bg-emerald-600 text-white rounded-xl h-11 shadow-md shadow-[#2aac64]/20">Mark Verified</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;