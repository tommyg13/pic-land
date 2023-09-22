import { useGetImagesQuery } from "../redux/images/imageSlice";
import FetchComponent from "../components/categories/FetchComponent";
import Categories from "../components/categories/Categories";
import { testCategories } from "../test/images";
import MasonryLaout from "../components/MasonryLaout";

const Home = () => {
  const { data: images, isFetching } = useGetImagesQuery();

  return (
    <FetchComponent loading={isFetching}>
      <Categories categories={testCategories} />
      <MasonryLaout images={images || []} />
    </FetchComponent>
  );
};

export default Home;
