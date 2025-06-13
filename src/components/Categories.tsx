
import React from 'react';
import { Laptop, Smartphone, Camera, Headphones, Watch, Tablet } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'أجهزة كمبيوتر',
      icon: Laptop,
      count: 245,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      name: 'هواتف ذكية',
      icon: Smartphone,
      count: 189,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 3,
      name: 'كاميرات',
      icon: Camera,
      count: 76,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 4,
      name: 'سماعات',
      icon: Headphones,
      count: 134,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 5,
      name: 'ساعات ذكية',
      icon: Watch,
      count: 92,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 6,
      name: 'أجهزة لوحية',
      icon: Tablet,
      count: 67,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            تصفح حسب الفئة
          </h2>
          <p className="text-xl text-gray-600">
            اختر من مجموعة واسعة من الفئات المتنوعة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer animate-fade-in hover-scale"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} منتج</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
