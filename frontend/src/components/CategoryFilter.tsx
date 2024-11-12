import { FC } from "react";

type Props = {
	categories: any[];
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
};
const CategoryFilter: FC<Props> = ({
	categories,
	selectedCategory,
	setSelectedCategory,
}) => (
	<select
		className="p-2 border border-gray-300 rounded-md bg-white"
		value={selectedCategory}
		onChange={(e) => setSelectedCategory(e.target.value)}
	>
		<option value="">All Categories</option>
		{categories.map((category) => (
			<option key={category._id} value={category.id}>
				{category.name}
			</option>
		))}
	</select>
);

export default CategoryFilter;
