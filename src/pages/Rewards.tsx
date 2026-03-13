import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
    Percent, TrendingDown, Activity, Wallet,
    Home, Shield, Tag, Clock, ChevronRight,
    Sparkles, Gift
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Updated Mock Data for Loan/Finance Rewards
const MOCK_REWARDS = [
    {
        id: 1,
        title: "Zero Processing Fee",
        description: "Get 100% of your processing fee waived off on Personal Loans above ₹5 Lakhs.",
        category: "Fee Waivers",
        icon: Percent,
        validity: "Valid till 31st Dec",
        color: "from-blue-500 to-cyan-400",
        brand: "HDFC Bank",
    },
    {
        id: 2,
        title: "0.50% Interest Rate Discount",
        description: "Special festive offer! Secure a flat 0.50% reduction on standard Home Loan interest rates.",
        category: "Interest Discounts",
        icon: TrendingDown,
        validity: "Valid till 15th Nov",
        color: "from-emerald-500 to-teal-400",
        brand: "Axis Bank",
    },
    {
        id: 3,
        title: "1st EMI Cashback",
        description: "Pay your first 3 EMIs on time and get 100% cashback on your 1st EMI amount.",
        category: "Cashback",
        icon: Wallet,
        validity: "Valid for New Users",
        color: "from-amber-400 to-yellow-600",
        brand: "ICICI Bank",
    },
    {
        id: 4,
        title: "Complimentary CIBIL Premium",
        description: "Unlock 1 year of free premium credit score monitoring and personalized financial advice.",
        category: "Financial Services",
        icon: Activity,
        validity: "Ongoing Benefit",
        color: "from-purple-500 to-indigo-500",
        brand: "TransUnion CIBIL",
    },
    {
        id: 5,
        title: "Flat 25% Off on Home Interiors",
        description: "Approved for a Home Loan? Get an exclusive flat 25% discount on complete home interior design.",
        category: "Partner Offers",
        icon: Home,
        validity: "Valid for 6 Months",
        color: "from-rose-400 to-red-500",
        brand: "Livspace",
    },
    {
        id: 6,
        title: "Free Loan Protection Insurance",
        description: "Get complimentary life cover up to ₹10 Lakhs mapped to your loan outstanding amount.",
        category: "Financial Services",
        icon: Shield,
        validity: "Valid till 5th Nov",
        color: "from-slate-600 to-slate-800",
        brand: "HDFC Life",
    },
];

// Updated Categories relevant to loans
const CATEGORIES = ["All", "Fee Waivers", "Interest Discounts", "Cashback", "Financial Services", "Partner Offers"];

const Rewards = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    // Filter rewards based on selection
    const filteredRewards = MOCK_REWARDS.filter(
        (reward) => activeCategory === "All" || reward.category === activeCategory
    );

    return (
        <>
            <Helmet>
                <title>Exclusive Loan Offers & Rewards - PRYME</title>
                <meta name="description" content="Unlock premium benefits, fee waivers, and rate discounts with PRYME." />
            </Helmet>

            <div className="min-h-screen flex flex-col bg-background">
                <Header />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                        <div className="absolute inset-0 aurora-gradient opacity-50 dark:opacity-20 pointer-events-none" />
                        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Pryme Privileges</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight"
                            >
                                Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Rewards & Offers</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg text-muted-foreground"
                            >
                                Unlock zero processing fees, lowered interest rates, and exclusive financial perks just for applying through PRYME.
                            </motion.p>
                        </div>
                    </section>

                    {/* Filters & Grid Section */}
                    <section className="py-8 pb-20">
                        <div className="container mx-auto px-4">

                            {/* Category Filters */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                                {CATEGORIES.map((category, idx) => (
                                    <motion.button
                                        key={category}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                                            activeCategory === category
                                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Rewards Grid */}
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                                <AnimatePresence mode="popLayout">
                                    {filteredRewards.map((reward) => (
                                        <motion.div
                                            key={reward.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className="group flex flex-col bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all overflow-hidden"
                                        >
                                            {/* Card Image Banner Placeholder */}
                                            <div className={cn("h-32 w-full bg-gradient-to-br flex items-center justify-center relative overflow-hidden", reward.color)}>
                                                {/* Decorative background elements */}
                                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                                                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-2xl" />

                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg">
                                                    <reward.icon className="w-8 h-8 text-white" />
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    <Tag className="w-3 h-3" /> {reward.category}
                                                  </span>
                                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {reward.brand}
                                                  </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                    {reward.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-6 flex-1">
                                                    {reward.description}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-warning">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {reward.validity}
                                                    </div>

                                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-primary hover:bg-primary/10 rounded-lg font-semibold group/btn">
                                                        Claim
                                                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State */}
                                {filteredRewards.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                                        <Gift className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No offers available for this category right now.</p>
                                        <p className="text-sm">Please check back later!</p>
                                    </div>
                                )}
                            </motion.div>

                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Rewards;