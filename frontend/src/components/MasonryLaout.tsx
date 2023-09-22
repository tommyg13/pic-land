import { useEffect, useState } from "react";
import ImageCard from "../components/images/ImageCard";
import { Image } from "../types";

type Props = {
  images: Image[];
};

export type MasonryItems = {
  x: string;
  y: string;
  height: number;
};

const MasonryLayout = ({ images }: Props) => {
  const [itemPositions, setItemPositions] = useState<MasonryItems[]>([]);
  const [columns, setColumns] = useState(0);

  useEffect(() => {
    const updateColumns = () => {
      const containerWidth =
        document.querySelector(".masonry-parent")?.clientWidth || 1200;
      const itemWidth = 252;
      const newColumns = Math.floor(containerWidth / itemWidth);

      setColumns(newColumns);
    };

    window.addEventListener("resize", updateColumns);
    updateColumns();

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  useEffect(() => {
    if (images?.length && columns > 0) {
      const positions: number[] = new Array(columns).fill(0);
      const itemPositions: MasonryItems[] = [];

      images.forEach((image) => {
        const columnIndex = positions.indexOf(Math.min(...positions));
        const left = columnIndex * 252 + 111;
        const top = positions[columnIndex];
        const height =
          document.querySelector(`.masonry-item-${image._id}`)?.clientHeight ||
          0;

        positions[columnIndex] += height + 20;
        itemPositions.push({
          x: `${left}px`,
          y: `${top}px`,
          height,
        });
      });

      setItemPositions(itemPositions);
    }
  }, [columns, images]);

  return (
    <div className="masonry-parent">
      <div className="masonry-grid cards-container">
        {images?.map((image, index) => (
          <ImageCard
            key={image._id}
            image={image}
            itemPositions={itemPositions[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default MasonryLayout;
