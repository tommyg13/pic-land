import FetchComponent from "../components/categories/FetchComponent";
import { useGetImageQuery } from "../redux/images/imageSlice";
import { useParams } from "react-router-dom";

const Image = () => {
  const { id } = useParams();

  const { data: image, isFetching } = useGetImageQuery(id);
  return <FetchComponent loading={isFetching}>{image?._id}</FetchComponent>;
};

export default Image;
