
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-l from-primary-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              أفضل المنتجات
              <span className="text-primary block">بأسعار منافسة</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              اكتشف مجموعة واسعة من المنتجات عالية الجودة مع خدمة توصيل سريعة 
              وضمان الجودة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary-700 text-white px-8 py-3 text-lg">
                تسوق الآن
                <ShoppingBag className="mr-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                تصفح العروض
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                alt="منتجات متنوعة"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12">
                خصم 30%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">شحن مجاني</h3>
              <p className="text-gray-600">شحن مجاني للطلبات أكثر من 200 ريال</p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">ضمان الجودة</h3>
              <p className="text-gray-600">ضمان استرداد الأموال خلال 30 يوماً</p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">دعم 24/7</h3>
              <p className="text-gray-600">خدمة عملاء متاحة على مدار الساعة</p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">منتجات أصلية</h3>
              <p className="text-gray-600">جميع المنتجات أصلية ومضمونة الجودة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
