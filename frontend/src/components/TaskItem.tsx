import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
	id: string;
	name: string;
}
interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	categoryId: null | Category;
	isCompleted: boolean;
	priority: "high" | "medium" | "low";
}

interface TaskItemProps {
	task: Task;
	onUpdate: (updatedTask: Task) => void;
	onDelete: (taskId: string) => void;
}

const formatDate = (isoDate) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
	const [categories, setCategories] = useState<string[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

	// Fetch categories from the server
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get("http://localhost:3000/v1/categories");

				setCategories(response.data);
			} catch (err) {
				console.error("Failed to fetch categories:", err);
			}
		};
		fetchCategories();
	}, []);

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = async () => {
		try {
			// Create a new object excluding the `id` property
			const { id, ...taskData } = updatedTask;
			const response = await axios.patch<Task>(
				`http://localhost:3000/v1/tasks/${task.id}`,
				taskData
			);
			onUpdate(response.data);
			setEditMode(false);
		} catch (err) {
			console.error("Failed to update task:", err);
			alert("Failed to update task. Please try again.");
		}
	};

	const handleCancel = () => {
		setEditMode(false);
		setUpdatedTask({ ...task });
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this task?")) {
			try {
				await axios.delete(`http://localhost:3000/v1/tasks/${task.id}`);
				onDelete(task.id);
			} catch (err) {
				console.error("Failed to delete task:", err);
				alert("Failed to delete task. Please try again.");
			}
		}
	};

	const handleCompletionToggle = async () => {
		try {
			const updatedStatus = !task.isCompleted;
			const response = await axios.patch<Task>(
				`http://localhost:3000/v1/tasks/${task.id}`,
				{
					isCompleted: updatedStatus,
				}
			);
			onUpdate(response.data);
		} catch (err) {
			console.error("Failed to update task status:", err);
			alert("Failed to update task status. Please try again.");
		}
	};
	return (
		<div className="p-4 bg-white rounded-md shadow-md mb-4 flex justify-between items-center">
			<div>
				{editMode ? (
					<div>
						<input
							type="text"
							value={updatedTask.title}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, title: e.target.value })
							}
							className="text-lg font-medium border rounded-md p-1"
						/>
						<textarea
							value={updatedTask.description}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, description: e.target.value })
							}
							placeholder="Description"
							className="mt-2 p-2 border rounded-md w-full"
						/>
						<input
							type="date"
							value={updatedTask.dueDate}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, dueDate: e.target.value })
							}
							className="mt-2 p-2 border rounded-md"
						/>
						<select
							value={updatedTask.categoryId}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, categoryId: e.target.value })
							}
							className="mt-2 p-2 border rounded-md"
						>
							<option value="">Select Category</option>
							{categories.results.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				) : (
					<div>
						<h3
							className={`text-lg font-medium ${
								task.isCompleted ? "line-through text-gray-500" : ""
							}`}
						>
							{task.title}
							{task.priority && (
								<span
									className={`ml-2 text-xs px-2 py-0.4 rounded-full font-semibold ${
										task.priority === "high"
											? "bg-red-500 text-white"
											: task.priority === "medium"
											? "bg-yellow-500 text-white"
											: "bg-green-500 text-white"
									}`}
								>
									{task.priority}
								</span>
							)}
						</h3>

						<p className="text-sm text-gray-600">{task.description}</p>
						{task.categoryId && (
							<p className="text-sm text-gray-600">
								Category: <b>{task.categoryId.name}</b>
							</p>
						)}

						<p className="text-sm text-gray-600">
							Due: {formatDate(task.dueDate)}
						</p>
					</div>
				)}
			</div>

			<div className="space-x-2 flex items-center">
				{!editMode ? (
					<>
						<input
							type="checkbox"
							checked={task.isCompleted}
							onChange={handleCompletionToggle}
							className="mr-2"
						/>
						<span className="text-sm text-gray-600">
							{task.isCompleted ? "Done" : "To-Do"}
						</span>
					</>
				) : null}

				{editMode ? (
					<>
						<button
							onClick={handleSave}
							className="bg-green-500 text-white px-2 py-1 rounded-md"
						>
							Save
						</button>
						<button
							onClick={handleCancel}
							className="bg-gray-500 text-white px-2 py-1 rounded-md"
						>
							Cancel
						</button>
					</>
				) : (
					<>
						<button
							onClick={handleEdit}
							className="bg-yellow-500 text-white px-2 py-1 rounded-md"
						>
							Edit
						</button>
						<button
							onClick={handleDelete}
							className="bg-red-500 text-white px-2 py-1 rounded-md"
						>
							Delete
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default TaskItem;
