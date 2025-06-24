
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCardWithHover from './ProductCardWithHover';
import QuickViewModal from './QuickViewModal';

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

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, categoryId }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  const fetchRelatedProducts = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name_ar)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', currentProductId)
      .limit(4);

    if (error) {
      console.error('Error fetching related products:', error);
    } else {
      setRelatedProducts(data || []);
    }
    setLoading(false);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">جاري تحميل المنتجات المشابهة...</div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          منتجات قد تعجبك
        </h2>
        <p className="text-gray-600">
          منتجات مشابهة من نفس الفئة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCardWithHover
            key={product.id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default RelatedProducts;
