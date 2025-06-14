
-- 1. Table for reviews
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable row level security and add basic policies
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to insert their own review" ON public.product_reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow anyone to select" ON public.product_reviews
  FOR SELECT USING (true);

-- 2. Table for multiple product images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow viewing images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert/delete/update" ON public.product_images
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin IS TRUE));

-- 3. Add is_active column to products if not exists, and ensure default is TRUE
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 4. Make sure only admins can update is_active
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable select active products for anyone" ON public.products
  FOR SELECT USING (is_active IS TRUE);

CREATE POLICY "Admins can edit products" ON public.products
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin IS TRUE));

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin IS TRUE));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin IS TRUE));
