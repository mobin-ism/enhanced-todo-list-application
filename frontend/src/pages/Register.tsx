import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:3000/v1/auth/register",
				{
					name,
					email,
					password,
				}
			);

			if (response.data.tokens && response.data.user) {
				login(response.data.tokens.access.token, response.data.user); // Save token and user data in AuthContext
				navigate("/dashboard"); // Redirect to dashboard
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (err) {
			setError("Server error. Please try again later.");
			console.error(err); // Log error for debugging
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-md shadow-md w-80"
			>
				<h2 className="text-2xl font-bold mb-4">Register</h2>
				{error && <p className="text-red-500">{error}</p>}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						type="input"
						className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full mt-2  rounded-md"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full mt-2  rounded-md"
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
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<input
						type="password"
						className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full mt-2  rounded-md"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button className="w-full bg-blue-500 text-white p-2 rounded-md">
					Register
				</button>
				<div className="mt-4 text-center">
					<span className="text-sm text-gray-600">
						Already have an account?{" "}
					</span>
					<a href="/" className="text-blue-500 text-sm">
						Login
					</a>
				</div>
			</form>
		</div>
	);
};

export default Register;
