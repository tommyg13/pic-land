import { Image } from "../../types";
import { Link } from "react-router-dom";
import { MasonryItems } from "../MasonryLaout";

type Props = {
  image: Image;
  itemPositions: MasonryItems;
};

const ImageCard = ({ image, itemPositions }: Props) => {
  const styles = itemPositions
    ? {
        transform: `translateX(${itemPositions?.x}) translateY(${itemPositions?.y})`,
        left: 0,
        top: 0,
        height: itemPositions.height,
      }
    : {};

  return (
    <Link
      to={`/images/${image._id}`}
      className={`masonry-item masonry-item-${image._id}`}
      style={styles}
    >
      <img loading="lazy" alt={image._id} src={image.url} />
      <p>{image.description}</p>
    </Link>
  );
};

export default ImageCard;
