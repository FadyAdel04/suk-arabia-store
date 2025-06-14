
import React, { useEffect, useState } from 'react';
import { Laptop, Smartphone, Camera, Headphones, Watch, Tablet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type CatIconInfo = {
  keys: string[]; // All possible names (ar/en) for mapping
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

// List of recognized names (ar/en etc.), feels robust for future expansion
const CATEGORY_ICON_MAPPINGS: CatIconInfo[] = [
  {
    keys: ["أجهزة كمبيوتر", "اجهزة كمبيوتر", "computer", "كمبيوتر", "laptop", "laptops", "pcs", "pc"],
    icon: Laptop,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    keys: ["هواتف ذكية", "هاتف ذكي", "هواتف", "هواتف محمولة", "phone", "smartphone", "mobile", "mobiles", "cellphone"],
    icon: Smartphone,
    color: 'bg-green-100 text-green-600',
  },
  {
    keys: ["كاميرات", "كاميرا", "camera", "cameras"],
    icon: Camera,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    keys: ["سماعات", "سماعه", "headphone", "headphones", "earbuds", "سماعات الرأس"],
    icon: Headphones,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    keys: ["ساعات ذكية", "ساعة ذكية", "ساعة", "watch", "smartwatch", "watches"],
    icon: Watch,
    color: 'bg-red-100 text-red-600',
  },
  {
    keys: ["أجهزة لوحية", "جهاز لوحي", "tablet", "tablets", "ipad"],
    icon: Tablet,
    color: 'bg-teal-100 text-teal-600',
  },
];

function getCategoryIconConfig(categoryName: string) {
  if (!categoryName) return { icon: Laptop, color: 'bg-blue-100 text-blue-600' };
  const normalized = categoryName.trim().toLowerCase();
  for (const mapping of CATEGORY_ICON_MAPPINGS) {
    if (mapping.keys.some(
      key => key.toLowerCase() === normalized
    )) {
      return { icon: mapping.icon, color: mapping.color };
    }
  }
  // Fallback default
  return { icon: Laptop, color: 'bg-blue-100 text-blue-600' };
}

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<{[k: string]: number}>({});

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .then((res) => {
        setCategories(res.data || []);
        countProductsPerCategory(res.data || []);
      });
  }, []);

  const countProductsPerCategory = async (cats: any[]) => {
    const cpy: {[k:string]: number} = {};
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
            const { icon: Icon, color } = getCategoryIconConfig(category.name_ar || category.name);
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
