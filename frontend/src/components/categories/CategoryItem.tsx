import { Link } from "react-router-dom";
import { Category } from "../../types";

type ListProps = {
  category: Category;
};

const CategoryItem = ({ category }: ListProps) => {
  return (
    <Link
      to={`categories/${category.name.toLowerCase()}`}
      className={`category-item ${
        category.featured ? "category-featured" : ""
      }`}
    >
      <div className="category-bg-wrapper">
        <img src={category.image} className="category-bg" alt={category.name} />
      </div>
      <p>{category.name}</p>
    </Link>
  );
};

export default CategoryItem;
