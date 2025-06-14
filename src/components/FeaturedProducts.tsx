import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

  useEffect(() => {
    fetchFeaturedProducts();
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
          <Carousel className="relative">
            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="basis-full md:basis-1/2 lg:basis-1/4">
                  <Card className="group hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale overflow-hidden">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
