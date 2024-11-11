import { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskAdd, categories }) => {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newTask = { title, category, description, dueDate, priority };

		try {
			const response = await axios.post("http://localhost:3000/v1/tasks", {
				title: newTask.title,
				categoryId: newTask.category,
				description: newTask.description,
				dueDate: newTask.dueDate,
				priority: newTask.priority,
			});
			onTaskAdd(response.data);

			// Reset form fields
			setTitle("");
			setCategory("");
			setDescription("");
			setDueDate("");
			setPriority("");
		} catch (err) {
			console.error("Failed to add task:", err);
			alert("Failed to add task. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">Title</label>
				<input
					type="text"
					className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Category
				</label>
				<select
					className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="">Select a category</option>
					{categories.map((cat) => (
						<option key={cat._id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows="3"
				/>
			</div>
			<div className="mb-4">
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
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Priority
				</label>
				<select
					className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
					value={priority}
					onChange={(e) => setPriority(e.target.value)}
				>
					<option value="">Select Priority</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
			</div>
			<button
				type="submit"
				className="w-full bg-blue-500 text-white p-2 rounded-md"
			>
				Add Task
			</button>
		</form>
	);
};

export default TaskForm;
