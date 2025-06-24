import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  original_price: number;
  image_url: string;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  category_id: string;
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: 0,
    original_price: 0,
    category_id: '',
    stock_quantity: 0,
    is_featured: false,
    is_active: true,
    images: [] as string[]
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
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
      toast.error('Failed to fetch categories.');
    } else {
      setCategories(data || []);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.name_ar || !newProduct.description || !newProduct.description_ar || !newProduct.price || !newProduct.category_id || !newProduct.stock_quantity) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: newProduct.name,
          name_ar: newProduct.name_ar,
          description: newProduct.description,
          description_ar: newProduct.description_ar,
          price: newProduct.price,
          original_price: newProduct.original_price || null,
          category_id: newProduct.category_id,
          stock_quantity: newProduct.stock_quantity,
          is_featured: newProduct.is_featured,
          is_active: newProduct.is_active,
          image_url: newProduct.images[0] || null,
          images: newProduct.images
        }
      ]);

    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product.');
    } else {
      toast.success('Product added successfully!');
      setProducts([...products, ...(data || [])]);
      setNewProduct({
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        price: 0,
        original_price: 0,
        category_id: '',
        stock_quantity: 0,
        is_featured: false,
        is_active: true,
        images: [] as string[]
      });
      setProductImages([]);
      setShowAddForm(false);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        name_ar: editingProduct.name_ar,
        description: editingProduct.description,
        description_ar: editingProduct.description_ar,
        price: editingProduct.price,
        original_price: editingProduct.original_price || null,
        category_id: editingProduct.category_id,
        stock_quantity: editingProduct.stock_quantity,
        is_featured: editingProduct.is_featured,
        is_active: editingProduct.is_active,
        image_url: editingProduct.images[0] || null,
        images: editingProduct.images
      })
      .eq('id', editingProduct.id);

    if (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product.');
    } else {
      toast.success('Product updated successfully!');
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? editingProduct : product
        )
      );
      setEditingProduct(null);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product.');
    } else {
      toast.success('Product deleted successfully!');
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const newImageUrl = data.publicUrl;
      
      if (editingProduct) {
        const updatedImages = [...(editingProduct.images || []), newImageUrl];
        setEditingProduct({ ...editingProduct, images: updatedImages });
      } else {
        setProductImages([...productImages, newImageUrl]);
        setNewProduct({ ...newProduct, images: [...productImages, newImageUrl] });
      }
      
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطأ في رفع الصورة');
    }
  };

  const removeImage = (index: number) => {
    if (editingProduct) {
      const updatedImages = editingProduct.images?.filter((_, i) => i !== index) || [];
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      const updatedImages = productImages.filter((_, i) => i !== index);
      setProductImages(updatedImages);
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'إخفاء النموذج' : 'إضافة منتج جديد'}
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة منتج جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name_ar">اسم المنتج (عربي)</Label>
              <Input
                id="name_ar"
                type="text"
                value={newProduct.name_ar}
                onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">اسم المنتج (انجليزي)</Label>
              <Input
                id="name"
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">وصف المنتج (عربي)</Label>
              <Textarea
                id="description_ar"
                value={newProduct.description_ar}
                onChange={(e) => setNewProduct({ ...newProduct, description_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">وصف المنتج (انجليزي)</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">السعر</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="original_price">السعر الأصلي</Label>
              <Input
                id="original_price"
                type="number"
                value={newProduct.original_price}
                onChange={(e) => setNewProduct({ ...newProduct, original_price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="category_id">الفئة</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر فئة" />
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
            <div>
              <Label htmlFor="stock_quantity">الكمية في المخزن</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={newProduct.stock_quantity}
                onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={newProduct.is_featured}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_featured: checked })}
              />
              <Label htmlFor="is_featured">منتج مميز</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newProduct.is_active}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_active: checked })}
              />
              <Label htmlFor="is_active">مفعل</Label>
            </div>

            {/* Image Upload Section */}
            <div>
              <Label>صور المنتج</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <Button type="button" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                
                {productImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">
                            رئيسية
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button onClick={addProduct}>إضافة المنتج</Button>
          </CardContent>
        </Card>
      )}

      {editingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>تعديل المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name_ar">اسم المنتج (عربي)</Label>
              <Input
                id="name_ar"
                type="text"
                value={editingProduct.name_ar}
                onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">اسم المنتج (انجليزي)</Label>
              <Input
                id="name"
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">وصف المنتج (عربي)</Label>
              <Textarea
                id="description_ar"
                value={editingProduct.description_ar}
                onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">وصف المنتج (انجليزي)</Label>
              <Textarea
                id="description"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">السعر</Label>
              <Input
                id="price"
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="original_price">السعر الأصلي</Label>
              <Input
                id="original_price"
                type="number"
                value={editingProduct.original_price || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="category_id">الفئة</Label>
              <Select onValueChange={(value) => setEditingProduct({ ...editingProduct, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر فئة" value={editingProduct.category_id}>
                    {categories.find(cat => cat.id === editingProduct.category_id)?.name_ar || "اختر فئة"}
                  </SelectValue>
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
            <div>
              <Label htmlFor="stock_quantity">الكمية في المخزن</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={editingProduct.stock_quantity}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={editingProduct.is_featured}
                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_featured: checked })}
              />
              <Label htmlFor="is_featured">منتج مميز</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editingProduct.is_active}
                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_active: checked })}
              />
              <Label htmlFor="is_active">مفعل</Label>
            </div>

            {/* Image Upload Section for Edit */}
            <div>
              <Label>صور المنتج</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <Button type="button" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {editingProduct.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">
                            رئيسية
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button onClick={updateProduct}>تعديل المنتج</Button>
            <Button variant="secondary" onClick={() => setEditingProduct(null)}>إلغاء</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name_ar}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name_ar}
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <p className="text-gray-600 line-clamp-2">{product.description_ar}</p>
                <div className="flex justify-between items-center mt-4">
                  <span>السعر: {product.price}</span>
                  <span>المخزون: {product.stock_quantity}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
