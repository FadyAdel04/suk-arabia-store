import React, { useEffect, useState } from 'react';
import { 
  Laptop, Smartphone, Camera, Headphones, Watch, Tablet,
  Cpu, HardDrive, Printer, Gamepad2, Tv, Speaker, 
  SmartphoneCharging, MemoryStick, Mouse, Keyboard, 
  Monitor, Router, Power, Battery, WashingMachine,
  Refrigerator, Microwave, Fan, AirVent, Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

type CatIconInfo = {
  keys: string[]; // All possible names (ar/en) for mapping
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
};

const CATEGORY_ICON_MAPPINGS: CatIconInfo[] = [
  {
    keys: ["أجهزة كمبيوتر", "اجهزة كمبيوتر", "computer", "كمبيوتر", "laptop", "laptops", "pcs", "pc"],
    icon: Laptop,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    keys: ["هواتف ذكية", "هاتف ذكي", "هواتف", "هواتف محمولة", "phone", "smartphone", "mobile", "mobiles", "cellphone"],
    icon: Smartphone,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    keys: ["كاميرات", "كاميرا", "camera", "cameras", "التصوير", "photography"],
    icon: Camera,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    keys: ["سماعات", "سماعه", "headphone", "headphones", "earbuds", "سماعات الرأس", "audio", "صوت"],
    icon: Headphones,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    keys: ["ساعات ذكية", "ساعة ذكية", "ساعة", "watch", "smartwatch", "watches"],
    icon: Watch,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    keys: ["أجهزة لوحية", "جهاز لوحي", "tablet", "tablets", "ipad"],
    icon: Tablet,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  {
    keys: ["إلكترونيات", "الكترونيات", "electronics", "إكسسوارات", "اكسسوارات", "accessories"],
    icon: Cpu,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    keys: ["تخزين", "storage", "أقراص صلبة", "hard drive", "ssd", "hdd", "flash"],
    icon: HardDrive,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    keys: ["طابعات", "printer", "printers", "scanner", "scanners"],
    icon: Printer,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    keys: ["ألعاب", "أجهزة ألعاب", "gaming", "games", "console", "consoles"],
    icon: Gamepad2,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    keys: ["تلفزيونات", "شاشات", "tv", "television", "televisions", "monitor", "monitors"],
    icon: Tv,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    keys: ["مكبرات صوت", "speakers", "speaker", "sound system", "نظام صوت"],
    icon: Speaker,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    keys: ["إكسسوارات هواتف", "phone accessories", "شواحن", "chargers", "cables"],
    icon: SmartphoneCharging,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    keys: ["ذاكرة", "ram", "memory", "ذاكرة الوصول العشوائي"],
    icon: MemoryStick,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
  },
  {
    keys: ["فأرة", "ماوس", "mouse", "mice"],
    icon: Mouse,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
  {
    keys: ["لوحة مفاتيح", "keyboard", "keyboards"],
    icon: Keyboard,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    keys: ["شاشة", "monitor", "شاشات كمبيوتر"],
    icon: Monitor,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    keys: ["راوتر", "router", "routers", "شبكة", "network"],
    icon: Router,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-100',
  },
  {
    keys: ["طاقة", "power", "battery", "بطارية"],
    icon: Battery,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
  },
  {
    keys: ["أجهزة منزلية", "أجهزة كهربائية", "home appliances", "appliances"],
    icon: WashingMachine,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
  },
  {
    keys: ["ثلاجة", "refrigerator", "ثلاجات"],
    icon: Refrigerator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    keys: ["ميكروويف", "microwave", "microwaves"],
    icon: Microwave,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    keys: ["مروحة", "fan", "fans"],
    icon: Fan,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    keys: ["تكييف", "air conditioner", "تكييفات"],
    icon: AirVent,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    keys: ["إضاءة", "lighting", "lights", "لمبات"],
    icon: Lightbulb,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    keys: ["أدوات مطبخ", "kitchen tools", "أدوات طبخ"],
    icon: Microwave, // Could use a more specific icon if available
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  }
];

function getCategoryIconConfig(categoryName: string) {
  if (!categoryName) return { 
    icon: Cpu, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  };
  
  const normalized = categoryName.trim().toLowerCase();
  
  for (const mapping of CATEGORY_ICON_MAPPINGS) {
    if (mapping.keys.some(key => key.toLowerCase() === normalized)) {
      return mapping;
    }
  }
  
  // Fallback default
  return { 
    icon: Cpu, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  };
}

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<{[k: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name_ar', { ascending: true });

        if (error) throw error;

        setCategories(data || []);
        await countProductsPerCategory(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const countProductsPerCategory = async (cats: any[]) => {
    const counts: {[k:string]: number} = {};
    
    for (const cat of cats) {
      const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true);

      if (!error) {
        counts[cat.id] = count || 0;
      }
    }
    
    setProductCounts(counts);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">جاري تحميل الفئات...</div>
        </div>
      </section>
    );
  }

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

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const { icon: Icon, color, bgColor } = getCategoryIconConfig(category.name_ar || category.name);
              
              return (
                <Link 
                  to={{
                    pathname: "/shop",
                    search: `?category=${category.id}` // This will pass the category ID as a query parameter
                  }}
                  key={category.id}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 md:h-8 md:w-8 ${color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">
                      {category.name_ar}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-auto">
                      {productCounts[category.id] || 0} منتج
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد فئات متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
