
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[] | null;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  category?: {
    name_ar: string;
  };
}

interface Category {
  id: string;
  name_ar: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: 0,
    original_price: null,
    image_url: null,
    images: [],
    stock_quantity: 0,
    is_featured: false,
    is_active: true,
    category_id: null
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name_ar)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('خطأ في تحميل المنتجات');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_ar');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleAddProduct = async () => {
    const { error } = await supabase
      .from('products')
      .insert([newProduct]);

    if (error) {
      console.error('Error adding product:', error);
      toast.error('خطأ في إضافة المنتج');
    } else {
      toast.success('تم إضافة المنتج بنجاح');
      setIsAddingNew(false);
      setNewProduct({
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        price: 0,
        original_price: null,
        image_url: null,
        images: [],
        stock_quantity: 0,
        is_featured: false,
        is_active: true,
        category_id: null
      });
      fetchProducts();
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        name_ar: editingProduct.name_ar,
        description: editingProduct.description,
        description_ar: editingProduct.description_ar,
        price: editingProduct.price,
        original_price: editingProduct.original_price,
        image_url: editingProduct.image_url,
        images: editingProduct.images,
        stock_quantity: editingProduct.stock_quantity,
        is_featured: editingProduct.is_featured,
        is_active: editingProduct.is_active,
        category_id: editingProduct.category_id
      })
      .eq('id', editingProduct.id);

    if (error) {
      console.error('Error updating product:', error);
      toast.error('خطأ في تحديث المنتج');
    } else {
      toast.success('تم تحديث المنتج بنجاح');
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('خطأ في حذف المنتج');
    } else {
      toast.success('تم حذف المنتج بنجاح');
      fetchProducts();
    }
  };

  const handleImageUpload = (imageUrls: string[], isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: imageUrls,
        image_url: imageUrls[0] || null
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: imageUrls,
        image_url: imageUrls[0] || null
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل المنتجات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم (English)</Label>
                  <Input
                    id="name"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">الاسم (العربية)</Label>
                  <Input
                    id="name_ar"
                    value={newProduct.name_ar || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">الوصف (English)</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ar">الوصف (العربية)</Label>
                  <Textarea
                    id="description_ar"
                    value={newProduct.description_ar || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">السعر الأصلي</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={newProduct.original_price || ''}
                    onChange={(e) => setNewProduct({ 
                      ...newProduct, 
                      original_price: e.target.value ? Number(e.target.value) : null 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">الكمية المتاحة</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={newProduct.stock_quantity || 0}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select 
                  value={newProduct.category_id || ''} 
                  onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>صور المنتج</Label>
                <ImageUpload
                  onUpload={(urls) => handleImageUpload(urls, false)}
                  existingImages={newProduct.images || []}
                  bucketName="product-images"
                />
              </div>

              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="is_featured"
                    checked={newProduct.is_featured || false}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">منتج مميز</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="is_active"
                    checked={newProduct.is_active !== false}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_active: checked })}
                  />
                  <Label htmlFor="is_active">نشط</Label>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button onClick={handleAddProduct} className="flex-1">
                  إضافة المنتج
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{product.name_ar}</h3>
                    {product.is_featured && (
                      <Badge variant="secondary">مميز</Badge>
                    )}
                    {!product.is_active && (
                      <Badge variant="destructive">غير نشط</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{product.description_ar}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>السعر: {product.price.toLocaleString()} جنيه</span>
                    <span>المخزون: {product.stock_quantity}</span>
                    {product.category && (
                      <span>الفئة: {product.category.name_ar}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>تعديل المنتج</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_name">الاسم (English)</Label>
                              <Input
                                id="edit_name"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_name_ar">الاسم (العربية)</Label>
                              <Input
                                id="edit_name_ar"
                                value={editingProduct.name_ar}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_description">الوصف (English)</Label>
                              <Textarea
                                id="edit_description"
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_description_ar">الوصف (العربية)</Label>
                              <Textarea
                                id="edit_description_ar"
                                value={editingProduct.description_ar}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="edit_price">السعر</Label>
                              <Input
                                id="edit_price"
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_original_price">السعر الأصلي</Label>
                              <Input
                                id="edit_original_price"
                                type="number"
                                value={editingProduct.original_price || ''}
                                onChange={(e) => setEditingProduct({ 
                                  ...editingProduct, 
                                  original_price: e.target.value ? Number(e.target.value) : null 
                                })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_stock_quantity">الكمية المتاحة</Label>
                              <Input
                                id="edit_stock_quantity"
                                type="number"
                                value={editingProduct.stock_quantity}
                                onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="edit_category">الفئة</Label>
                            <Select 
                              value={editingProduct.category_id || ''} 
                              onValueChange={(value) => setEditingProduct({ ...editingProduct, category_id: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الفئة" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name_ar}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>صور المنتج</Label>
                            <ImageUpload
                              onUpload={(urls) => handleImageUpload(urls, true)}
                              existingImages={editingProduct.images || []}
                              bucketName="product-images"
                            />
                          </div>

                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Switch
                                id="edit_is_featured"
                                checked={editingProduct.is_featured}
                                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_featured: checked })}
                              />
                              <Label htmlFor="edit_is_featured">منتج مميز</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Switch
                                id="edit_is_active"
                                checked={editingProduct.is_active}
                                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_active: checked })}
                              />
                              <Label htmlFor="edit_is_active">نشط</Label>
                            </div>
                          </div>

                          <div className="flex space-x-2 space-x-reverse">
                            <Button onClick={handleUpdateProduct} className="flex-1">
                              حفظ التغييرات
                            </Button>
                            <Button variant="outline" onClick={() => setEditingProduct(null)}>
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
