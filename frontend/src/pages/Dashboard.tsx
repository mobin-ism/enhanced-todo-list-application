import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import CategoryFilter from "../components/CategoryFilter";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";

interface Task {
	id: string;
	title: string;
	category: string;
	priority?: string;
	description?: string;
	dueDate?: string;
}

const Dashboard = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [categories, setCategories] = useState<{ id: string; name: string }[]>(
		[]
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [sortConfig, setSortConfig] = useState<{ field: string; asc: boolean }>(
		{ field: "dueDate", asc: true }
	);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(5);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [newCategoryName, setNewCategoryName] = useState<string>(""); // New state for category input
	const [categoryError, setCategoryError] = useState<string>(""); // Error handling for category addition

	const { logout } = useAuth();
	const navigate = useNavigate();

	// Fetch tasks and categories on initial load or when parameters change
	useEffect(() => {
		fetchTasks();
		fetchCategories();
	}, [currentPage, selectedCategory, sortConfig, itemsPerPage, searchQuery]);

	const fetchTasks = async () => {
		try {
			const order = sortConfig.asc ? "asc" : "desc";
			const sortQuery = sortConfig.field
				? `sortBy=${sortConfig.field}:${order}`
				: "";
			const categoryFilter = selectedCategory
				? `&categoryId=${selectedCategory}`
				: "";
			const searchFilter = searchQuery ? `&title=${searchQuery}` : "";

			const response = await axios.get<{
				results: Task[];
				page: number;
				totalPages: number;
			}>(
				`http://localhost:3000/v1/tasks?page=${currentPage}&limit=${itemsPerPage}&${sortQuery}${categoryFilter}${searchFilter}`
			);
			console.log(response.data.results);

			setTasks(response.data.results);
			setTotalPages(response.data.totalPages);
		} catch (err) {
			console.error("Failed to fetch tasks:", err);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get<{
				results: { id: string; name: string }[];
			}>("http://localhost:3000/v1/categories");
			setCategories(response.data.results);
		} catch (err) {
			console.error("Failed to fetch categories:", err);
		}
	};

	const handleSort = (field: string) => {
		const isAsc = sortConfig.field === field ? !sortConfig.asc : true;
		setSortConfig({ field, asc: isAsc });
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setCurrentPage(1);
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleItemsPerPageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
		setCurrentPage(1);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
	};

	// Handle adding a new category
	const handleAddCategory = async () => {
		if (!newCategoryName.trim()) {
			setCategoryError("Category name cannot be empty");
			return;
		}
		try {
			const response = await axios.post("http://localhost:3000/v1/categories", {
				name: newCategoryName,
			});
			setCategories((prev) => [...prev, response.data]); // Add new category to the list
			setNewCategoryName(""); // Reset input
			setCategoryError(""); // Clear error
		} catch (err) {
			console.error("Failed to add category:", err);
			setCategoryError("Failed to add category. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow">
				<div className="container mx-auto p-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<button
						onClick={handleLogout}
						className="bg-red-500 text-white px-4 py-2 rounded-md"
					>
						<span className="inline-grid">Logout</span>
					</button>
				</div>
			</header>
			<main className="container mx-auto p-4">
				<div className="grid grid-cols-2 gap-4 p-4">
					<div className="">
						<div className="flex justify-between items-center">
							<CategoryFilter
								categories={categories}
								selectedCategory={selectedCategory}
								setSelectedCategory={handleCategoryChange}
							/>
							<div>
								<button
									onClick={() => handleSort("priority")}
									className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
								>
									Sort by Priority{" "}
									{sortConfig.field === "priority" &&
										(sortConfig.asc ? "▲" : "▼")}
								</button>
								<button
									onClick={() => handleSort("dueDate")}
									className="bg-green-500 text-white px-4 py-2 rounded-md"
								>
									Sort by Due Date{" "}
									{sortConfig.field === "dueDate" &&
										(sortConfig.asc ? "▲" : "▼")}
								</button>
							</div>
						</div>

						<div className="mt-6">
							<input
								type="text"
								placeholder="Search tasks"
								value={searchQuery}
								onChange={handleSearchChange}
								className="px-4 py-2 border rounded-md w-full mb-4"
							/>
							{tasks.map((task) => (
								<TaskItem
									key={task.id}
									task={task}
									onUpdate={(updatedTask) =>
										setTasks((prev) =>
											prev.map((t) =>
												t.id === updatedTask.id ? updatedTask : t
											)
										)
									}
									onDelete={() => fetchTasks()}
								/>
							))}
						</div>
						{tasks.length === 0 && (
							<p className="text-center text-gray-500 mt-4">
								No tasks available. Add a new task to get started!
							</p>
						)}

						{/* Pagination Controls */}
						<div className="flex items-center justify-between">
							<select
								value={itemsPerPage}
								onChange={handleItemsPerPageChange}
								className="px-4 py-2 border rounded-md bg-white"
							>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={50}>50</option>
							</select>
							<div className="flex justify-center items-center mt-4">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="px-4 py-2 bg-gray-300 rounded-md mr-2 disabled:opacity-50"
								>
									<GrFormPrevious />
								</button>
								<span className="text-lg">
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="px-4 py-2 bg-gray-300 rounded-md ml-2 disabled:opacity-50"
								>
									<GrFormNext />
								</button>
							</div>
						</div>
					</div>
					<div className="">
						{/* Add Category Section */}
						<div className="mb-4 bg-white p-4 rounded-md shadow-md">
							<h2 className="text-xl font-bold mb-2">Add New Category</h2>
							<input
								type="text"
								placeholder="Category name"
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								className="px-4 py-2 border rounded-md w-full mb-2"
							/>
							{categoryError && <p className="text-red-500">{categoryError}</p>}
							<button
								onClick={handleAddCategory}
								className="bg-blue-500 text-white px-4 py-2 rounded-md"
							>
								Add Category
							</button>
						</div>
						{/* Task form */}
						<TaskForm onTaskAdd={() => fetchTasks()} categories={categories} />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
