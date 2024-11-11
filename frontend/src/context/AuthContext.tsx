import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextProps {
	user: any;
	token: string | null;
	isAuthenticated: boolean; // Add this derived property
	login: (token: string, userData: any) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);

	// Derived property for authentication status
	const isAuthenticated = !!token;

	useEffect(() => {
		if (token) {
			// Validate token and fetch user data if needed
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
	}, [token]);

	const login = (token: string, userData: any) => {
		localStorage.setItem("token", token);
		setToken(token);
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
		delete axios.defaults.headers.common["Authorization"];
	};

	return (
		<AuthContext.Provider
			value={{ user, token, isAuthenticated, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
