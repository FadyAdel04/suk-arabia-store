
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Link, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast.success('تم رفع الصورة بنجاح');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطأ في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast.error('يرجى إدخال رابط صورة صحيح');
      return;
    }
    
    onImageUploaded(imageUrl);
    toast.success('تم تحديث رابط الصورة');
    setImageUrl('');
  };

  return (
    <div className="space-y-4">
      <Label>صورة المنتج</Label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={currentImage}
                alt="صورة المنتج الحالية"
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onImageUploaded('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Method Toggle */}
      <div className="flex space-x-2 space-x-reverse">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
        >
          <Upload className="h-4 w-4 ml-2" />
          رفع ملف
        </Button>
        <Button
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
        >
          <Link className="h-4 w-4 ml-2" />
          رابط صورة
        </Button>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={uploadFile}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">جاري رفع الصورة...</p>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="flex space-x-2 space-x-reverse">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
            تحديث
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
