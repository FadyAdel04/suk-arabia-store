
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, ShoppingBag, Truck, Shield, Headphones, Star, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 ml-2" />
              أفضل عروض 2024
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              تسوق بذكاء
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                وفر أكثر
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار لا تُقاوم. 
              خدمة توصيل سريعة وضمان الجودة مع كل طلب.
            </p>

            {/* Interactive Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">منتج متنوع</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">خدمة عملاء</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-purple-600">48h</div>
                <div className="text-sm text-gray-600">توصيل سريع</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  تسوق الآن
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/offers">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  العروض الخاصة
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image with Interactive Elements */}
          <div className="relative animate-scale-in">
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
              {/* Floating Badges */}
              <div className="absolute -top-6 -right-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg transform rotate-12 shadow-lg animate-bounce">
                خصم 40%
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-medium transform -rotate-12 shadow-lg">
                شحن مجاني
              </div>
              
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                alt="منتجات متنوعة"
                className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
              
              {/* Interactive Product Cards */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg animate-pulse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">منتج اليوم</div>
                    <div className="text-xs text-gray-600">خصم خاص</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">شحن سريع</h3>
              <p className="text-gray-600">توصيل مجاني للطلبات أكثر من 500 جنيه</p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">ضمان الجودة</h3>
              <p className="text-gray-600">ضمان استرداد الأموال خلال 30 يوماً</p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Headphones className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">دعم 24/7</h3>
              <p className="text-gray-600">خدمة عملاء متاحة على مدار الساعة</p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Star className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-yellow-600 transition-colors">منتجات أصلية</h3>
              <p className="text-gray-600">جميع المنتجات أصلية ومضمونة الجودة</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
