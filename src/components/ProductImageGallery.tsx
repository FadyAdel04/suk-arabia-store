
import React from "react";

interface Props {
  images: string[];
  alt?: string;
  className?: string;
}

const ProductImageGallery: React.FC<Props> = ({ images, alt, className }) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 flex items-center justify-center rounded-lg h-64 w-full">
        <span className="text-gray-400">لا توجد صور</span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(images.length, 4)} gap-2 ${className}`}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={alt || ""}
          className="object-cover rounded-lg w-full h-64"
        />
      ))}
    </div>
  );
};

export default ProductImageGallery;
