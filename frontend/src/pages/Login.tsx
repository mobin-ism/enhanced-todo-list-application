import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios-instance";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Redirect to dashboard if already authenticated
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axiosInstance.post("/auth/login", {
				email,
				password,
			});

			if (response.data.tokens && response.data.user) {
				login(
					response.data.tokens.access.token,
					response.data.user,
					response.data.tokens.refresh.token
				); // Save token and user data in AuthContext
				navigate("/dashboard"); // Redirect to dashboard
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (err) {
			setError("Invalid credentials or server issue");
			console.error(err); // Log error for debugging
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-md shadow-md w-80"
			>
				<h2 className="text-2xl font-bold mb-4">Login</h2>
				{error && <p className="text-red-500">{error}</p>}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						className="
                        border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full mt-2  rounded-md"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						type="password"
						className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full mt-2  rounded-md"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button className="w-full bg-blue-500 text-white p-2 rounded-md">
					Login
				</button>
				<div className="mt-4 text-center">
					<span className="text-sm text-gray-600">Don't have an account? </span>
					<a href="/register" className="text-blue-500 text-sm">
						Sign up
					</a>
				</div>
			</form>
		</div>
	);
};

export default Login;
