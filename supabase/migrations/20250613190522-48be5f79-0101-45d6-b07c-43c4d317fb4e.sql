
-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cod',
  shipping_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cart policies
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create storage policy for products bucket
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Insert sample categories
INSERT INTO public.categories (name, name_ar) VALUES 
('Electronics', 'إلكترونيات'),
('Computers', 'أجهزة كمبيوتر'),
('Phones', 'هواتف'),
('Cameras', 'كاميرات'),
('Audio', 'صوتيات'),
('Accessories', 'إكسسوارات');

-- Insert sample products with Egyptian prices
INSERT INTO public.products (name, name_ar, description, description_ar, price, original_price, category_id, stock_quantity, is_featured) 
SELECT 
  'Dell XPS 13 Laptop',
  'لابتوب ديل XPS 13',
  'High-performance laptop with Intel Core i7',
  'لابتوب عالي الأداء مع معالج إنتل كور i7',
  24999.00,
  29999.00,
  c.id,
  15,
  true
FROM public.categories c WHERE c.name = 'Computers'
UNION ALL
SELECT 
  'Apple Watch Series 9',
  'ساعة آبل الإصدار 9',
  'Latest smartwatch with health monitoring',
  'أحدث ساعة ذكية مع مراقبة الصحة',
  6499.00,
  7999.00,
  c.id,
  25,
  true
FROM public.categories c WHERE c.name = 'Accessories'
UNION ALL
SELECT 
  'Bose Wireless Headphones',
  'سماعات بوز اللاسلكية',
  'Premium noise-cancelling headphones',
  'سماعات فاخرة بخاصية إلغاء الضوضاء',
  4499.00,
  5499.00,
  c.id,
  30,
  false
FROM public.categories c WHERE c.name = 'Audio'
UNION ALL
SELECT 
  'Canon EOS R5 Camera',
  'كاميرا كانون EOS R5',
  'Professional mirrorless camera',
  'كاميرا احترافية بدون مرآة',
  64999.00,
  74999.00,
  c.id,
  8,
  true
FROM public.categories c WHERE c.name = 'Cameras'
UNION ALL
SELECT 
  'Samsung Galaxy S24',
  'سامسونج جالاكسي S24',
  'Latest flagship smartphone',
  'أحدث هاتف ذكي رائد',
  17499.00,
  19999.00,
  c.id,
  20,
  true
FROM public.categories c WHERE c.name = 'Phones'
UNION ALL
SELECT 
  'iPad Pro 12.9',
  'آيباد برو 12.9',
  'Professional tablet for creative work',
  'تابلت احترافي للعمل الإبداعي',
  20999.00,
  23999.00,
  c.id,
  12,
  false
FROM public.categories c WHERE c.name = 'Electronics';

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
