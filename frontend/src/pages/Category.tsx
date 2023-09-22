import FetchComponent from "../components/categories/FetchComponent";
import { useGetCategoryQuery } from "../redux/images/imageSlice";
import { useParams } from "react-router-dom";
import MasonryLayout from "../components/MasonryLaout";

const Category = () => {
  const { category } = useParams();

  const { data: images, isFetching } = useGetCategoryQuery(category);
  return (
    <FetchComponent loading={isFetching}>
      <MasonryLayout images={images || []} />
    </FetchComponent>
  );
};

export default Category;
