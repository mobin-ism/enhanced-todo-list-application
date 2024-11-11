const CategoryFilter = ({
	categories,
	selectedCategory,
	setSelectedCategory,
}) => (
	<div className="mb-4">
		<select
			className="p-2 border border-gray-300 rounded-md"
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
	</div>
);

export default CategoryFilter;
