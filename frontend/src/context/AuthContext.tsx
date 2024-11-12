import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axios-instance";

interface AuthContextProps {
	user: any;
	token: string | null;
	isAuthenticated: boolean;
	login: (token: string, userData: any, refreshToken: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);
	const [refreshToken, setRefreshToken] = useState<string | null>(
		localStorage.getItem("refreshToken")
	);
	const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

	// Derived property for authentication status
	const isAuthenticated = !!token;

	// When token is available, set axios headers
	useEffect(() => {
		if (token) {
			axiosInstance.defaults.headers.common[
				"Authorization"
			] = `Bearer ${token}`;

			// Parse expiration time from the token response
			if (localStorage.getItem("accessExpiry")) {
				setTokenExpiry(new Date(localStorage.getItem("accessExpiry")!));
			}
		}
	}, [token]);

	// Handle token expiration and refresh logic
	useEffect(() => {
		const refreshAuthToken = async () => {
			if (refreshToken) {
				try {
					const response = await axiosInstance.post("/auth/refresh-tokens", {
						refreshToken,
					});
					const {
						token: newToken,
						refreshToken: newRefreshToken,
						expires,
					} = response.data;

					// Update state and localStorage with new tokens
					setToken(newToken);
					setRefreshToken(newRefreshToken);
					localStorage.setItem("token", newToken);
					localStorage.setItem("refreshToken", newRefreshToken);
					localStorage.setItem("accessExpiry", expires); // Store the new token expiry time
					setTokenExpiry(new Date(expires)); // Set the new expiry time

					// Update axios Authorization header
					axiosInstance.defaults.headers.common[
						"Authorization"
					] = `Bearer ${newToken}`;
				} catch (error) {
					console.error("Failed to refresh token", error);
					logout(); // If token refresh fails, logout the user
				}
			}
		};

		// Refresh the token if it's expired
		if (tokenExpiry && new Date() > tokenExpiry) {
			refreshAuthToken();
		} else {
			// Set up an interval to refresh the token before it expires
			const interval = setInterval(() => {
				if (tokenExpiry && new Date() > tokenExpiry) {
					refreshAuthToken();
				}
			}, 10000); // Check every 10 seconds

			return () => clearInterval(interval); // Clean up interval on component unmount
		}
	}, [refreshToken, tokenExpiry]);

	// Login method to store both access and refresh tokens
	const login = (token: string, userData: any, refreshToken: string) => {
		localStorage.setItem("token", token);
		localStorage.setItem("refreshToken", refreshToken);
		setToken(token);
		setRefreshToken(refreshToken);
		setUser(userData);

		// Assuming you also get an expiration time from the response
		const expiryDate = new Date(new Date().getTime() + 3600 * 1000); // Add 1 hour for example
		localStorage.setItem("accessExpiry", expiryDate.toISOString());
		setTokenExpiry(expiryDate);
	};

	// Logout method to remove tokens and reset state
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("accessExpiry");
		setToken(null);
		setRefreshToken(null);
		setUser(null);
		delete axiosInstance.defaults.headers.common["Authorization"];
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
