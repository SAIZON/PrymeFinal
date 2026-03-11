import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, Search, CheckCircle, CreditCard, Clock, AlertCircle, Building2, TrendingUp, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { PrymeAPI } from "@/lib/api";

const springConfig = { stiffness: 120, damping: 28, mass: 0.8 };

const Dashboard = () => {
    const { token, name, isLoading, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState<any[]>([]);
    const [isFetchingApps, setIsFetchingApps] = useState(true);

    // NEW: State to track which application is currently selected
    const [selectedAppIndex, setSelectedAppIndex] = useState(0);

    useEffect(() => {
        if (!isLoading && !token) {
            navigate("/auth");
            return;
        }

        if (token) {
            fetchApplications();
        }
    }, [token, isLoading, navigate]);

    const fetchApplications = async () => {
        try {
            setIsFetchingApps(true);
            const data = await PrymeAPI.getMyApplications();
            // Sort newest first
            const sortedData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setApplications(sortedData);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setIsFetchingApps(false);
        }
    };

    const getStageStyles = (status: string) => {
        switch (status) {
            case "completed":
                return { circle: "bg-success text-success-foreground", line: "bg-success", text: "text-success" };
            case "current":
                return { circle: "bg-primary text-primary-foreground animate-pulse", line: "bg-border", text: "text-primary" };
            case "error": // <-- Added error state handling
            case "rejected":
                return { circle: "bg-red-500 text-white", line: "bg-border", text: "text-red-500" };
            default:
                return { circle: "bg-muted text-muted-foreground", line: "bg-border", text: "text-muted-foreground" };
        }
    };


    // Helper to map Database Status to Timeline
    const generateStages = (dbStatus: string, dateStr: string) => {
        const flow = ["SUBMITTED", "VERIFIED", "PROCESSING", "APPROVED", "DISBURSED"];

        // Treat PENDING same as SUBMITTED for the timeline
        const normalizedStatus = dbStatus === "PENDING" ? "SUBMITTED" : dbStatus;
        const currentIndex = flow.indexOf(normalizedStatus);
        const isRejected = dbStatus === "REJECTED";

        const determineStatus = (stageIndex: number) => {
            if (isRejected) {
                return "error";
            }
            if (currentIndex > stageIndex) return "completed";
            if (currentIndex === stageIndex) return "current";
            return "pending";
        };

        const formattedDate = new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        return [
            {
                id: 1, title: "Application Received", description: "Your application has been submitted successfully", icon: FileText,
                status: isRejected ? "completed" : determineStatus(0),
                timestamp: formattedDate,
            },
            {
                id: 2, title: "Document Verification", description: "Our team is verifying your profile", icon: Search,
                status: isRejected ? "error" : determineStatus(1),
                timestamp: currentIndex >= 1 ? "Updated" : "Pending",
            },
            {
                id: 3, title: "Credit Assessment", description: "Evaluating your credit profile", icon: AlertCircle,
                status: (isRejected && currentIndex < 2) ? "pending" : isRejected ? "error" : determineStatus(2),
                timestamp: currentIndex >= 2 ? "Updated" : "Pending",
            },
            {
                id: 4, title: "Approval", description: "Final approval from our underwriting team", icon: CheckCircle,
                status: (isRejected && currentIndex < 3) ? "pending" : isRejected ? "error" : determineStatus(3),
                timestamp: currentIndex >= 3 ? "Updated" : "Pending",
            },
            {
                id: 5, title: "Disbursement", description: "Funds transferred to your account", icon: CreditCard,
                status: (isRejected && currentIndex < 4) ? "pending" : isRejected ? "error" : determineStatus(4),
                timestamp: currentIndex >= 4 ? "Updated" : "Pending",
            },
        ];
    };

    if (isLoading || isFetchingApps) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-primary flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    const activeAppsCount = applications.filter(a => a.status !== "DISBURSED" && a.status !== "REJECTED").length;
    const approvedAppsCount = applications.filter(a => a.status === "APPROVED" || a.status === "DISBURSED").length;
    const totalAmount = applications.reduce((sum, app) => sum + (app.amount || 0), 0);

    const quickStats = [
        { label: "Total Applications", value: applications.length.toString(), icon: FileText, color: "text-primary" },
        { label: "Active Processing", value: activeAppsCount.toString(), icon: Clock, color: "text-warning" },
        { label: "Approved", value: approvedAppsCount.toString(), icon: CheckCircle, color: "text-success" },
        { label: "Total Amount", value: `₹${(totalAmount / 100000).toFixed(2)}L`, icon: TrendingUp, color: "text-primary" },
    ];

    // Derive the currently selected application
    const currentApp = applications.length > 0 ? applications[selectedAppIndex] : null;

    return (
        <>
            <Helmet>
                <title>Dashboard - PRYME Intelligent Aggregator</title>
            </Helmet>

            <div className="min-h-screen flex flex-col bg-background">
                <Header />

                <main className="flex-1">
                    {/* Page Header */}
                    <section className="aurora-gradient py-12 md:py-16">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...springConfig }}>
                                    <h1 className="text-xl md:text-2xl font-medium text-foreground mb-2" style={{ letterSpacing: "-0.02em" }}>
                                        Welcome back, {name ?? "User"}
                                    </h1>
                                    <p className="text-muted-foreground text-lg">Monitor your loan applications and manage your profile</p>
                                </motion.div>
                                <div className="flex items-center gap-3">
                                    {isAdmin && (
                                        <Button onClick={() => navigate("/admin")} className="neo-button border-0 bg-trust text-trust-foreground hover:bg-trust/90">
                                            <Building2 className="w-4 h-4 mr-2" /> Admin Panel
                                        </Button>
                                    )}
                                    <Button onClick={signOut} variant="outline" className="neo-button border-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Stats */}
                    <section className="py-8 border-b border-border/50">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {quickStats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...springConfig, delay: index * 0.08 }}
                                        whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                        className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40 p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_hsl(148_62%_42%/0.12)] hover:border-primary/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center">
                                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                                <p className="text-2xl font-medium text-foreground tabular-nums">{stat.value}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Applications Area */}
                    <section className="py-12 md:py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-3xl mx-auto">

                                {applications.length === 0 ? (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-12 bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40">
                                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
                                        <p className="text-muted-foreground mb-6">You don't have any active loan applications with PRYME yet.</p>
                                        <Button onClick={() => navigate("/apply")} className="bg-primary hover:bg-primary/90">
                                            Start New Application
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Application Switcher (Only visible if > 1 application) */}
                                        {applications.length > 1 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-2">
                                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Application</span>
                                                <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                                    {applications.map((app, index) => (
                                                        <button
                                                            key={app.id}
                                                            onClick={() => setSelectedAppIndex(index)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                                                                selectedAppIndex === index
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-card border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                            )}
                                                        >
                                                            PYR-{app.id} • <span className="capitalize">{app.loanType || "Loan"}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Current Selected Application Card & Timeline */}
                                        {currentApp && (() => {
                                            const stages = generateStages(currentApp.status, currentApp.createdAt);
                                            const isRejected = currentApp.status === "REJECTED";

                                            return (
                                                <motion.div
                                                    key={`app-view-${currentApp.id}`} // Using ID as key forces animation to replay when switching
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", ...springConfig }}
                                                    className="mb-12"
                                                >
                                                    {/* Application Summary Card */}
                                                    <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40 p-6 mb-6 hover:border-primary/15 transition-colors duration-300">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-border/50">
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Application ID</span>
                                                                <p className="text-lg font-mono font-semibold text-foreground">PYR-{currentApp.id}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Product</span>
                                                                <p className="text-sm font-medium text-foreground bg-muted px-3 py-1 rounded-full capitalize">{currentApp.loanType || "Personal Loan"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Status</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className={cn("w-2 h-2 rounded-full", isRejected ? "bg-red-500" : currentApp.status === "APPROVED" || currentApp.status === "DISBURSED" ? "bg-success" : "bg-warning animate-pulse")} />
                                                                    <span className={cn("text-sm font-medium", isRejected ? "text-red-500" : "text-foreground")}>{currentApp.status.replace("_", " ")}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Submitted</span>
                                                                <p className="text-sm font-medium text-foreground mt-1">
                                                                    {new Date(currentApp.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Amount</span>
                                                                <p className="text-sm font-medium text-foreground mt-1">₹{currentApp.amount?.toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Tenure</span>
                                                                <p className="text-sm font-medium text-foreground mt-1">{currentApp.tenureMonths || "60"} months</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Timeline Block */}
                                                    <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40 p-6 mb-8">
                                                        <h2 className="text-lg font-semibold text-foreground mb-8">Application Progress</h2>

                                                        <div className="relative">
                                                            {stages.map((stage, i) => {
                                                                const styles = getStageStyles(stage.status);
                                                                const isLast = i === stages.length - 1;

                                                                return (
                                                                    <div key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                                                                        {!isLast && <div className={cn("absolute left-5 top-10 w-0.5 h-[calc(100%-2rem)]", styles.line)} />}
                                                                        <div className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0", styles.circle)}>
                                                                            {(stage.status === "rejected" || stage.status === "error") ? <AlertCircle className="w-5 h-5" /> : <stage.icon className="w-5 h-5" />}
                                                                        </div>
                                                                        <div className="flex-1 pt-1">
                                                                            <div className="flex items-start justify-between gap-4">
                                                                                <div>
                                                                                    <h3 className={cn("font-medium", styles.text)}>
                                                                                        {(stage.status === "rejected" || stage.status === "error") ? "Application Rejected" : stage.title}
                                                                                    </h3>
                                                                                    <p className="text-sm text-muted-foreground mt-0.5">
                                                                                        {(stage.status === "rejected" || stage.status === "error") ? "Unfortunately, your application did not meet the required criteria." : stage.description}
                                                                                    </p>
                                                                                </div>
                                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{stage.timestamp}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })()}
                                    </>
                                )}

                                {/* Help Card */}
                                {applications.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", ...springConfig, delay: 0.3 }}
                                        className="bg-muted/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 text-center"
                                    >
                                        <h3 className="font-medium text-foreground mb-2">Need Help?</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Our support team is available 24/7 to assist you with your application.
                                        </p>
                                        <Button variant="outline" className="neo-button border-0">Contact Support</Button>
                                    </motion.div>
                                )}

                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Dashboard;