
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Clock, Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  original_price: number;
  image_url: string;
  stock_quantity: number;
}

const Offers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('original_price', 'is', null)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">جاري تحميل العروض...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            العروض والخصومات
          </h1>
          <p className="text-xl text-gray-600">
            اكتشف أفضل العروض والخصومات الحصرية
          </p>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">عرض محدود!</h2>
          <p className="text-xl mb-6">خصومات تصل إلى 50% على منتجات مختارة</p>
          <div className="flex items-center justify-center space-x-4 space-x-reverse text-lg">
            <Clock className="h-6 w-6" />
            <span>ينتهي العرض قريباً</span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لا توجد عروض متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-red-500 text-white">
                    خصم {calculateDiscount(product.price, product.original_price)}%
                  </Badge>
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name_ar}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white flex items-center">
                      <Star className="h-3 w-3 ml-1" />
                      مميز
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name_ar}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description_ar}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString()} جنيه
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.original_price.toLocaleString()} جنيه
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      متوفر: {product.stock_quantity}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="w-full group-hover:bg-blue-700 transition-colors"
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            اشترك في النشرة الإخبارية
          </h3>
          <p className="text-gray-600 mb-6">
            احصل على إشعارات فورية بأحدث العروض والخصومات
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="rounded-r-lg">اشتراك</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
