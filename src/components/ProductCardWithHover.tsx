
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Star, Eye } from 'lucide-react';

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  category?: {
    name_ar: string;
  };
}

interface ProductCardWithHoverProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCardWithHover: React.FC<ProductCardWithHoverProps> = ({ product, onQuickView }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const imageGallery = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : ['/placeholder.svg'];

  const handleMouseEnter = () => {
    if (imageGallery.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageGallery.length);
      }, 800);
      
      // Store interval in a way that can be cleared on mouse leave
      (document.querySelector(`[data-product-id="${product.id}"]`) as any)._interval = interval;
    }
  };

  const handleMouseLeave = () => {
    const element = document.querySelector(`[data-product-id="${product.id}"]`) as any;
    if (element?._interval) {
      clearInterval(element._interval);
      element._interval = null;
    }
    setCurrentImageIndex(0);
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
      data-product-id={product.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageGallery[currentImageIndex]}
            alt={product.name_ar}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Quick View Button */}
        <Button
          size="sm"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => onQuickView(product)}
        >
          عرض سريع
        </Button>

        {product.is_featured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
            <Star className="h-3 w-3 ml-1" />
            مميز
          </Badge>
        )}
        {product.original_price && (
          <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
            خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
          </Badge>
        )}

        {/* Image indicator dots for multiple images */}
        {imageGallery.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 space-x-reverse">
            {imageGallery.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {product.category && (
          <div className="mb-2">
            <span className="text-xs text-blue-600 font-medium">
              {product.category.name_ar}
            </span>
          </div>
        )}
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name_ar}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description_ar}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-600">
              {product.price.toLocaleString()} جنيه
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                {product.original_price.toLocaleString()} جنيه
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            متوفر: {product.stock_quantity}
          </div>
        </div>

        <div className="flex space-x-2 space-x-reverse">
          <Button
            onClick={() => addToCart(product.id)}
            className="flex-1"
            disabled={product.stock_quantity === 0}
          >
            {product.stock_quantity === 0 ? (
              'نفدت الكمية'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 ml-2" />
                أضف للسلة
              </>
            )}
          </Button>
          <Button variant="outline" size="default" onClick={() => onQuickView(product)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardWithHover;
