import { CategoriesProps } from "../../types";
import CategoryItem from "./CategoryItem";
import "../../styles/categories.css";

const Categories = ({ categories }: CategoriesProps) => {
  const featured = categories.filter((el) => el.featured);
  const restCategories = categories.filter((el) => !el.featured);

  return (
    <div className="categories-container">
      <div className="categories-inner featured-wrapper">
        {featured.map((category) => (
          <CategoryItem category={category} />
        ))}
      </div>
      <div className="categories-inner">
        {restCategories.map((category) => (
          <CategoryItem category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
