
-- Add images column to products table to store array of image URLs
ALTER TABLE public.products ADD COLUMN images text[];

-- Update existing products to have their current image_url as the first item in images array
UPDATE public.products 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE ARRAY[]::text[]
END;
