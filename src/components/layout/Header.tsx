import { useState, useEffect, useRef, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Phone, User, LogOut, Settings, ChevronDown, 
  Calculator, Home, Briefcase, Building2, Wallet, Gift, Sun, Moon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import prymeLogo from "@/assets/pryme-logo.svg";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CONTACT_PHONE = "1800-309-4001";
const CONTACT_PHONE_LINK = "tel:18003094001";

const productLinks = [
  { href: "/apply?type=personal", label: "Personal Loan", icon: Wallet, description: "Quick approval, minimal docs" },
  { href: "/apply?type=business", label: "Business Loan", icon: Briefcase, description: "Fuel your business growth" },
  { href: "/apply?type=home", label: "Home Loan", icon: Home, description: "Make your dream home real" },
  { href: "/apply?type=lap", label: "Loan Against Property", icon: Building2, description: "Unlock your property value" },
];

const toolLinks = [
  { href: "/apply#emi-calculator", label: "EMI Calculator", icon: Calculator, description: "Calculate your monthly EMI" },
  { href: "/apply#rewards", label: "Rewards Calculator", icon: Gift, description: "Discover your reward tier" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Compare Loans" },
  { href: "/dashboard", label: "Track Application" },
    { href: "/rewards", label: "Offers" },

];

// --- Mobile Menu Component ---
const MobileMenu = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { token, name, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div className={cn("lg:hidden fixed inset-0 z-[100] transition-all duration-300", isOpen ? "visible" : "invisible")}>
      <div className={cn("absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={cn("absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <span className="font-medium text-lg dark:text-white">Menu</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5 dark:text-white" /></button>
        </div>
        <div className="p-5 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
          <div>
            <Link to="/" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm"><Home className="w-4 h-4 text-slate-700 dark:text-slate-300" /></div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Home</span>
            </Link>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Products</p>
            <div className="space-y-1">
              {productLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><item.icon className="w-4 h-4 text-[#2aac64]" /></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Tools</p>
            <div className="space-y-1">
              {toolLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><item.icon className="w-4 h-4 text-[#ffd600]" /></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Toggle Theme</span>
            </button>
            {token ? (
              <div className="space-y-2 mt-2">
                <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><User className="w-4 h-4" /><span className="text-sm font-medium">Dashboard</span></Link>
                <button onClick={handleSignOut} className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Sign Out</span></button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <Button asChild className="w-full bg-[#2aac64] hover:bg-[#259b5a] text-white"><Link to="/apply" onClick={onClose}>Apply Now</Link></Button>
                <Button asChild variant="outline" className="w-full"><Link to="/auth" onClick={onClose}>Log In</Link></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

// --- Header Component ---
const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
    const { token, name, isAdmin, signOut } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Physics: Floating Island Effect
  useGSAP(() => {
    const scrollTrigger = ScrollTrigger.create({
      start: "top top",
      end: 100,
      onUpdate: (self) => {
        if (self.progress > 0.5) {
          gsap.to(navContainerRef.current, {
            width: "90%",
            maxWidth: "1200px",
            borderRadius: "24px",
            y: 12,
            backgroundColor: theme === 'dark' ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            border: theme === 'dark' ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
            duration: 0.4,
            ease: "power2.out"
          });
        } else {
          gsap.to(navContainerRef.current, {
            width: "100%",
            maxWidth: "100%",
            borderRadius: "0px",
            y: 0,
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            border: "1px solid transparent",
            boxShadow: "none",
            duration: 0.4,
            ease: "power2.out"
          });
        }
      }
    });
    return () => scrollTrigger.kill();
  }, [theme]);

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-0 transition-all duration-300 pointer-events-none">
        <div ref={navContainerRef} className="w-full h-20 px-6 flex items-center justify-between transition-all duration-300 pointer-events-auto bg-transparent">
          
          {/* Logo - Adaptive Dark Mode */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={prymeLogo} alt="PRYME" className="h-10 w-auto object-contain transition-all duration-300 dark:brightness-0 dark:invert group-hover:scale-105" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-black/20 rounded-full px-2 py-1 border border-white/20 dark:border-white/5 backdrop-blur-sm shadow-sm">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm rounded-full h-9">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-4 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <div className="grid grid-cols-2 gap-2">
                        {productLinks.map((item) => (
                          <Link key={item.href} to={item.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#2aac64]" /></div>
                            <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{item.label}</p><p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</p></div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm rounded-full h-9">Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[350px] p-4 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      {toolLinks.map((item) => (
                        <Link key={item.href} to={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors group">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0"><item.icon className="w-4 h-4 text-[#ffd600]" /></div>
                          <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p></div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className={cn("px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10", location.pathname === link.href ? "text-[#2aac64]" : "text-slate-600 dark:text-slate-300")}>
                {link.label === "Home" ? (
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" /> {link.label}
                  </div>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-[#2aac64] dark:hover:text-[#ffd600]">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <a href={CONTACT_PHONE_LINK} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#2aac64] dark:hover:text-[#2aac64] transition-colors"><Phone className="w-4 h-4" /><span>{CONTACT_PHONE}</span></a>
              {token ? (
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="hidden lg:flex gap-2 rounded-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-900 pr-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-3.5 h-3.5 text-primary" />
                              </div>
                              {/* 🧠 Use `name` */}
                              <span className="font-medium text-sm">{name || "Account"}</span>
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl">
                          <div className="px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                              {/* 🧠 Use `name` */}
                              <p className="font-semibold text-sm dark:text-white">{name || "User"}</p>
                              <p className="text-xs text-slate-500">Active Session</p>
                          </div>
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                              <Link to="/dashboard" className="flex items-center"><User className="w-4 h-4 mr-2 text-slate-400" /> Dashboard</Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                  <Link to="/admin" className="flex items-center"><Settings className="w-4 h-4 mr-2 text-slate-400" /> Admin Panel</Link>
                              </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-2" />
                          <DropdownMenuItem onClick={signOut} className="rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30">
                              <LogOut className="w-4 h-4 mr-2" /> Sign Out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
            ) : (
                  <div className="hidden lg:flex items-center gap-3">
                      <Link to="/auth" className="px-5 py-2.5 rounded-full font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Log In</Link>
                      <Link to="/auth" className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all hover:shadow-lg hover:-translate-y-0.5">Get Started</Link>
                  </div>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><Menu /></button>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
});

Header.displayName = "Header";
export default Header;