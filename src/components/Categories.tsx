
import React, { useEffect, useState } from 'react';
import { Laptop, Smartphone, Camera, Headphones, Watch, Tablet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const categoryIconMap: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  'أجهزة كمبيوتر': { icon: Laptop, color: 'bg-blue-100 text-blue-600' },
  'هواتف ذكية': { icon: Smartphone, color: 'bg-green-100 text-green-600' },
  'كاميرات': { icon: Camera, color: 'bg-purple-100 text-purple-600' },
  'سماعات': { icon: Headphones, color: 'bg-orange-100 text-orange-600' },
  'ساعات ذكية': { icon: Watch, color: 'bg-red-100 text-red-600' },
  'أجهزة لوحية': { icon: Tablet, color: 'bg-teal-100 text-teal-600' },
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    // Fetch categories from DB, then count products per category
    supabase
      .from('categories')
      .select('*')
      .then((res) => {
        setCategories(res.data);
        countProductsPerCategory(res.data);
      });
  }, []);

  const countProductsPerCategory = async (cats) => {
    const cpy = {};
    for (const cat of cats) {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true);
      cpy[cat.id] = count || 0;
    }
    setProductCounts(cpy);
  };

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
          {categories.map((category) => {
            const config = categoryIconMap[category.name_ar] || {
              icon: Laptop,
              color: 'bg-blue-100 text-blue-600',
            };
            const Icon = config.icon;
            const color = config.color;
            return (
              <div
                key={category.id}
                className="group cursor-pointer animate-fade-in hover-scale"
                style={{ animationDelay: '0ms' }}
              >
                <div className={`bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300`}>
                  <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name_ar}</h3>
                  <p className="text-sm text-gray-500">{productCounts[category.id] || 0} منتج</p>
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
