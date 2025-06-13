
import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'لابتوب ديل XPS 13',
      price: 4999,
      originalPrice: 5999,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      category: 'إلكترونيات',
      isNew: true,
      discount: 17
    },
    {
      id: 2,
      name: 'ساعة ذكية آبل واتش',
      price: 1299,
      originalPrice: 1599,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      category: 'إكسسوارات',
      isNew: false,
      discount: 19
    },
    {
      id: 3,
      name: 'سماعات بوز اللاسلكية',
      price: 899,
      originalPrice: 1099,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      category: 'صوتيات',
      isNew: false,
      discount: 18
    },
    {
      id: 4,
      name: 'كاميرا كانون EOS R5',
      price: 12999,
      originalPrice: 14999,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      category: 'تصوير',
      isNew: true,
      discount: 13
    },
    {
      id: 5,
      name: 'هاتف سامسونج جالاكسي S24',
      price: 3499,
      originalPrice: 3999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      category: 'هواتف',
      isNew: false,
      discount: 13
    },
    {
      id: 6,
      name: 'تابلت آيباد برو',
      price: 4199,
      originalPrice: 4799,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      category: 'تابلت',
      isNew: true,
      discount: 13
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-SA') + ' ريال';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            المنتجات المميزة
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف أحدث المنتجات والعروض الحصرية المختارة خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
                        جديد
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-sm text-primary font-medium mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary hover:bg-primary-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  أضف للسلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            عرض جميع المنتجات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
