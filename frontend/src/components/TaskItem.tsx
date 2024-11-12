import { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaCheck, FaCross, FaSave } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

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
	priority: 1 | 2 | 3;
}

interface TaskItemProps {
	task: Task;
	onUpdate: (updatedTask: Task) => void;
	onDelete: (taskId: string) => void;
}

const humanReadableDate = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// For a single date
const formatDate = (isoDate: string) => {
	const date = new Date(isoDate);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

	// Fetch categories from the server
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get("http://localhost:3000/v1/categories");
				setCategories(response.data.results); // Assuming response.data.results contains the category list
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
		<div className="p-4 bg-white rounded-md shadow-md mb-4 flex justify-between items-center gap-20">
			<div>
				{editMode ? (
					<div>
						<input
							type="text"
							value={updatedTask.title}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, title: e.target.value })
							}
							className="text-lg font-medium border rounded-md p-1 w-full"
						/>
						<input
							value={updatedTask.description}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, description: e.target.value })
							}
							placeholder="Description"
							className="mt-2 p-2 border rounded-md w-full" // Tailwind class for 50% width
						/>

						<input
							type="date"
							value={formatDate(updatedTask.dueDate)}
							onChange={(e) =>
								setUpdatedTask({ ...updatedTask, dueDate: e.target.value })
							}
							className="mt-2 p-2 border rounded-md mr-1"
						/>
						<select
							value={updatedTask.categoryId || ""} // Handle cases where categoryId is null
							onChange={(e) =>
								setUpdatedTask({
									...updatedTask,
									categoryId: e.target.value || null, // Store only category ID
								})
							}
							className="mt-2 p-2 border rounded-md mr-1"
						>
							<option value="">Select Category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						{/* <select
							value={updatedTask.categoryId?.id || ""} // Set the existing category as selected
							onChange={(e) =>
								setUpdatedTask({
									...updatedTask,
									categoryId:
										categories.find(
											(category) => category.id === e.target.value
										) || null,
								})
							}
							className="mt-2 p-2 border rounded-md mr-1"
						>
							<option value="">Select Category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select> */}
						<select
							value={updatedTask.priority}
							onChange={(e) =>
								setUpdatedTask({
									...updatedTask,
									priority: parseInt(e.target.value) as 1 | 2 | 3,
								})
							}
							className="mt-2 p-2 border rounded-md"
						>
							<option value={1}>Low</option>
							<option value={2}>Medium</option>
							<option value={3}>High</option>
						</select>
					</div>
				) : (
					<div>
						<h3
							className={`text-lg font-medium ${
								task.isCompleted ? "line-through text-gray-500" : ""
							}`}
						>
							{!editMode ? (
								<>
									<input
										type="checkbox"
										checked={task.isCompleted}
										onChange={handleCompletionToggle}
										className="mr-2"
									/>
								</>
							) : null}
							{task.title}
							{task.priority && (
								<span
									className={`ml-2 text-xs px-2 py-0.4 rounded-full font-semibold ${
										task.priority === 3
											? "bg-red-500 text-white"
											: task.priority === 2
											? "bg-yellow-500 text-white"
											: "bg-green-500 text-white"
									}`}
								>
									{task.priority === 3
										? "High"
										: task.priority === 2
										? "Medium"
										: "Low"}
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
							Due: {humanReadableDate(task.dueDate)}
						</p>
					</div>
				)}
			</div>

			<div className="space-x-2 flex items-center">
				{editMode ? (
					<>
						<button
							onClick={handleSave}
							className="bg-green-500 text-white px-2 py-2 rounded-md"
						>
							<FaCheck />
						</button>
						<button
							onClick={handleCancel}
							className="bg-gray-500 text-white px-2 py-2 rounded-md"
						>
							<RxCross2 />
						</button>
					</>
				) : (
					<>
						<button
							onClick={handleEdit}
							className="bg-yellow-500 text-white px-2 py-2 rounded-md"
						>
							<HiOutlinePencilAlt />
						</button>
						<button
							onClick={handleDelete}
							className="bg-red-500 text-white px-2 py-2 rounded-md"
						>
							<RiDeleteBin6Line />
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default TaskItem;
