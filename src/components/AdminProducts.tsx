
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  original_price: number | null;
  category_id: string;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState('');
  const [activeEdit, setActiveEdit] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name') as string,
      name_ar: formData.get('name_ar') as string,
      description: formData.get('description') as string,
      description_ar: formData.get('description_ar') as string,
      price: parseFloat(formData.get('price') as string),
      original_price: parseFloat(formData.get('original_price') as string) || null,
      category_id: formData.get('category_id') as string,
      image_url: productImageUrl || editingProduct?.image_url || '',
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      is_featured: formData.get('is_featured') === 'true',
      is_active: formData.get('is_active') === 'true'
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('خطأ في تحديث المنتج');
      } else {
        toast.success('تم تحديث المنتج بنجاح');
        fetchProducts();
        setIsDialogOpen(false);
        setEditingProduct(null);
        setProductImageUrl('');
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        toast.error('خطأ في إضافة المنتج');
      } else {
        toast.success('تم إضافة المنتج بنجاح');
        fetchProducts();
        setIsDialogOpen(false);
        setProductImageUrl('');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('خطأ في حذف المنتج');
    } else {
      toast.success('تم حذف المنتج بنجاح');
      fetchProducts();
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductImageUrl(product.image_url);
    setActiveEdit(product.is_active);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setProductImageUrl('');
    setActiveEdit(true);
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: string, val: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: val })
      .eq('id', id);

    if (!error) {
      toast.success(`تم ${val ? 'إظهار' : 'إخفاء'} المنتج`);
      fetchProducts();
    } else {
      toast.error('تعذر تحديث حالة المنتج');
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">المنتجات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                onImageUploaded={setProductImageUrl}
                currentImage={productImageUrl}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم (English)</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">الاسم (العربية)</Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    defaultValue={editingProduct?.name_ar || ''}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">الوصف (English)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingProduct?.description || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ar">الوصف (العربية)</Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    defaultValue={editingProduct?.description_ar || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.price || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">السعر الأصلي</Label>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.original_price || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">الكمية</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    defaultValue={editingProduct?.stock_quantity || ''}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category_id">الفئة</Label>
                <Select name="category_id" defaultValue={editingProduct?.category_id || 'none'}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" disabled>اختر الفئة</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="is_featured">منتج مميز</Label>
                  <Select name="is_featured" defaultValue={editingProduct?.is_featured ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">نعم</SelectItem>
                      <SelectItem value="false">لا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="is_active">عرض المنتج</Label>
                  <Select
                    name="is_active"
                    defaultValue={editingProduct?.is_active ? 'true' : 'false'}
                    onValueChange={(val) => setActiveEdit(val === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">ظاهر في الموقع</SelectItem>
                      <SelectItem value="false">مخفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name_ar}
                  className="w-full h-52 object-cover rounded-lg"
                  style={{ aspectRatio: '1/1' }}
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant={product.is_active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleActive(product.id, !product.is_active)}
                  >
                    {product.is_active ? 'إخفاء' : 'إظهار'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{product.name_ar}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{product.description_ar}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">{product.price.toLocaleString()} جنيه</span>
                <span className="text-sm text-gray-500">المخزون: {product.stock_quantity}</span>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
