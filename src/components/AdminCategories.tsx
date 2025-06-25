
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    name_ar: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_ar');

    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('خطأ في تحميل الفئات');
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name_ar.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .insert({
        name: newCategory.name,
        name_ar: newCategory.name_ar,
        description: newCategory.description || null
      });

    if (error) {
      console.error('Error adding category:', error);
      if (error.code === '23505') {
        toast.error('هذه الفئة موجودة بالفعل');
      } else {
        toast.error('خطأ في إضافة الفئة');
      }
    } else {
      toast.success('تم إضافة الفئة بنجاح');
      setIsAddingNew(false);
      setNewCategory({
        name: '',
        name_ar: '',
        description: ''
      });
      fetchCategories();
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    if (!editingCategory.name_ar.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name: editingCategory.name,
        name_ar: editingCategory.name_ar,
        description: editingCategory.description || null
      })
      .eq('id', editingCategory.id);

    if (error) {
      console.error('Error updating category:', error);
      toast.error('خطأ في تحديث الفئة');
    } else {
      toast.success('تم تحديث الفئة بنجاح');
      setEditingCategory(null);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (checkError) {
      console.error('Error checking products:', checkError);
      toast.error('خطأ في التحقق من المنتجات');
      return;
    }

    if (products && products.length > 0) {
      toast.error('لا يمكن حذف هذه الفئة لأنها تحتوي على منتجات');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      toast.error('خطأ في حذف الفئة');
    } else {
      toast.success('تم حذف الفئة بنجاح');
      fetchCategories();
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل الفئات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفئات</h2>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة فئة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name_ar">اسم الفئة (العربية) *</Label>
                <Input
                  id="name_ar"
                  value={newCategory.name_ar}
                  onChange={(e) => setNewCategory({ ...newCategory, name_ar: e.target.value })}
                  placeholder="الإلكترونيات"
                />
              </div>

              <div>
                <Label htmlFor="name">اسم الفئة (English)</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Electronics"
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="وصف الفئة..."
                />
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button onClick={handleAddCategory} className="flex-1">
                  إضافة الفئة
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
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد فئات</p>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{category.name_ar}</h3>
                    {category.name && (
                      <p className="text-gray-600 mb-2">{category.name}</p>
                    )}
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      تم الإنشاء: {new Date(category.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>تعديل الفئة</DialogTitle>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit_name_ar">اسم الفئة (العربية) *</Label>
                              <Input
                                id="edit_name_ar"
                                value={editingCategory.name_ar}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit_name">اسم الفئة (English)</Label>
                              <Input
                                id="edit_name"
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit_description">الوصف</Label>
                              <Textarea
                                id="edit_description"
                                value={editingCategory.description || ''}
                                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                              />
                            </div>

                            <div className="flex space-x-2 space-x-reverse">
                              <Button onClick={handleUpdateCategory} className="flex-1">
                                حفظ التغييرات
                              </Button>
                              <Button variant="outline" onClick={() => setEditingCategory(null)}>
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
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
