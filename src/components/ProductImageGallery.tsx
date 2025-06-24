
import React from "react";

interface Props {
  images: string[];
  alt?: string;
  className?: string;
}

const ProductImageGallery: React.FC<Props> = ({ images, alt, className }) => {
  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg h-32 w-32 ${className}`}>
        <span className="text-gray-400 text-xs">لا توجد صور</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt || ""}
        className={`object-cover rounded-lg ${className || 'w-full h-64'}`}
      />
    );
  }

  return (
    <div className={`grid gap-1 ${className}`}>
      <img
        src={images[0]}
        alt={alt || ""}
        className="object-cover rounded-lg w-full h-24"
      />
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-1">
          {images.slice(1, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={alt || ""}
              className="object-cover rounded w-full h-12"
            />
          ))}
        </div>
      )}
      {images.length > 3 && (
        <div className="text-xs text-center text-gray-500 mt-1">
          +{images.length - 3} صور أخرى
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
