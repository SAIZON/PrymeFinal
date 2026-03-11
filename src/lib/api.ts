// src/lib/api.ts
const API_BASE_URL = "/api/v1";

export const PrymeAPI = {
    // 1. Auth Module
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
    },

    // ADD THIS FOR REGISTRATION
    register: async (email: string, password: string, fullName: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, fullName }), // Ensure these map to your Java RegisterRequest DTO
        });
        if (!res.ok) throw new Error("Registration failed");
        return res.json();
    },

  // 2. CRM Module (Admin Data Fetch)
    getApplications: async () => {
        const token = localStorage.getItem("pryme_token");
        if (!token) throw new Error("AUTH_REQUIRED");

        // Added ?size=100 to get a larger page of results
        const res = await fetch(`${API_BASE_URL}/admin/applications?size=100`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
    },

    // 🧠 NEW: CRM Status Update Route
    updateStatus: async (id: number, status: string) => {
        const token = localStorage.getItem("pryme_token");
        if (!token) throw new Error("AUTH_REQUIRED");

        // Changed to use query param (?status=...) to match Spring Boot @RequestParam
        const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/status?status=${status}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
    },

  // 🧠 NEW: CRM Lead Assignment Route
  assignLead: async (applicationId: string, assigneeId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigneeId }),
    });
    if (!res.ok) throw new Error("Failed to assign lead");
    return res.json();
  },

  // 3. Lead Generation (Public)
    submitApplication: async (loanType: string, requestedAmount: number, cibilScore: number) => {

        // 🧠 1. Look for the user's token
        const token = localStorage.getItem("pryme_token");

        // 🧠 2. If no token exists, throw a custom error to halt the process
        if (!token) {
            throw new Error("AUTH_REQUIRED");
        }

        // 🧠 3. Call the secured endpoint and attach the token
        const res = await fetch(`${API_BASE_URL}/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ loanType, requestedAmount, cibilScore }),
        });

        if (!res.ok) throw new Error("Failed to submit application");
        return res.json();
    },

    getMyApplications: async () => {
        const token = localStorage.getItem("pryme_token");
        if (!token) throw new Error("AUTH_REQUIRED");

        const res = await fetch(`${API_BASE_URL}/my-applications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
    }
};