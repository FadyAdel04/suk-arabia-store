import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Eye, ArrowLeft } from 'lucide-react';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  original_price: number;
  image_url: string;
  stock_quantity: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    fetchFeaturedProducts();
    // Subscribe to stock changes and refetch on update
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => fetchFeaturedProducts()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching featured products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">جاري تحميل المنتجات المميزة...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            المنتجات المميزة
          </h2>
          <p className="text-xl text-gray-600">
            اكتشف مجموعة منتقاة من أفضل منتجاتنا
          </p>
        </div>
        {products.length <= 4 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale overflow-hidden"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name_ar}
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                    <Star className="h-3 w-3 ml-1" />
                    مميز
                  </Badge>
                  {product.original_price && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
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
                    <Link to={`/product/${product.id}`}>
                      <Button variant="outline" size="default">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              navigation={{
                prevEl: '.swiper-button-next',
                nextEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="py-4"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <Card className="group hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale overflow-hidden h-full">
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name_ar}
                          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                        <Star className="h-3 w-3 ml-1" />
                        مميز
                      </Badge>
                      {product.original_price && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
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
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="default">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 transform bg-gray-200 p-5 rounded shadow-md hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next absolute right-0 top-1/2 z-10 -translate-y-1/2 transform bg-gray-200 p-5 rounded shadow-md hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination */}
            <div className="swiper-pagination mt-4 mb-14 flex justify-center space-x-2"></div>
            
            {/* View All Products Button */}
            <div className="text-center mt-8">
              <Link to="/shop">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  <ArrowLeft className="h-5 w-5 ml-2" />
                  عرض جميع المنتجات
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
