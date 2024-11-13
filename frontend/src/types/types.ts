export interface Task {
	id?: string;
	title: string;
	description: string;
	dueDate: string;
	category?: string;
	categoryId?: null | Category;
	isCompleted: boolean;
	priority: 1 | 2 | 3;
}
export interface Category {
	id: string;
	name: string;
}
