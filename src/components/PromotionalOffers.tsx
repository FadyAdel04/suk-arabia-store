import React from 'react';
import { Button } from './ui/button';
import { Clock, Gift, Zap, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
const PromotionalOffers = () => {
  return <section className="py-16 bg-white">
      {/* OFFERS BANNER */}
      <div className="relative rounded-2xl overflow-hidden mb-12 animate-fade-in" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80")',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-900/70 to-blue-600/60" />
        {/* Banner Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-14">
          <div className="text-center md:text-right flex-1">
            <div className="inline-flex items-center mb-4">
              <Percent className="h-7 w-7 text-yellow-400 mr-2 animate-pulse" />
              <span className="font-bold text-lg text-white">عروض صيف 2025 الحصرية</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              خصومات تصل حتى 50%<br className="hidden sm:inline" />
              على إلكترونيات ومنتجات محددة!
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 mb-6 max-w-xl">
              اغتنم الفرصة الآن ولا تفوت العروض الحصرية لفترة محدودة فقط.
            </p>
            <Link to="/offers">
              <Button size="lg" className="bg-yellow-400 text-blue-900 font-bold text-lg hover:bg-yellow-300 transition shadow-md">
                تصفح العروض
                <Clock className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </Link>
          </div>
          <div className="hidden md:block flex-1 text-center">
            <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80" alt="صورة عرض الكترونيات" className="rounded-xl object-cover w-full max-w-xs shadow-xl ring-4 ring-white/30 animate-scale-in" loading="lazy" draggable={false} />
          </div>
        </div>
      </div>
      {/* END OFFERS BANNER */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            العروض الحصرية
          </h2>
          <p className="text-xl text-gray-600">
            لا تفوت فرصة الحصول على أفضل العروض لفترة محدودة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Offer */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-l from-primary-600 to-primary-700 rounded-2xl p-8 text-white overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-6 w-6" />
                  <span className="font-semibold">عرض لفترة محدودة</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  خصم يصل إلى 50%
                </h3>
                <p className="text-xl mb-6 opacity-90">
                  على مجموعة مختارة من أجهزة الكمبيوتر المحمولة والإلكترونيات
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm opacity-75">ساعة</div>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm opacity-75">دقيقة</div>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">30</div>
                    <div className="text-sm opacity-75">ثانية</div>
                  </div>
                </div>
                <Button className="bg-white text-primary hover:bg-gray-100 font-bold">
                  تسوق الآن
                </Button>
              </div>
              <div className="absolute -left-20 -bottom-20 opacity-10">
                <div className="w-40 h-40 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Side Offers */}
          <div className="space-y-6">
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <Gift className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">شحن مجاني</h4>
              <p className="text-gray-600 mb-4">
                شحن مجاني لجميع الطلبات أكثر من 200 ريال
              </p>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                اطلب الآن
              </Button>
            </div>

            <div className="bg-orange-100 rounded-xl p-6 text-center">
              <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">صفقة اليوم</h4>
              <p className="text-gray-600 mb-4">
                خصم 25% على الهواتف الذكية
              </p>
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                اكتشف المزيد
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PromotionalOffers;