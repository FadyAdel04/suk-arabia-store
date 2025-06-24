
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  category: {
    name_ar: string;
  };
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const imageGallery = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : ['/placeholder.svg'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">{product.name_ar}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={imageGallery[0]}
              alt={product.name_ar}
              className="w-full h-80 object-cover rounded-lg"
            />
            {product.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                <Star className="h-3 w-3 ml-1" />
                مميز
              </Badge>
            )}
            {product.original_price && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <span className="text-sm text-blue-600 font-medium">
                {product.category?.name_ar}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {product.name_ar}
              </h2>
            </div>

            <p className="text-gray-700">
              {product.description_ar}
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-2xl font-bold text-blue-600">
                  {product.price.toLocaleString()} جنيه
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.original_price.toLocaleString()} جنيه
                  </span>
                )}
              </div>
              <div className="text-gray-600">
                المخزون المتاح: {product.stock_quantity}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  addToCart(product.id);
                  onClose();
                }}
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
              <Link to={`/product/${product.id}`}>
                <Button variant="outline" onClick={onClose}>
                  عرض التفاصيل
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
