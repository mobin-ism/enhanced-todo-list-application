import { useState } from "react";
import axiosInstance from "../utils/axios-instance";
import { FiPlus } from "react-icons/fi";
import { Task } from "../types/types";

interface Category {
	id: string;
	name: string;
}
interface TaskFormProps {
	onTaskAdd: (task: Task) => void;
	categories: Category[];
}

interface TaskPayload {
	title: string;
	description?: string;
	dueDate: string;
	priority: number;
	categoryId?: string | null; // Optional field
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdd, categories }) => {
	const getTodayDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const [title, setTitle] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState(getTodayDate()); // Default to today's date
	const [priority, setPriority] = useState(1);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Dynamically build the payload
		const payload: TaskPayload = {
			title,
			description,
			dueDate,
			priority,
		};

		if (category) {
			payload.categoryId = category ? category : "";
		}

		try {
			const response = await axiosInstance.post("/tasks", payload);
			onTaskAdd(response.data);

			// Reset form fields
			setTitle("");
			setCategory(null);
			setDescription("");
			setDueDate(getTodayDate()); // Reset to today's date
			setPriority(1);
		} catch (err) {
			console.error("Failed to add task:", err);
			alert("Failed to add task. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
			<p className="text-xl font-bold mb-2">Add New Task</p>
			<div className="mb-4 flex space-x-4">
				<div className="basis-1/2">
					<label className="block text-sm font-medium text-gray-700">
						Task To Do
					</label>
					<input
						type="text"
						required
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter task title"
					/>
				</div>
				<div className="basis-1/2">
					<label className="block text-sm font-medium text-gray-700">
						Priority
					</label>
					<select
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
						value={priority}
						onChange={(e) => setPriority(parseInt(e.target.value))}
					>
						<option value="3">High</option>
						<option value="2">Medium</option>
						<option value="1">Low</option>
					</select>
				</div>
			</div>
			<div className="mb-4 flex space-x-4">
				<div className="basis-1/2">
					<label className="block text-sm font-medium text-gray-700">
						Category
					</label>
					<select
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
						value={category || ""}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="">Select a category</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</div>
				<div className="basis-1/2">
					<label className="block text-sm font-medium text-gray-700">
						Due Date
					</label>
					<input
						type="date"
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
					/>
				</div>
			</div>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md flex flex-row items-center outline outline-1 outline-blue-300"
			>
				<FiPlus /> &nbsp;Add New Task
			</button>
		</form>
	);
};

export default TaskForm;
