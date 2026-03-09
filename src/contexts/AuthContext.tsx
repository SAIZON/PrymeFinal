import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    role: string | null;
    name: string | null;
    isLoading: boolean;
    isAdmin: boolean;
    login: (token: string, role: string, name: string) => void; // Add this
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("pryme_token");
        const storedRole = localStorage.getItem("pryme_role");
        const storedName = localStorage.getItem("pryme_name");

        if (storedToken) {
            setToken(storedToken);
            setRole(storedRole);
            setName(storedName);
        }

        setIsLoading(false);
    }, []);

    // 🧠 NEW: This syncs localStorage and React State instantly
    const login = (newToken: string, newRole: string, newName: string) => {
        localStorage.setItem("pryme_token", newToken);
        localStorage.setItem("pryme_role", newRole);
        localStorage.setItem("pryme_name", newName);

        setToken(newToken);
        setRole(newRole);
        setName(newName);
    };

    const signOut = () => {
        localStorage.removeItem("pryme_token");
        localStorage.removeItem("pryme_role");
        localStorage.removeItem("pryme_name");
        setToken(null);
        setRole(null);
        setName(null);
        window.location.href = "/auth";
    };

    const value: AuthContextType = {
        token,
        role,
        name,
        isLoading,
        isAdmin: role === "ROLE_ADMIN" || role === "SUPER_ADMIN" || role === "ADMIN",
        login, // Expose it here
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};