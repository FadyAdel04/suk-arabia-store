
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Link, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (urls: string[]) => void;
  currentImage?: string[];
}

const ImageUpload = ({ onImageUploaded, currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(currentImage || []);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Handle file upload (multiple)
  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      // Check if bucket exists, create if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.id === 'product-images');
      
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket('product-images', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          toast.error('خطأ في إنشاء مجلد الصور');
          setUploading(false);
          return;
        }
      }

      let urls: string[] = [];

      for (const file of Array.from(event.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`خطأ في رفع الصورة: ${file.name}`);
          continue;
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          urls.push(data.publicUrl);
        }
      }

      if (urls.length > 0) {
        const allUrls = [...imageUrls, ...urls];
        setImageUrls(allUrls);
        onImageUploaded(allUrls);
        toast.success(`تم رفع ${urls.length} صورة بنجاح`);
        
        // Clear the file input
        if (event.target) {
          event.target.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("خطأ في رفع الصور");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    const val = imageUrlInput.trim();
    if (!val) {
      toast.error("يرجى إدخال رابط صورة صحيح");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(val);
    } catch {
      toast.error("رابط الصورة غير صحيح");
      return;
    }

    const allUrls = [...imageUrls, val];
    setImageUrls(allUrls);
    onImageUploaded(allUrls);
    setImageUrlInput('');
    toast.success('تم إضافة رابط الصورة');
  };

  const removeImage = (rmUrl: string) => {
    const allUrls = imageUrls.filter((url) => url !== rmUrl);
    setImageUrls(allUrls);
    onImageUploaded(allUrls);
  };

  return (
    <div className="space-y-4">
      <Label>صور المنتج</Label>
      
      {/* Preview */}
      <div className="flex flex-wrap gap-2">
        {imageUrls.map((img, i) => (
          <div key={i} className="relative">
            <img 
              src={img} 
              alt={`product-${i}`} 
              className="w-24 h-24 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={() => removeImage(img)}
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Upload method selector */}
      <div className="flex space-x-2 space-x-reverse">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
          type="button"
        >
          <Upload className="h-4 w-4 ml-2" />
          رفع ملف
        </Button>
        <Button
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          type="button"
        >
          <Link className="h-4 w-4 ml-2" />
          رابط صورة
        </Button>
      </div>
      
      {/* File upload */}
      {uploadMethod === "file" && (
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadFile}
            disabled={uploading}
            className="cursor-pointer"
          />
          {uploading && <p className="text-sm text-blue-600 mt-2">جاري رفع الصور...</p>}
        </div>
      )}
      
      {/* URL input */}
      {uploadMethod === "url" && (
        <div className="flex space-x-2 space-x-reverse">
          <Input
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button 
            type="button" 
            onClick={handleUrlSubmit} 
            disabled={!imageUrlInput.trim()}
          >
            إضافة
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
